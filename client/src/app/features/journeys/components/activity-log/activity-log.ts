import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Activity } from '../../../../shared/models/activity.model';
import { JourneyEnrollment, JourneyStepProgress } from '../../../../shared/models/journeys.models';
import { ProgressService } from '../../../journal/services/progress.service';
import { FormsModule } from '@angular/forms';

type DrawerMode = 'create' | 'view' | 'edit';

interface ActivityFormModel {
  name: string;
  note: string;
}

@Component({
  selector: 'activity-log',
  standalone: true,
  imports: [FormField, FormsModule],
  templateUrl: './activity-log.html',
})
export class ActivityLog {
  private progressService = inject(ProgressService);

  activity = input<Activity | null>(null);
  journeys = input<JourneyEnrollment[]>([]);
  selectedStep = input<JourneyStepProgress | null>(null);

  closed = output<void>();
  saved = output<void>();

  mode = signal<DrawerMode>('create');
  selectedStepId = signal('');

  activityModel = signal<ActivityFormModel>({
    name: '',
    note: '',
  });

  activityForm = form(this.activityModel, (path) => {
    required(path.name);
  });

  isCreateMode = computed(() => this.mode() === 'create');
  isViewMode = computed(() => this.mode() === 'view');
  isEditMode = computed(() => this.mode() === 'edit');

  saving = signal(false);
  deleting = signal(false);
  errorMessage = signal('');

  constructor() {
    effect(() => {
      const activity = this.activity();
      const selectedStep = this.selectedStep();

      if (activity) {
        this.activityModel.set({
          name: activity.name ?? '',
          note: activity.note ?? '',
        });

        this.selectedStepId.set(activity.stepInstanceId);
        this.mode.set('view');
      } else {
        this.activityModel.set({
          name: '',
          note: '',
        });

        this.selectedStepId.set(selectedStep?.id ?? '');
        this.mode.set('create');
      }

      this.errorMessage.set('');
    });
  }

  openForCreate(): void {
    this.activityModel.set({ name: '', note: '' });
    this.selectedStepId.set(this.selectedStep()?.id ?? '');
    this.mode.set('create');
    this.errorMessage.set('');
  }

  openForView(activity: Activity): void {
    this.activityModel.set({
      name: activity.name ?? '',
      note: activity.note ?? '',
    });
    this.selectedStepId.set(activity.stepInstanceId);
    this.mode.set('view');
    this.errorMessage.set('');
  }

  startEditing(): void {
    this.mode.set('edit');
  }

  cancelEditing(): void {
    const activity = this.activity();

    if (activity) {
      this.activityModel.set({
        name: activity.name ?? '',
        note: activity.note ?? '',
      });
      this.mode.set('view');
    } else {
      this.closed.emit();
    }
  }

  close(): void {
    this.closed.emit();
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.activityForm().invalid() || this.saving()) {
      return;
    }

    const value = this.activityModel();
    const activity = this.activity();

    const dto = {
      name: value.name.trim(),
      note: value.note.trim() || undefined,
    };

    if (!dto.name) {
      this.errorMessage.set('Enter an activity name.');
      return;
    }

    if (this.mode() === 'edit' && !activity) {
      this.errorMessage.set('Unable to find the activity to update.');
      return;
    }

    if (this.mode() === 'create' && !this.selectedStepId()) {
      this.errorMessage.set('Select a journey step.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const request =
      this.mode() === 'edit' && activity
        ? this.progressService.updateActivity(activity.stepInstanceId, activity.id, dto)
        : this.progressService.addActivity(this.selectedStepId(), dto);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: (error) => {
        console.error('Failed to save activity:', error);
        this.saving.set(false);
        this.errorMessage.set('Unable to save activity. Please try again.');
      },
    });
  }

  deleteActivity(): void {
    const activity = this.activity();

    if (!activity || this.deleting()) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this activity? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set('');

    this.progressService.deleteActivity(activity.stepInstanceId, activity.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.saved.emit();
      },
      error: (error) => {
        console.error('Failed to delete activity:', error);
        this.deleting.set(false);
        this.errorMessage.set('Unable to delete activity. Please try again.');
      },
    });
  }
}
