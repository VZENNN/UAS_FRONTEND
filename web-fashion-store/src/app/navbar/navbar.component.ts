import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  dropdownVisible: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;

      // Ambil nama pengguna jika login
      if (status) {
        this.userName = this.authService.getUserName(); // Ambil nama dari AuthService
      }

      this.isAdmin = this.authService.isAdmin();
      this.cdr.detectChanges();
    });
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible; // Toggle visibilitas dropdown
  }

  logout(): void {
    this.authService.logout();
  }
}