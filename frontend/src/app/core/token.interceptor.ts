import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Fallback in case hot-reload or a refactor temporarily removes getToken
    let token: string | null = null;
    try {
      const svc: any = this.auth;
      if (svc && typeof svc.getToken === 'function') {
        token = svc.getToken();
      } else {
        token = localStorage.getItem('jwt_token');
      }
    } catch { /* ignore */ }

    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(req);
  }
}
