import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginResponse } from './models';

export const API_BASE = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'daw_token';

  isAuthenticated = signal(!!localStorage.getItem('daw_token'));

  login(nombreUsuario: string, password: string) {
    return this.http
      .post<LoginResponse>(`${API_BASE}/auth/login`, { nombreUsuario, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          this.isAuthenticated.set(true);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
