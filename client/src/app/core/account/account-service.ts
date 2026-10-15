import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { environment } from '../../../environments/environment.development';
import { catchError, map, of, tap } from 'rxjs';

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  restoreSession() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.currentUser.set(null);
      return of(undefined);
    }

    return this.http.get<User>(`${this.baseUrl}/auth/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map(() => undefined),
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.signout();
        }

        return of(undefined);
      }),
    );
  }
}
