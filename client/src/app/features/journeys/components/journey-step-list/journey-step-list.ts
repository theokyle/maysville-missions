import { Component, computed, input } from '@angular/core';

import { JourneyStep, JourneyStepProgress } from '../../../../shared/models/journeys.models';
import { JourneyStepCardComponent } from '../journey-step-card/journey-step-card';

@Component({
  selector: 'app-journey-step-list',
  standalone: true,
  imports: [JourneyStepCardComponent],
  templateUrl: './journey-step-list.html',
})
export class JourneyStepListComponent {
  steps = input.required<JourneyStep[]>();
  progress = input<JourneyStepProgress[]>([]);

  sortedSteps = computed(() => [...this.steps()].sort((a, b) => a.sortOrder - b.sortOrder));

  getProgress(stepId: string): JourneyStepProgress | null {
    return this.progress().find((item) => item.journeyStepId === stepId) ?? null;
  }
}
