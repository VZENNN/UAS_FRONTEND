import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private route: Router) {}

  register() {
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Registrasi berhasil!');

        // Call the login method after registration
        this.authService.login({ email: this.email, password: this.password }).subscribe({
          next: () => {
            this.route.navigate(['/products']);
          },
          error: (error) => {
            console.error('Login error', error);
            alert('Login gagal setelah registrasi!');
          }
        });
      },
      error: (error) => {
        console.error('Registration error', error);
        alert(error.error.message);
      }
    });
  }
}