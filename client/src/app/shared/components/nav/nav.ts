import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/account/account-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private accountService = inject(AccountService);
  faUser = faUser;

  currentUser = this.accountService.currentUser;

  userInitials = computed(() => {
    const user = this.currentUser();

    if (!user) return '';

    if (user.name?.trim()) {
      return user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    }

    return user.email[0]?.toUpperCase() ?? '';
  });

  logout() {
    this.accountService.signout();
  }
}
