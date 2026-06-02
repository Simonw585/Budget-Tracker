import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { Transaction } from '../../core/models/budget.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income.html',
  styleUrls: ['./income.css'],
})
export class IncomeComponent {
  private budgetService = inject(BudgetService);
  incomeTransactions = this.budgetService.incomeTransactions;

  editingId: string | null = null;
  editModel: Transaction | null = null;

  newTransaction = {
    source: '',
    category: 'Salary',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  };

  startEdit(transaction: Transaction) {
    this.editingId = transaction.id;
    this.editModel = { ...transaction };
  }

  saveEdit() {
    if (this.editModel) {
      this.budgetService.updateTransaction(this.editModel);
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = null;
  }

  deleteTransaction(transactionId: string) {
    this.budgetService.removeTransaction(transactionId);
  }

  addIncome() {
    const id = `income-${Date.now()}`;
    this.budgetService.addTransaction({
      id,
      type: 'income',
      category: this.newTransaction.category,
      source: this.newTransaction.source,
      amount: Number(this.newTransaction.amount),
      date: this.newTransaction.date,
      notes: this.newTransaction.notes
    });

    this.newTransaction = {
      source: '',
      category: 'Salary',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }
}
