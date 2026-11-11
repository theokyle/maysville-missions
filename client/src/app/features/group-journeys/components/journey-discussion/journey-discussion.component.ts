import { Component, input, output } from '@angular/core';

import {
  JourneyMessage,
  CreateJourneyMessageDto,
  CreateJourneyReplyDto,
} from '../../../../shared/models/journey-message.model';

import { JourneyMessageFormComponent } from '../journey-message-form/journey-message-form.component';
import { JourneyMessageListComponent } from '../journey-message-list/journey-message-list.component';

@Component({
  selector: 'app-journey-discussion',
  imports: [JourneyMessageFormComponent, JourneyMessageListComponent],
  templateUrl: './journey-discussion.component.html',
})
export class JourneyDiscussionComponent {
  messages = input<JourneyMessage[]>([]);
  currentUserId = input.required<string>();

  createMessage = output<CreateJourneyMessageDto>();

  reply = output<{
    messageId: string;
    dto: CreateJourneyReplyDto;
  }>();

  edit = output<JourneyMessage>();
  delete = output<JourneyMessage>();
}
