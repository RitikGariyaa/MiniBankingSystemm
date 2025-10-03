import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      dob: [''],
      addressLine1: ['',[Validators.maxLength(255)]],
      addressLine2: ['',[Validators.maxLength(255)]],
      city: ['',[Validators.maxLength(100)]],
      state: ['',[Validators.maxLength(100)]],
      postalCode: ['',[Validators.maxLength(20)]],
      country: ['',[Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const c = this.auth.getCurrentCustomer();
    if (!c) { this.router.navigate(['/login']); return; }
    this.form.patchValue(c);
  }

  submit() {
    this.message = null; this.error = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const c = this.auth.getCurrentCustomer();
    if (!c) { this.error = 'Not logged in'; return; }
    const payload: any = {};
    Object.entries(this.form.value).forEach(([k,v]) => { if (v !== null && v !== '' && v !== undefined) payload[k] = v; });
    this.saving = true;
    this.auth.updateProfile(c.id, payload).subscribe({
      next: updated => { this.saving = false; this.message = 'Profile updated'; this.form.patchValue(updated); },
      error: err => { this.saving = false; this.error = err?.error?.message || 'Update failed'; }
    });
  }
}

