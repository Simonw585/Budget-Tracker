// Brief: DashboardComponent — presents aggregated budget metrics.
// What it does: reads computed values from BudgetService (income, expenses, balance, trends).
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  private budgetService = inject(BudgetService);

  totalIncome = this.budgetService.totalIncome;
  totalExpenses = this.budgetService.totalExpenses;
  balance = this.budgetService.balance;
  topExpenseCategories = this.budgetService.topExpenseCategories;
  monthlyCashFlow = this.budgetService.monthlyCashFlow;
}
