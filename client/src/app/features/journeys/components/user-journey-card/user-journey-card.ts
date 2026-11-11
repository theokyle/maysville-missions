import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Activity,
  JourneyEnrollment,
  JourneyStepProgress,
} from '../../../../shared/models/journeys.models';

@Component({
  selector: 'app-user-journey-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './user-journey-card.html',
})
export class UserJourneyCardComponent {
  journey = input.required<JourneyEnrollment>();

  logActivityRequested = output<JourneyStepProgress>();
  activitySelected = output<Activity>();

  unenrollRequested = output<string>();
  rejoinRequested = output<string>();

  stepInstances = computed(() =>
    [...this.journey().stepInstances].sort(
      (a, b) => a.journeyStep.sortOrder - b.journeyStep.sortOrder,
    ),
  );

  completedSteps = computed(() => this.stepInstances().filter((step) => step.completed).length);

  totalSteps = computed(() => this.stepInstances().length);

  remainingSteps = computed(() => this.totalSteps() - this.completedSteps());

  progressPercent = computed(() => {
    const total = this.totalSteps();

    return total ? Math.round((this.completedSteps() / total) * 100) : 0;
  });

  openLogActivity(step: JourneyStepProgress): void {
    this.logActivityRequested.emit(step);
  }

  openActivity(activity: Activity): void {
    this.activitySelected.emit(activity);
  }

  unenroll(): void {
    const journey = this.journey();

    if (journey.status !== 'IN_PROGRESS') return;

    const confirmed = window.confirm(
      `Are you sure you want to leave "${journey.journey.title}"? Your progress will be retained, and you can rejoin later.`,
    );

    if (confirmed) {
      this.unenrollRequested.emit(journey.journeyId);
    }
  }

  rejoin(): void {
    if (this.journey().status !== 'ABANDONED') return;

    this.rejoinRequested.emit(this.journey().journeyId);
  }

  openNextStepActivity(): void {
    const nextStep = this.stepInstances().find((step) => !step.completed);

    if (nextStep) {
      this.openLogActivity(nextStep);
    }
  }
}
