import { Component, inject, OnInit, signal } from '@angular/core';
import { JourneyService } from './journey-service';
import { Journey } from '../../../types/journey';

@Component({
  selector: 'app-journeys',
  imports: [],
  templateUrl: './journeys.html',
  styleUrl: './journeys.css',
})
export class Journeys implements OnInit {
  private journeyService = inject(JourneyService);
  protected journeys = signal<Journey[]>([]);

  ngOnInit() {
    this.journeyService.getJourneys().subscribe((result) => {
      this.journeys.set(result);
    });
  }

  enroll(journeyId: string) {}
}
