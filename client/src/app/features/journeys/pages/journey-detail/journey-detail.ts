import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { JourneysService } from '../../services/journey-service';
import {
  Journey,
  JourneyEnrollment,
  JourneyStepProgress,
} from '../../../../shared/models/journeys.models';

import { JourneyEnrollmentButtonComponent } from '../../components/journey-enrollment-button/journey-enrollment-button';
import { JourneyVideoComponent } from '../../components/journey-video/journey-video';

@Component({
  selector: 'app-journey-detail-page',
  standalone: true,
  imports: [RouterLink, JourneyEnrollmentButtonComponent, JourneyVideoComponent],
  templateUrl: './journey-detail.html',
})
export class JourneyDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private journeysService = inject(JourneysService);

  journey = signal<Journey | null>(null);
  enrollment = signal<JourneyEnrollment | null>(null);

  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const journeyId = this.route.snapshot.paramMap.get('id');

    if (!journeyId) {
      this.error.set('Journey not found.');
      this.loading.set(false);
      return;
    }

    this.loadJourney(journeyId);
  }

  loadJourney(journeyId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.journeysService.getJourney(journeyId).subscribe({
      next: (journey) => {
        this.journey.set(journey);
        this.loadEnrollment(journeyId, journey.type);
      },
      error: () => {
        this.error.set('Unable to load this journey.');
        this.loading.set(false);
      },
    });
  }

  private loadEnrollment(journeyId: string, type: Journey['type']): void {
    const enrollmentRequest =
      type === 'GROUP'
        ? this.journeysService.getMyGroupJourneys()
        : this.journeysService.getMyJourneys();

    enrollmentRequest.subscribe({
      next: (enrollments) => {
        const existing = enrollments.find((item) => item.journeyId === journeyId);

        this.enrollment.set(existing ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onEnrollmentComplete(enrollment: JourneyEnrollment): void {
    this.enrollment.set(enrollment);
  }

  get stepProgress(): JourneyStepProgress[] {
    return this.enrollment()?.stepInstances ?? [];
  }
}
