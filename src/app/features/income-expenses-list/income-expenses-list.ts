import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../core/services/budget.services';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-income-expenses-list',
  imports: [CommonModule],
  templateUrl: './income-expenses-list.html',
  styleUrl: './income-expenses-list.css',
})
export class IncomeExpensesList implements OnInit {
  incomeTransactions: Transaction[] = [];
  expenseTransactions: Transaction[] = [];

  private budgetService = inject(BudgetService);

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const allTransactions = this.budgetService.getTransactions();
    this.incomeTransactions = allTransactions.filter(t => t.type === 'income');
    this.expenseTransactions = allTransactions.filter(t => t.type === 'expense');
  }
}
