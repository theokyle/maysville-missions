import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Activity } from '../../../shared/models/activity.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './recent-activity.component.html',
})
export class RecentActivityComponent {
  activities = input<Activity[]>([]);
}
