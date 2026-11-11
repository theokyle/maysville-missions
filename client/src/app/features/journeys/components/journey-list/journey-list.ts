import { Component, input } from '@angular/core';

import { Journey } from '../../../../shared/models/journeys.models';
import { JourneyCardComponent } from '../journey-card/journey-card';

@Component({
  selector: 'app-journey-list',
  standalone: true,
  imports: [JourneyCardComponent],
  templateUrl: './journey-list.html',
})
export class JourneyListComponent {
  journeys = input.required<Journey[]>();
  enrolledJourneyIds = input<string[]>([]);
}
