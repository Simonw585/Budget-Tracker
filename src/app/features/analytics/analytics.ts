import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import type { ChartData, ChartOptions } from 'chart.js';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css'],
})
export class AnalyticsComponent {
  private budgetService = inject(BudgetService);

  yearLabels = this.budgetService.yearLabels;
  incomeByMonth = this.budgetService.annualIncomeByMonth;
  expensesByMonth = this.budgetService.annualExpenseByMonth;
  expenseCategories = this.budgetService.expenseCategoryBreakdown;

  public lineChartData = computed<ChartData<'line'>>(() => ({
    labels: this.yearLabels(),
    datasets: [
      {
        data: this.incomeByMonth(),
        label: 'Income',
        borderColor: '#4f7bff',
        backgroundColor: 'rgba(79, 123, 255, 0.25)',
        tension: 0.35,
        fill: true
      },
      {
        data: this.expensesByMonth(),
        label: 'Expenses',
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.25)',
        tension: 0.35,
        fill: true
      }
    ]
  }));

  public doughnutChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: this.expenseCategories().map((item) => item.category),
    datasets: [
      {
        data: this.expenseCategories().map((item) => item.amount),
        backgroundColor: ['#4f46e5', '#2563eb', '#22c55e', '#facc15', '#fb7185', '#f97316']
      }
    ]
  }));

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false
  };
}
