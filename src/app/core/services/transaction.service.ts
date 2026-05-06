/* File: C:\Users\si.white\budget-tracker\src\app\core\services\transaction.service.ts
   Description: Service for transaction CRUD operations and data management.
*/

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactions: Transaction[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // For now, using hardcoded data since mock files are empty
    this.transactions = [
      { id: '1', type: 'income', category: 'Salary', amount: 3000, date: '2023-01-01', note: 'Monthly salary' },
      { id: '2', type: 'expense', category: 'Food', amount: 200, date: '2023-01-02', note: 'Groceries' },
      { id: '3', type: 'expense', category: 'Transport', amount: 50, date: '2023-01-03', note: 'Bus fare' },
      { id: '4', type: 'income', category: 'Freelance', amount: 500, date: '2023-01-04', note: 'Project payment' },
      { id: '5', type: 'expense', category: 'Entertainment', amount: 100, date: '2023-01-05', note: 'Movie tickets' },
    ];
  }

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions);
  }

  getIncomeTransactions(): Observable<Transaction[]> {
    return of(this.transactions.filter(t => t.type === 'income'));
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return of(this.transactions.filter(t => t.type === 'expense'));
  }
}


