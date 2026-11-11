import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Journey } from '../../../../shared/models/journeys.models';

@Component({
  selector: 'app-journey-card',
  imports: [RouterLink],
  templateUrl: './journey-card.html',
})
export class JourneyCardComponent {
  journey = input.required<Journey>();
  enrolled = input(false);
}
