import { Component, inject, input, output, signal } from '@angular/core';

import { JourneysService } from '../../services/journey-service';
import { JourneyEnrollment } from '../../../../shared/models/journeys.models';

@Component({
  selector: 'app-journey-enrollment-button',
  standalone: true,
  templateUrl: './journey-enrollment-button.html',
})
export class JourneyEnrollmentButtonComponent {
  private journeysService = inject(JourneysService);

  journeyId = input.required<string>();
  enrolled = input(false);

  enrollmentComplete = output<JourneyEnrollment>();

  loading = signal(false);
  error = signal<string | null>(null);

  enroll(): void {
    if (this.loading() || this.enrolled()) return;

    this.loading.set(true);
    this.error.set(null);

    this.journeysService.enroll(this.journeyId()).subscribe({
      next: (enrollment) => {
        this.loading.set(false);
        this.enrollmentComplete.emit(enrollment);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409
            ? 'You are already enrolled in this journey.'
            : 'Unable to enroll right now. Please try again.',
        );
      },
    });
  }
}
