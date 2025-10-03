import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success = false;

  form!: FormGroup; // initialized in constructor

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.maxLength(20)]],
      dob: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
    history.pushState(null, document.title);
    window.addEventListener('popstate', () => { history.pushState(null, document.title); });
  }

  submit() {
    this.error = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    const payload: any = { ...this.form.value };
    delete payload.confirmPassword;
    this.loading = true;
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(()=> this.router.navigate(['/login']), 1200);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
