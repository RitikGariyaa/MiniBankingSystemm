import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AuthGuard } from '../../core/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;

  form!: FormGroup; // initialized in constructor after fb injected

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private guard: AuthGuard) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    history.pushState(null, document.title);
    window.addEventListener('popstate', () => { history.pushState(null, document.title); });
  }

  submit() {
    this.error = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password } = this.form.value;
    this.loading = true;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        const attempted = this.guard.consumeLastAttempted();
        this.router.navigate([attempted || '/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
