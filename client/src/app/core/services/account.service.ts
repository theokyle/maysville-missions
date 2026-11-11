import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';

import { AuthService, AuthUser } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  loadAccount(): Observable<AuthUser> {
    return this.authService.getMe();
  }

  restoreSession(): Observable<null> {
    if (!this.authService.token) {
      return of(null);
    }

    return this.loadAccount().pipe(
      map(() => null),
      catchError(() => {
        this.authService.logout();
        return of(null);
      }),
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
