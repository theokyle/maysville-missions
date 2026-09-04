import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';

interface AuthResponse {
  user: User;
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private baseUrl = environment.base_url;

  setSession(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  register(creds: RegisterCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, creds).pipe(
      tap((response) => {
        if (response) {
          this.setSession(response);
        }
      }),
    );
  }

  signin(creds: LoginCreds) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signin`, creds).pipe(
      tap((response) => {
        if (response) {
          this.setSession(response);
        }
      }),
    );
  }

  signout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
