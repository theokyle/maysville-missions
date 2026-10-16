import { Component, input, inject, signal } from '@angular/core';
import { Journey } from '../../../types/journey';
import { JourneyService } from '../journey-service';
import { Router } from '@angular/router';
import { JournalService } from '../../journal/journal-service';

@Component({
  selector: 'journey-card',
  imports: [],
  templateUrl: './journey-card.html',
  styleUrl: './journey-card.css',
})
export class JourneyCard {
  journey = input<Journey>();
  private journeyService = inject(JourneyService);
  private journalService = inject(JournalService);
  private router = inject(Router);
  enrolledJourneyIds = signal<string[]>([]);

  ngOnInit() {
    this.journalService.getUserJourneys().subscribe({
      next: (journeys) => {
        this.enrolledJourneyIds.set(journeys.map((journey) => journey.journeyId));
      },
      error: (error) => {
        console.error('Failed to load enrolled journeys:', error);
      },
    });
  }

  isEnrolled(journeyId: string): boolean {
    return this.enrolledJourneyIds().includes(journeyId);
  }

  enroll(journeyId: string) {
    this.journeyService.enroll(journeyId).subscribe({
      next: () => {
        this.router.navigate(['/journal']);
      },
      error: (error) => {
        console.error('Failed to enroll in journey:', error);
      },
    });
  }
}
