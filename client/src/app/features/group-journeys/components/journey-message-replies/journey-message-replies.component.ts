import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  JourneyMessage,
  CreateJourneyReplyDto,
} from '../../../../shared/models/journey-message.model';

@Component({
  selector: 'app-journey-message-replies',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './journey-message-replies.component.html',
})
export class JourneyMessageRepliesComponent {
  replies = input<JourneyMessage[]>([]);
  replySubmitted = output<CreateJourneyReplyDto>();

  showForm = signal(false);
  content = signal('');

  submit(): void {
    const content = this.content().trim();
    if (!content) return;

    this.replySubmitted.emit({ content });
    this.content.set('');
    this.showForm.set(false);
  }
}
