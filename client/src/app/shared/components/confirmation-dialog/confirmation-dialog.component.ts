import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  open = input(false);
  title = input('Are you sure?');
  message = input('');
  confirmLabel = input('Confirm');

  confirmed = output<void>();
  cancelled = output<void>();
}
