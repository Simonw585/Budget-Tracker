/* File: C:\Users\si.white\budget-tracker\src\app\components\add-transaction\transaction-list\transaction-list.component.ts
   Description: Logic for an Angular component.
*/

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../../core/services/budget.services';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent implements OnInit {

  transactions: Transaction[] = [];

  private budgetService = inject(BudgetService);

  /**
   * Lifecycle hook: initialize local transaction array on component startup.
   */
  ngOnInit() {
    this.transactions = this.budgetService.getTransactions();
  }

  /**
   * Remove a transaction and refresh the list shown in the UI.
   */
  delete(id: string) {
    this.budgetService.deleteTransaction(id);
    this.transactions = this.budgetService.getTransactions();
  }

  /**
   * Calculate sum of all income-type transactions for this list.
   */
  getTotalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((a, b) => a + b.amount, 0);
  }

  /**
   * Calculate sum of all expense-type transactions for this list.
   */
  getTotalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((a, b) => a + b.amount, 0);
  }
}



