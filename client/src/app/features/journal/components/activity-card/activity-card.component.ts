import { Component, input, output } from '@angular/core';
import { JournalEntry } from '../../../../shared/models/progress.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  imports: [DatePipe],
  templateUrl: './activity-card.component.html',
})
export class ActivityCardComponent {
  activity = input.required<JournalEntry>();

  edit = output<JournalEntry>();
  delete = output<JournalEntry>();
}
