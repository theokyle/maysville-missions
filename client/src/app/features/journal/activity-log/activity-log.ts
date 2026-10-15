import { Component, computed, input, output, signal, inject, effect } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { Activity, JourneyInstance } from '../../../types/journey';
import { JournalService } from '../journal-service';

type DrawerMode = 'create' | 'view' | 'edit';

interface ActivityFormModel {
  name: string;
  note: string;
}

@Component({
  selector: 'activity-log',
  imports: [FormField],
  templateUrl: './activity-log.html',
})
export class ActivityLog {
  private journalService = inject(JournalService);
  activity = input<Activity | null>(null);
  journeys = input<JourneyInstance[]>([]);

  closed = output<void>();
  saved = output<void>();

  mode = signal<DrawerMode>('create');

  selectedStepId = signal<string>('');

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
  errorMessage = signal('');

  deleting = signal(false);

  constructor() {
    effect(() => {
      const activity = this.activity();

      if (activity) {
        this.activityModel.set({
          name: activity.name ?? '',
          note: activity.note ?? '',
        });

        this.mode.set('view');
      } else {
        this.activityModel.set({ name: '', note: '' });
        this.mode.set('create');
      }

      this.errorMessage.set('');
    });
  }

  openForCreate() {
    this.activityModel.set({ name: '', note: '' });
    this.selectedStepId.set('');
    this.mode.set('create');
    this.errorMessage.set('');
  }

  openForView(activity: Activity) {
    this.activityModel.set({
      name: activity.name ?? '',
      note: activity.note ?? '',
    });
    this.mode.set('view');
    this.errorMessage.set('');
  }

  startEditing() {
    this.mode.set('edit');
  }

  cancelEditing() {
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

  close() {
    this.closed.emit();
  }

  submit(event: SubmitEvent) {
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

    // Prevent submitting an empty activity name.
    if (!dto.name) {
      this.errorMessage.set('Enter an activity name.');
      return;
    }

    // Editing requires an existing activity.
    if (this.mode() === 'edit' && !activity) {
      this.errorMessage.set('Unable to find the activity to update.');
      return;
    }

    // Creating requires a selected step.
    if (this.mode() === 'create' && !this.selectedStepId()) {
      this.errorMessage.set('Select a journey step.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const request =
      this.mode() === 'edit' && activity
        ? this.journalService.updateActivity(activity.stepInstanceId, activity.id, dto)
        : this.journalService.addActivity(this.selectedStepId(), dto);

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

  deleteActivity() {
    const activity = this.activity();

    if (!activity || this.deleting()) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this activity? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set('');

    this.journalService.deleteActivity(activity.stepInstanceId, activity.id).subscribe({
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
