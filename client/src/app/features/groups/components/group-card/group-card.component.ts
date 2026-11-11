import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Group } from '../../../../shared/models/group.model';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
})
export class GroupCardComponent {
  group = input.required<Group>();
}
