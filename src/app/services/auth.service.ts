import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, map, of, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api';
  private readonly tokenKey = 'practicHub_token';
  private readonly userKey = 'practicHub_user';

  register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((res) => this.persistSession(res)),
      map((res) => res.user)
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => this.persistSession(res)),
      map((res) => res.user)
    );
  }

  logout(): Observable<void> {
    const request = this.token
      ? this.http.post<void>(`${this.apiUrl}/logout`, {})
      : of(void 0);

    return request.pipe(
      finalize(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      })
    );
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): AuthUser | null {
    const stored = localStorage.getItem(this.userKey);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
  }
}
