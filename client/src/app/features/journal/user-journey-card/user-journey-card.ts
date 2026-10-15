import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { JourneyInstance } from '../../../types/journey';
import { JourneyService } from '../../journeys/journey-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'user-journey-card',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './user-journey-card.html',
  styleUrl: './user-journey-card.css',
})
export class UserJourneyCard {
  userJourney = input<JourneyInstance>();
  private journeyService = inject(JourneyService);
  enrollmentChange = output<{
    journeyId: string;
    status: 'ABANDONED' | 'IN_PROGRESS';
  }>();

  faTrash = faTrash;

  // All step instances for this journey
  stepInstances = computed(() => this.userJourney()?.stepInstances ?? []);

  // Number of completed steps
  completedSteps = computed(() => this.stepInstances().filter((step) => step.completed).length);

  // Total number of steps
  totalSteps = computed(() => this.stepInstances().length);

  // Number of steps not yet completed
  remainingSteps = computed(() => this.totalSteps() - this.completedSteps());

  // Overall journey completion percentage
  progressPercent = computed(() => {
    const total = this.totalSteps();

    if (total === 0) {
      return 0;
    }

    return Math.round((this.completedSteps() / total) * 100);
  });

  // Handle logging an activity
  openLogActivity(journey: JourneyInstance): void {
    // TODO: Open your activity logging dialog or navigate
    // to your activity logging form.
    console.log('Log activity for journey instance:', journey.id);
  }

  unenroll() {
    const journey = this.userJourney();

    if (!journey) return;

    this.journeyService.unenroll(journey.journeyId).subscribe({
      next: () => {
        this.enrollmentChange.emit({
          journeyId: journey.journeyId,
          status: 'ABANDONED',
        });
      },
      error: (error) => {
        console.error('Failed to abandon journey', error);
      },
    });
  }

  rejoin() {
    const journey = this.userJourney();

    if (!journey) return;

    this.journeyService.rejoin(journey.journeyId).subscribe({
      next: () => {
        this.enrollmentChange.emit({
          journeyId: journey.journeyId,
          status: 'IN_PROGRESS',
        });
      },
      error: (error) => {
        console.error('Failed to rejoin journey', error);
      },
    });
  }
}
