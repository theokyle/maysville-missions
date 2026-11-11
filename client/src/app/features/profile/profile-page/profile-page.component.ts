import { Component, inject, OnInit, signal } from '@angular/core';

import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  private account = inject(AccountService);

  user = this.account.user;
  loading = signal(true);

  ngOnInit(): void {
    this.account.loadAccount().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
