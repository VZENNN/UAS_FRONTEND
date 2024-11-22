import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.route.navigate(['/products']);
      }
    });
  }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        alert('Login berhasil');

        // Redirect ke halaman produk
        this.route.navigate(['/products']);
      },
      error: (error) => {
        alert(error.error.message);
      }
    });
  }
}