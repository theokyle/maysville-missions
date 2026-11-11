import { Component, input } from '@angular/core';

import { GroupMember } from '../../../../shared/models/group.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-group-member-list',
  imports: [DatePipe],
  templateUrl: './group-member-list.component.html',
})
export class GroupMemberListComponent {
  members = input<GroupMember[]>([]);
}
