// Brief: ExpensesComponent — handles listing, adding, editing, and deleting expenses.
// What it does: manages expense form state, validation, and delegates persistence to BudgetService.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { Transaction } from '../../core/models/budget.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.css'],
})
export class ExpensesComponent {
  private budgetService = inject(BudgetService);
  expenseTransactions = this.budgetService.expenseTransactions;

  editingId: string | null = null;
  editModel: Transaction = {
    id: '',
    type: 'expense',
    category: '',
    source: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  };
  formError = '';

  newTransaction = {
    source: '',
    category: 'Groceries',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  };

  validateForm(): boolean {
    const errors: string[] = [];

    if (!this.newTransaction.source?.trim()) {
      errors.push('Merchant is required.');
    }
    if (!this.newTransaction.category?.trim()) {
      errors.push('Category is required.');
    }
    if (!this.newTransaction.date) {
      errors.push('Date is required.');
    }
    if (!this.newTransaction.amount || Number(this.newTransaction.amount) <= 0) {
      errors.push('Amount must be greater than zero.');
    }

    this.formError = errors.join(' ');
    return errors.length === 0;
  }

  private normalizeDateInput(dateValue: string | null | undefined): string {
    const raw = dateValue?.trim() ?? '';
    if (!raw) {
      return new Date().toISOString().slice(0, 10);
    }

    const exactMatch = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (exactMatch) {
      return exactMatch[1];
    }

    const isoMatch = raw.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      return isoMatch[1];
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString().slice(0, 10) : new Date(parsed.getTime() - (parsed.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
  }

  startEdit(transaction: Transaction) {
    this.editingId = transaction.id;
    this.editModel = { ...transaction, date: this.normalizeDateInput(transaction.date) };
  }

  saveEdit() {
    if (!this.editModel.source?.trim() || !this.editModel.category?.trim() || !this.editModel.date || Number(this.editModel.amount) <= 0) {
      this.formError = 'Please complete all required values before saving.';
      return;
    }

    this.budgetService.updateTransaction(this.editModel);
    this.cancelEdit();
    this.formError = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = {
      id: '',
      type: 'expense',
      category: '',
      source: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }

  deleteTransaction(transactionId: string) {
    this.budgetService.removeTransaction(transactionId);
  }

  addExpense() {
    if (!this.validateForm()) {
      return;
    }

    const id = `expense-${Date.now()}`;
    this.budgetService.addTransaction({
      id,
      type: 'expense',
      category: this.newTransaction.category,
      source: this.newTransaction.source,
      amount: Number(this.newTransaction.amount),
      date: this.newTransaction.date,
      notes: this.newTransaction.notes
    });

    this.newTransaction = {
      source: '',
      category: 'Groceries',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
    this.formError = '';
  }
}
