import { Component, inject, OnInit, signal } from '@angular/core';

import { JourneysService } from '../../services/journey-service';
import { Journey, JourneyEnrollment } from '../../../../shared/models/journeys.models';
import { JourneyListComponent } from '../../components/journey-list/journey-list';

@Component({
  selector: 'app-discover-journeys-page',
  standalone: true,
  imports: [JourneyListComponent],
  templateUrl: './discover-journeys.html',
})
export class DiscoverJourneysPageComponent implements OnInit {
  private journeysService = inject(JourneysService);

  journeys = signal<Journey[]>([]);
  enrollments = signal<JourneyEnrollment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  enrolledJourneyIds = () => this.enrollments().map((enrollment) => enrollment.journeyId);

  ngOnInit(): void {
    this.loadJourneys();
  }

  loadJourneys(): void {
    this.loading.set(true);
    this.error.set(null);

    this.journeysService.getJourneys().subscribe({
      next: (journeys) => {
        this.journeys.set(journeys);
        this.loadEnrollments();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load journeys. Please try again.');
      },
    });
  }

  private loadEnrollments(): void {
    this.journeysService.getMyJourneys().subscribe({
      next: (enrollments) => {
        this.enrollments.set(enrollments);
        this.loading.set(false);
      },
      error: () => {
        // Journey discovery can still work if enrollment lookup fails.
        this.loading.set(false);
      },
    });
  }
}
