import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.api_url}/api/auth`;

  currentUser = signal<AuthUser | null>(null);

  get token(): string | null {
    return localStorage.getItem('accessToken');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  register(data: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap((response) => this.setSession(response)));
  }

  signin(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/signin`, data)
      .pipe(tap((response) => this.setSession(response)));
  }

  getMe(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(`${this.apiUrl}/me`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.currentUser.set(null);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    this.currentUser.set(response.user);
  }
}
