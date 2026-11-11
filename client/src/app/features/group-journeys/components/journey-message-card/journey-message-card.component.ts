import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  JourneyMessage,
  CreateJourneyReplyDto,
} from '../../../../shared/models/journey-message.model';

import { JourneyMessageRepliesComponent } from '../journey-message-replies/journey-message-replies.component';

@Component({
  selector: 'app-journey-message-card',
  standalone: true,
  imports: [DatePipe, JourneyMessageRepliesComponent],
  templateUrl: './journey-message-card.component.html',
})
export class JourneyMessageCardComponent {
  message = input.required<JourneyMessage>();
  currentUserId = input.required<string>();

  reply = output<{
    messageId: string;
    dto: CreateJourneyReplyDto;
  }>();

  edit = output<JourneyMessage>();
  delete = output<JourneyMessage>();

  onReply(dto: CreateJourneyReplyDto): void {
    this.reply.emit({
      messageId: this.message().id,
      dto,
    });
  }
}
