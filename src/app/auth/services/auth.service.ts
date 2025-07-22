import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../../../environment';
import { tap } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(null);
  token = this._token.asReadonly();

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
     const url = `${environment.apiBaseUrl}/api/Auth/login`;
    return this.http.post<{ token: string }>(url, data).pipe(
      tap(res => {
        this._token.set(res.token);
        localStorage.setItem('token', res.token);
      })
    );
  }

  saveToken(token: string) {
    this._token.set(token);
    localStorage.setItem('token', token);
  }

  logout() {
    this._token.set(null);
    localStorage.removeItem('token');
  }
}
