import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, schema, required, email } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AccountService } from '../account/account-service';
import { LoginCreds } from '../../types/user';

const signInSchema = schema<LoginCreds>((path) => {
  required(path.email, { message: 'Email is required.' });
  email(path.email, { message: 'Enter a valid email address.' });

  required(path.password, { message: 'Password is required.' });
});

@Component({
  selector: 'app-sign-in',
  imports: [FormField],
  templateUrl: './signin.html',
})
export class SignIn {
  private accountService = inject(AccountService);
  private router = inject(Router);

  protected loading = signal(false);
  protected errorMessage = signal<string | null>(null);

  cancelSignIn = output<boolean>();
  registerRequested = output<void>();

  cancel() {
    this.cancelSignIn.emit(false);
  }

  createAccount() {
    this.registerRequested.emit();
  }

  protected signInModel = signal<LoginCreds>({
    email: '',
    password: '',
  });

  protected signInForm = form(this.signInModel, signInSchema);

  submit() {
    this.errorMessage.set(null);

    if (this.signInForm().invalid() || this.loading()) {
      return;
    }

    const values = this.signInForm().value();

    const creds: LoginCreds = {
      email: values.email.trim(),
      password: values.password,
    };

    this.loading.set(true);

    this.accountService.signin(creds).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/journeys');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Unable to sign in. Check your credentials and try again.',
        );
      },
    });
  }
}
