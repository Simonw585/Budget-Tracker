/* File: C:\Users\si.white\budget-tracker\src\app\core\services\budget.services.ts
   Description: Service for overall budget calculations and global state updates.
*/

import { Injectable } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private storageKey = 'budget-tracker-data';

  /**
   * Initialize BudgetService; this is run when the service is created by Angular DI.
   */
  // constructor not required for this service

  /**
   * Load all saved transactions from localStorage under the configured storage key.
   */
  getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /**
   * Persist the current transaction list in localStorage as JSON.
   */
  saveTransactions(list: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  /**
   * Append a new transaction to the list and save changes.
   */
  addTransaction(tx: Transaction) {
    const current = this.getTransactions();
    current.push(tx);
    this.saveTransactions(current);
  }

  /**
   * Remove transaction by id and update localStorage.
   */
  deleteTransaction(id: string) {
    const updated = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(updated);
  }

  /**
   * Update an existing transaction and save changes.
   */
  updateTransaction(updatedTx: Transaction) {
    const list = this.getTransactions();
    const index = list.findIndex(t => t.id === updatedTx.id);

    if (index !== -1) {
      list[index] = updatedTx;
      this.saveTransactions(list);
    }
  }
}

