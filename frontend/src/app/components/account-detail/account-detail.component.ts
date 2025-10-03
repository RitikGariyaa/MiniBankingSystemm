import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  loading = true;
  error: string | null = null;
  account: any = null;
  transactions: any[] = [];
  tab: 'info' | 'deposit' | 'withdraw' | 'transfer' | 'txns' = 'info';

  moneyForm!: FormGroup; // initialized in constructor
  transferForm!: FormGroup; // initialized in constructor
  otherAccounts: any[] = []; // accounts (excluding current) for transfer target

  constructor(private route: ActivatedRoute, private auth: AuthService, private fb: FormBuilder) {
    this.moneyForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      note: ['']
    });
    this.transferForm = this.fb.group({
      toAccountId: [null], // optional if manualAccountId used
      manualAccountId: [null, [Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  setTab(t: typeof this.tab) { this.tab = t; if (t==='txns' && !this.transactions.length) { this.fetchTransactions(); } }

  load(id: number) {
    this.loading = true;
    this.auth.getAccount(id).subscribe({
      next: a => { this.account = a; this.loading = false; this.loadOtherAccounts(); },
      error: e => { this.error = e?.error?.message || 'Failed to load account'; this.loading=false; }
    });
  }

  private loadOtherAccounts(){
    try {
      this.auth.listAccounts().subscribe({
        next: accs => {
          if(!this.account) { this.otherAccounts = accs; return; }
          this.otherAccounts = accs.filter(x => x.id !== this.account.id);
        },
        error: _ => { /* ignore non-critical */ }
      });
    } catch { /* not logged in or no customer yet */ }
  }

  fetchTransactions() {
    if (!this.account) return;
    this.auth.getTransactions(this.account.id).subscribe({
      next: tx => this.transactions = tx,
      error: e => this.error = e?.error?.message || 'Failed to load transactions'
    });
  }

  deposit() {
    if (this.moneyForm.invalid) { this.moneyForm.markAllAsTouched(); return; }
    this.auth.deposit(this.account.id, Number(this.moneyForm.value.amount), this.moneyForm.value.note||'').subscribe({
      next: a => { this.account = a; this.moneyForm.reset({amount:0,note:''}); this.setTab('info'); },
      error: e => this.error = e?.error?.message || 'Deposit failed'
    });
  }

  withdraw() {
    if (this.moneyForm.invalid) { this.moneyForm.markAllAsTouched(); return; }
    this.auth.withdraw(this.account.id, Number(this.moneyForm.value.amount), this.moneyForm.value.note||'').subscribe({
      next: a => { this.account = a; this.moneyForm.reset({amount:0,note:''}); this.setTab('info'); },
      error: e => this.error = e?.error?.message || 'Withdrawal failed'
    });
  }

  transfer() {
    if (this.transferForm.invalid) { this.transferForm.markAllAsTouched(); return; }
    let dest = this.transferForm.value.manualAccountId || this.transferForm.value.toAccountId;
    if (!dest) { this.error = 'Select a destination or enter an external Account ID'; return; }
    const { amount, note } = this.transferForm.value;
    this.auth.transfer(this.account.id, Number(dest), Number(amount), note||'').subscribe({
      next: () => { this.transferForm.reset({toAccountId:null, manualAccountId:null, amount:0, note:''}); this.setTab('info'); },
      error: e => this.error = e?.error?.message || 'Transfer failed'
    });
  }
}
