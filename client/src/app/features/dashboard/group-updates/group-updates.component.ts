import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { JourneyMessage } from '../../../shared/models/journey-message.model';

@Component({
  selector: 'app-group-updates',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './group-updates.component.html',
})
export class GroupUpdatesComponent {
  messages = input<JourneyMessage[]>([]);
}
