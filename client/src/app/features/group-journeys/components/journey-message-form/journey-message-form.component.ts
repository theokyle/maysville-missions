import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateJourneyMessageDto } from '../../../../shared/models/journey-message.model';

@Component({
  selector: 'app-journey-message-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './journey-message-form.component.html',
})
export class JourneyMessageFormComponent {
  journeyStepId = input<string | null>(null);

  submitted = output<CreateJourneyMessageDto>();

  content = signal('');

  submit(): void {
    const content = this.content().trim();

    if (!content) return;

    this.submitted.emit({
      content,
      ...(this.journeyStepId() ? { journeyStepId: this.journeyStepId()! } : {}),
    });

    this.content.set('');
  }
}
