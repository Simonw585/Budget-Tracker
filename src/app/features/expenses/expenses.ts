import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.css'],
})
export class ExpensesComponent {
  private budgetService = inject(BudgetService);
  expenseTransactions = this.budgetService.expenseTransactions;
}
