import { Component, input } from '@angular/core';

import { JourneyStep, JourneyStepProgress } from '../../../../shared/models/journeys.models';

@Component({
  selector: 'app-journey-step-card',
  standalone: true,
  templateUrl: './journey-step-card.html',
})
export class JourneyStepCardComponent {
  step = input.required<JourneyStep>();
  progress = input<JourneyStepProgress | null>(null);
}
