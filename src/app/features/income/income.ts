import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income.html',
  styleUrls: ['./income.css'],
})
export class IncomeComponent {
  private budgetService = inject(BudgetService);
  incomeTransactions = this.budgetService.incomeTransactions;
}
