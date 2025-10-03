import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService, AccountResponse } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  accounts: AccountResponse[] = [];
  showCreate = false;
  error: string | null = null;

  createForm!: FormGroup; // initialized in constructor

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
    this.createForm = this.fb.group({
      accountType: ['SAVINGS', Validators.required],
      openingBalance: [0, [Validators.min(0)]],
      interestRate: [null],
      overdraftLimit: [null]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  toggleCreate() { this.showCreate = !this.showCreate; }

  refresh() {
    this.loading = true;
    this.auth.listAccounts().subscribe({
      next: accs => { this.accounts = accs; this.loading = false; },
      error: err => { this.error = err?.error?.message || 'Failed to load accounts'; this.loading=false; }
    });
  }

  submitCreate() {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    const payload: any = { ...this.createForm.value };
    const c = this.auth.getCurrentCustomer();
    if (!c) { this.error = 'Profile not loaded'; return; }
    payload.customerId = c.id;
    this.error = null;
    this.createForm.disable();
    this.auth.createAccount(payload).subscribe({
      next: () => {
        this.createForm.enable();
        this.showCreate = false;
        this.createForm.reset({ accountType: 'SAVINGS', openingBalance: 0, interestRate: null, overdraftLimit: null });
        this.refresh();
      },
      error: err => {
        this.createForm.enable();
        this.error = err?.error?.message || 'Create failed';
      }
    });
  }

  open(acc: AccountResponse) { this.router.navigate(['/accounts', acc.id]); }
  delete(acc: AccountResponse) {
    if (!confirm('Delete this account? Balance must be 0.')) return;
    this.auth.deleteAccount(acc.id).subscribe({
      next: () => this.refresh(),
      error: err => this.error = err?.error?.message || 'Delete failed'
    });
  }
}
