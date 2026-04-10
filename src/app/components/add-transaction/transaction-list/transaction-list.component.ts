import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../core/services/budget.services';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent implements OnInit {

  transactions: Transaction[] = [];
  editingId: string | null = null;
  editedTransaction: Transaction | null = null;

  // just some filter stuff
  categories: string[] = [];
  selectedCategory = 'all';

  private budgetService = inject(BudgetService);

  ngOnInit() {
    this.loadTransactions();
  }

  // load transactions and extract categories
  loadTransactions() {
    this.transactions = this.budgetService.getTransactions();
    // get unique categories for the filter dropdown
    this.categories = [
      ...new Set(this.transactions.map(t => t.category))
    ];
  }

  delete(id: string) {
    this.budgetService.deleteTransaction(id);
    this.loadTransactions(); // refresh the list
  }

  // start editing a transaction
  startEdit(tx: Transaction) {
    this.editingId = tx.id;
    this.editedTransaction = { ...tx }; // make a copy
  }

  // save the changes
  saveEdit() {
    if (this.editedTransaction) {
      this.budgetService.updateTransaction(this.editedTransaction);
      this.loadTransactions();
      this.cancelEdit();
    }
  }

  // cancel editing
  cancelEdit() {
    this.editingId = null;
    this.editedTransaction = null;
  }

  // calculate total income
  getTotalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // calculate total expenses
  getTotalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // filter transactions by category
  get filteredTransactions() {
    if (this.selectedCategory === 'all') {
      return this.transactions;
    }
    return this.transactions.filter(t => t.category === this.selectedCategory);
  }

  // for ngFor performance
  trackById(index: number, item: Transaction): string {
    return item.id;
  }
}