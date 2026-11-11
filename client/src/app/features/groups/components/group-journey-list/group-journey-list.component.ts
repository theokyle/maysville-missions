import { Component, input, output } from '@angular/core';
import { GroupJourneyEnrollment } from '../../../../shared/models/group.model';
import { Journey } from '../../../../shared/models/journeys.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-group-journey-list',
  imports: [RouterLink],
  templateUrl: './group-journey-list.component.html',
})
export class GroupJourneyListComponent {
  groupId = input.required<string>();

  journeys = input<GroupJourneyEnrollment[]>([]);
  availableJourneys = input<Journey[]>([]);

  journeyJoined = output<string>();
}
