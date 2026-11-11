import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Activity, CreateActivityDto } from '../../../../shared/models/activity.model';
import { StepProgress } from '../../../../shared/models/progress.models';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activity-form.component.html',
})
export class ActivityFormComponent {
  steps = input<StepProgress[]>([]);
  stepInstanceId = input<string | null>(null);
  activity = input<Activity | null>(null);
  stepSelected = output<string>();

  submitted = output<ActivityFormSubmission>();
  cancelled = output<void>();

  name = signal('');
  note = signal('');
  selectedStepInstanceId = signal('');

  constructor() {
    effect(() => {
      const activity = this.activity();
      const initialStepId =
        activity?.stepInstanceId ?? this.stepInstanceId() ?? this.steps()[0]?.id ?? '';

      this.name.set(activity?.name ?? '');
      this.note.set(activity?.note ?? '');
      this.selectedStepInstanceId.set(initialStepId);
    });
  }

  submit(): void {
    if (!this.selectedStepInstanceId()) return;
    if (!this.name().trim() && !this.note().trim()) return;

    this.submitted.emit({
      stepInstanceId: this.selectedStepInstanceId(),
      data: {
        name: this.name().trim(),
        note: this.note().trim(),
      },
    });
  }
}

export interface ActivityFormSubmission {
  stepInstanceId: string;
  data: CreateActivityDto;
}
