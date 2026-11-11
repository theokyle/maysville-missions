import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  title = input('Nothing here yet');
  description = input('');
  actionLabel = input<string | null>(null);
}
