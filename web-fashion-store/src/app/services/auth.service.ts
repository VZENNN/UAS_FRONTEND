import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));
  isLoggedIn = this.loggedIn.asObservable();
  private baseUrl = environment.base_url;
  private role: string | null = null;

  constructor(private http: HttpClient, 
    private router: Router) {}

  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('role'); // Ambil dari localStorage
    }
    return this.role;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  login(data: { email: string; password: string }): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.baseUrl}/auth/login`, data).subscribe({
        next: (response: any) => {
          localStorage.setItem('auth_token', response.data.token);
          const payload = JSON.parse(atob(response.data.token.split('.')[1]));
          localStorage.setItem('role', payload.role);

          this.loggedIn.next(true); // Update status login
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
    this.role = null;
    alert('Logout berhasil');
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    // Decode token untuk mengambil nama pengguna
    const token = localStorage.getItem('auth_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // localStorage.setItem('name', payload.name)
      return payload.name || 'User'; // Pastikan token menyimpan nama pengguna
    }
    return '';
  }
}