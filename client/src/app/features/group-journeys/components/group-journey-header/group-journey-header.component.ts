import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { GroupJourneyEnrollment } from '../../../../shared/models/group.model';

@Component({
  selector: 'app-group-journey-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './group-journey-header.component.html',
})
export class GroupJourneyHeaderComponent {
  enrollment = input.required<GroupJourneyEnrollment>();
}
