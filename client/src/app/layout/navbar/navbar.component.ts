import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private account = inject(AccountService);
  private router = inject(Router);

  user = this.account.user;

  logout(): void {
    this.account.logout();
    this.router.navigate(['/login']);
  }
}
