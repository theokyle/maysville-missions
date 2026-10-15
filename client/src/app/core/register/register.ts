import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, schema, required, email, minLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AccountService } from '../account/account-service';
import { RegisterCreds } from '../../types/user';

interface RegisterFormModel {
  name: string;
  email: string;
  password: string;
}

const registerSchema = schema<RegisterFormModel>((path) => {
  required(path.name, { message: 'Name is required.' });
  minLength(path.name, 2, {
    message: 'Name must be at least 2 characters.',
  });

  required(path.email, { message: 'Email is required.' });
  email(path.email, {
    message: 'Enter a valid email address.',
  });

  required(path.password, { message: 'Password is required.' });
  minLength(path.password, 8, {
    message: 'Password must be at least 8 characters.',
  });
});

@Component({
  selector: 'app-register',
  imports: [FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  private router = inject(Router);

  protected loading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected registerModel = signal<RegisterFormModel>({
    name: '',
    email: '',
    password: '',
  });

  protected registerForm = form(this.registerModel, registerSchema);

  cancelRegister = output<boolean>();

  cancel() {
    this.cancelRegister.emit(false);
  }

  submit() {
    this.errorMessage.set(null);

    if (this.registerForm().invalid() || this.loading()) {
      return;
    }

    const values = this.registerForm().value();

    const creds: RegisterCreds = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: 'USER',
    };

    this.loading.set(true);

    this.accountService.register(creds).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/journeys');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Registration failed. Please try again.');
      },
    });
  }
}
