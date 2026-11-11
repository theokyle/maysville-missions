import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  loading = signal(false);
  loadingAction = signal<'signin' | 'register' | null>(null);
  error = signal('');

  onSignIn(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.loadingAction.set('signin');
    this.error.set('');

    this.authService
      .signin({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => this.navigateToDashboard(),
        error: (err) => {
          this.handleError(err, 'Unable to sign in. Please check your credentials.');
        },
      });
  }

  onRegister(): void {
    if (this.loading()) return;

    if (!this.name.trim()) {
      this.error.set('Please enter your name to create an account.');
      return;
    }

    this.loading.set(true);
    this.loadingAction.set('register');
    this.error.set('');

    this.authService
      .register({
        name: this.name.trim(),
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => this.navigateToDashboard(),
        error: (err) => {
          this.handleError(err, 'Unable to create your account. Please try again.');
        },
      });
  }

  private navigateToDashboard(): void {
    this.loading.set(false);
    this.loadingAction.set(null);
    this.router.navigate(['/dashboard']);
  }

  private handleError(err: any, fallback: string): void {
    this.error.set(
      typeof err.error?.message === 'string'
        ? err.error.message
        : Array.isArray(err.error?.message)
          ? err.error.message.join(' ')
          : fallback,
    );

    this.loading.set(false);
    this.loadingAction.set(null);
  }
}
