import { Component, computed, input } from '@angular/core';

import { JourneyStepProgress } from '../../../../shared/models/journeys.models';

@Component({
  selector: 'app-journey-progress',
  standalone: true,
  templateUrl: './journey-progress.html',
})
export class JourneyProgressComponent {
  progress = input.required<JourneyStepProgress[]>();

  completedCount = computed(() => this.progress().filter((step) => step.completed).length);

  totalCount = computed(() => this.progress().length);

  percentage = computed(() => {
    const total = this.totalCount();

    if (total === 0) return 0;

    return Math.round((this.completedCount() / total) * 100);
  });
}
