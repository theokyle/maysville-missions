import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  templateUrl: './progress-indicator.component.html',
})
export class ProgressIndicatorComponent {
  current = input(0);
  target = input(1);
  label = input('Progress');

  percentage = computed(() => {
    if (this.target() <= 0) return 0;

    return Math.min(100, Math.round((this.current() / this.target()) * 100));
  });
}
