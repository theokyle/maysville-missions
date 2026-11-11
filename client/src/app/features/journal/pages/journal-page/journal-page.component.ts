import { Component, computed, inject, signal } from '@angular/core';

import { ProgressService } from '../../services/progress.service';
import {
  Activity,
  CreateActivityPayload,
  StepProgress,
  JournalEntry,
} from '../../../../shared/models/progress.models';
import { ActivityFiltersComponent } from '../../components/activity-filters/activity-filters.component';
import { ActivityTimelineComponent } from '../../components/activity-timeline/activity-timeline.component';
import {
  ActivityFormComponent,
  ActivityFormSubmission,
} from '../../components/activity-form/activity-form.component';

@Component({
  selector: 'app-journal-page',
  standalone: true,
  imports: [ActivityFiltersComponent, ActivityTimelineComponent, ActivityFormComponent],
  templateUrl: './journal-page.component.html',
})
export class JournalPageComponent {
  private progressService = inject(ProgressService);

  stepProgress = signal<StepProgress[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedJourneyId = signal<string>('');
  selectedStepInstanceId = signal<string>('');

  editingActivity = signal<Activity | null>(null);
  showForm = signal(false);

  // All step progress records.
  steps = computed(() => this.stepProgress());

  // Flatten activities into journal entries.
  entries = computed<JournalEntry[]>(() => {
    return this.stepProgress()
      .flatMap((stepProgress) =>
        stepProgress.activities.map((activity) => ({
          id: activity.id,
          activityId: activity.id,
          stepProgressId: stepProgress.id,
          name: activity.name,
          note: activity.note,
          createdAt: activity.createdAt,
          journeyId: stepProgress.journeyInstance.journeyId,
          journeyTitle: stepProgress.journeyInstance.journey.title,
          journeyIcon: stepProgress.journeyInstance.journey.icon,
          journeyType: stepProgress.journeyInstance.journey.type,
          groupName: stepProgress.journeyInstance.group?.name ?? null,
          stepTitle: stepProgress.journeyStep.title,
        })),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  // Journey options for the filter.
  journeyOptions = computed(() => {
    const uniqueJourneys = new Map<string, string>();

    this.stepProgress().forEach((step) => {
      const journey = step.journeyInstance.journey;
      uniqueJourneys.set(journey.id, journey.title);
    });

    return Array.from(uniqueJourneys, ([id, title]) => ({
      id,
      title,
    }));
  });

  // Filter journal entries by selected journey.
  filteredActivities = computed(() => {
    const selectedId = this.selectedJourneyId();

    if (!selectedId) {
      return this.entries();
    }

    return this.entries().filter((entry) => entry.journeyId === selectedId);
  });

  constructor() {
    this.loadJournal();
  }

  loadJournal() {
    this.loading.set(true);
    this.error.set(null);

    this.progressService.getAllSteps().subscribe({
      next: (steps) => {
        this.stepProgress.set(steps);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load your journal.');
        this.loading.set(false);
      },
    });
  }

  selectStep(stepProgressId: string) {
    this.selectedStepInstanceId.set(stepProgressId);
    this.editingActivity.set(null);
    this.showForm.set(true);
  }

  editActivity(entry: JournalEntry) {
    const step = this.stepProgress().find((item) => item.id === entry.stepProgressId);

    const activity = step?.activities.find((item) => item.id === entry.activityId);

    if (!activity) return;

    this.selectedStepInstanceId.set(entry.stepProgressId);
    this.editingActivity.set(activity);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingActivity.set(null);
    this.selectedStepInstanceId.set('');
  }

  saveActivity(submission: ActivityFormSubmission) {
    const { stepInstanceId, data } = submission;

    if (!stepInstanceId) return;

    const editing = this.editingActivity();

    const request = editing
      ? this.progressService.updateActivity(stepInstanceId, editing.id, data)
      : this.progressService.addActivity(stepInstanceId, data);

    request.subscribe({
      next: () => {
        this.closeForm();
        this.loadJournal();
      },
      error: () => {
        this.error.set('Unable to save your activity.');
      },
    });
  }

  deleteActivity(activity: JournalEntry) {
    this.progressService.deleteActivity(activity.stepProgressId, activity.id).subscribe({
      next: () => this.loadJournal(),
      error: () => {
        this.error.set('Unable to delete your activity.');
      },
    });
  }
}
