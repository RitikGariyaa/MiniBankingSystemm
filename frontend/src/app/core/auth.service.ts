import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CustomerResponse {
  id: number; firstName: string; lastName: string; email: string; phone?: string; createdAt?: string; dob?: string;
  addressLine1?: string; addressLine2?: string; city?: string; state?: string; postalCode?: string; country?: string;
}
export interface AccountResponse { id: number; accountNumber: string; balance: number; accountType: string; status: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  private customerKey = 'mb_customer';
  private customer$ = new BehaviorSubject<CustomerResponse | null>(null);
  customerChanges$ = this.customer$.asObservable();

  constructor(private http: HttpClient) {
    // hydrate from localStorage
    const raw = localStorage.getItem(this.customerKey);
    if (raw) {
      try { this.customer$.next(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }

  login(email: string, password: string) {
    return this.http.post<CustomerResponse>(`${this.base}/api/auth/login`, { email, password }).pipe(
      tap(c => this.storeCustomer(c))
    );
  }

  register(payload: any) {
    return this.http.post<CustomerResponse>(`${this.base}/api/customers`, payload).pipe(
      tap(c => this.storeCustomer(c)) // auto-login after register
    );
  }

  listAccounts() {
    const c = this.getCurrentCustomer();
    if (!c) throw new Error('Not logged in');
    return this.http.get<AccountResponse[]>(`${this.base}/api/accounts/by-customer/${c.id}`);
  }

  getAccount(id: number) { return this.http.get<any>(`${this.base}/api/accounts/${id}`); }
  getTransactions(id: number) { return this.http.get<any[]>(`${this.base}/api/accounts/${id}/transactions`); }
  deposit(id: number, amount: number, note: string) { return this.http.post<any>(`${this.base}/api/accounts/${id}/deposit`, { amount, note }); }
  withdraw(id: number, amount: number, note: string) { return this.http.post<any>(`${this.base}/api/accounts/${id}/withdraw`, { amount, note }); }
  transfer(fromAccountId: number, toAccountId: number, amount: number, note: string) { return this.http.post<void>(`${this.base}/api/accounts/transfer`, { fromAccountId, toAccountId, amount, note }); }
  createAccount(payload: any) { return this.http.post<AccountResponse>(`${this.base}/api/accounts`, payload); }
  deleteAccount(id: number) { return this.http.delete<void>(`${this.base}/api/accounts/${id}`); }
  closeAccount(id: number) { return this.http.post<void>(`${this.base}/api/accounts/${id}/close`, {}); }
  updateProfile(id: number, payload: any) {
    return this.http.patch<CustomerResponse>(`${this.base}/api/customers/${id}`, payload).pipe(
      tap(c => this.storeCustomer(c))
    );
  }

  logout() {
    localStorage.removeItem(this.customerKey);
    this.customer$.next(null);
  }

  isLoggedIn() { return !!this.customer$.value; }
  getCurrentCustomer() { return this.customer$.value; }

  private storeCustomer(c: CustomerResponse) {
    localStorage.setItem(this.customerKey, JSON.stringify(c));
    this.customer$.next(c);
  }
}
