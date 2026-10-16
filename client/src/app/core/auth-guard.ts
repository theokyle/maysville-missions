// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from './account/account-service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AccountService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/']);
};
