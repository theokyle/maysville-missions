import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from '../../core/services/account.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SidebarComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private account = inject(AccountService);
  private router = inject(Router);
  sidebarOpen = signal(false);

  user = this.account.user;

  logout(): void {
    this.account.logout();
    this.router.navigate(['/login']);
  }
}
