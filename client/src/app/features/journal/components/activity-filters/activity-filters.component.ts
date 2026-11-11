import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activity-filters.component.html',
})
export class ActivityFiltersComponent {
  journeyIds = input<{ id: string; title: string }[]>([]);
  selectedJourneyId = input('');

  filterChange = output<string>();
}
