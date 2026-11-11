import { Component, input, output } from '@angular/core';

import { JournalEntry } from '../../../../shared/models/progress.models';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [ActivityCardComponent],
  templateUrl: './activity-timeline.component.html',
})
export class ActivityTimelineComponent {
  activities = input.required<JournalEntry[]>();

  editActivity = output<JournalEntry>();
  deleteActivity = output<JournalEntry>();
}
