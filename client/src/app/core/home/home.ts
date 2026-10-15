import { Component, inject, signal } from '@angular/core';
import { Register } from '../register/register';
import { SignIn } from '../signin/signin';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Register, SignIn],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private route = inject(ActivatedRoute);
  protected registerMode = signal(false);
  protected signInMode = signal(false);

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const form = params.get('form');

      this.registerMode.set(form === 'register');
      this.signInMode.set(form === 'signin');
    });
  }

  showRegister(value: boolean) {
    this.registerMode.set(value);
    this.signInMode.set(false);
  }

  showSignIn(value: boolean) {
    this.signInMode.set(value);
    this.registerMode.set(false);
  }
}
