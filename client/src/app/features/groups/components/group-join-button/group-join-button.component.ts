import { Component, inject, input, output, signal } from '@angular/core';

import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-group-join-button',
  templateUrl: './group-join-button.component.html',
})
export class GroupJoinButtonComponent {
  private groupsService = inject(GroupsService);

  groupId = input.required<string>();
  isMember = input(false);

  membershipChange = output<boolean>();

  loading = signal(false);
  error = signal<string | null>(null);

  join(): void {
    this.loading.set(true);
    this.error.set(null);

    this.groupsService.joinGroup(this.groupId()).subscribe({
      next: () => {
        this.loading.set(false);
        this.membershipChange.emit(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409
            ? 'You are already a member of this group.'
            : 'Unable to join this group.',
        );
      },
    });
  }

  leave(): void {
    if (!confirm('Are you sure you want to leave this group?')) return;

    this.loading.set(true);
    this.error.set(null);

    this.groupsService.leaveGroup(this.groupId()).subscribe({
      next: () => {
        this.loading.set(false);
        this.membershipChange.emit(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to leave this group.');
      },
    });
  }
}
