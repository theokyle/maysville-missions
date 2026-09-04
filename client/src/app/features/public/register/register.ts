import { Component, inject, output, signal } from '@angular/core';
import { AccountService } from '../../../core/account/account-service';
import { form, FormField } from '@angular/forms/signals';
import { RegisterCreds } from '../../../types/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  protected registerModel = signal<RegisterCreds>({
    email: '',
    password: '',
    name: '',
    role: 'user',
  });
  protected registerForm = form(this.registerModel);
  cancelRegister = output<boolean>();
  private router = inject(Router);

  cancel() {
    this.cancelRegister.emit(false);
  }

  submit() {
    if (this.registerForm().valid()) {
      const creds = this.registerForm().value();
      this.accountService.register(creds).subscribe({
        next: () => this.router.navigateByUrl('/journeys'),
        error: (err) => console.error(err),
      });
    }
  }
}
