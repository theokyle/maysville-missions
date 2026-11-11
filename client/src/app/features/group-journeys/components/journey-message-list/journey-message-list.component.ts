import { Component, input, output } from '@angular/core';

import {
  JourneyMessage,
  CreateJourneyReplyDto,
} from '../../../../shared/models/journey-message.model';

import { JourneyMessageCardComponent } from '../journey-message-card/journey-message-card.component';

@Component({
  selector: 'app-journey-message-list',
  standalone: true,
  imports: [JourneyMessageCardComponent],
  templateUrl: './journey-message-list.component.html',
})
export class JourneyMessageListComponent {
  messages = input<JourneyMessage[]>([]);
  currentUserId = input.required<string>();

  reply = output<{
    messageId: string;
    dto: CreateJourneyReplyDto;
  }>();

  edit = output<JourneyMessage>();
  delete = output<JourneyMessage>();
}
