import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  mobileMenu = false;
  constructor(public auth: AuthService, private router: Router) {}
  toggle() { this.mobileMenu = !this.mobileMenu; }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

