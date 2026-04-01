/* File: C:\Users\si.white\budget-tracker\src\app\components\add-transaction\add-transaction.component.ts
   Description: Component for the add transaction form and creation workflow.
*/

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.services';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-transaction.component.html',
})
export class AddTransactionComponent {

  private budgetService = inject(BudgetService);

  newTransaction: Partial<Transaction> = {
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().substr(0, 10)
  };

  /**
   * Build a new Transaction object and save it using BudgetService.
   */
  add() {
    const tx: Transaction = {
      ...this.newTransaction as Transaction,
      id: crypto.randomUUID(),
    };

    this.budgetService.addTransaction(tx);

    // reset form
    this.newTransaction = {
      type: 'expense',
      category: '',
      amount: 0,
      date: new Date().toISOString().substr(0, 10)
    };
  }
}



