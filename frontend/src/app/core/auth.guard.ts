import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private lastAttempted: string | null = null;
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isLoggedIn()) return true;
    this.lastAttempted = state.url;
    return this.router.parseUrl('/login');
  }
  consumeLastAttempted(): string | null { const x = this.lastAttempted; this.lastAttempted = null; return x; }
}

