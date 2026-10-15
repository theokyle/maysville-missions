import { Component, input, inject } from '@angular/core';
import { Journey } from '../../../types/journey';
import { JourneyService } from '../journey-service';

@Component({
  selector: 'journey-card',
  imports: [],
  templateUrl: './journey-card.html',
  styleUrl: './journey-card.css',
})
export class JourneyCard {
  journey = input<Journey>();
  private journeyService = inject(JourneyService);

  enroll() {
    const journey = this.journey();

    if (!journey) {
      return;
    }

    this.journeyService.enroll(journey.id);
  }
}
