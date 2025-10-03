import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mini Banking';
  constructor(private router: Router, public auth: AuthService) {}

  // Disable browser back navigation to restricted pages after logout
  @HostListener('window:popstate', ['$event']) onPopState() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}

