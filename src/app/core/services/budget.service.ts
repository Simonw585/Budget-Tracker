import { Injectable, computed, signal } from '@angular/core';
import { ExpenseCategorySummary, MonthlyCashFlowItem, Transaction } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private transactionsSignal = signal<Transaction[]>([
    {
      id: 'income-1',
      type: 'income',
      category: 'Salary',
      source: 'Primary job',
      amount: 3200,
      date: '2026-06-01',
      notes: 'June pay'
    },
    {
      id: 'income-2',
      type: 'income',
      category: 'Freelancing',
      source: 'Consulting',
      amount: 850,
      date: '2026-06-08',
      notes: 'Client work'
    },
    {
      id: 'income-3',
      type: 'income',
      category: 'Dividends',
      source: 'Investments',
      amount: 150,
      date: '2026-06-12',
      notes: 'Dividend payment'
    },
    {
      id: 'expense-1',
      type: 'expense',
      category: 'Rent',
      source: 'Apartment',
      amount: 1200,
      date: '2026-06-03',
      notes: 'Monthly rent'
    },
    {
      id: 'expense-2',
      type: 'expense',
      category: 'Groceries',
      source: 'Supermarket',
      amount: 320,
      date: '2026-06-05',
      notes: 'Weekly shop'
    },
    {
      id: 'expense-3',
      type: 'expense',
      category: 'Utilities',
      source: 'Gas & electric',
      amount: 180,
      date: '2026-06-09',
      notes: 'Monthly utilities'
    },
    {
      id: 'expense-4',
      type: 'expense',
      category: 'Internet',
      source: 'ISP',
      amount: 45,
      date: '2026-06-10',
      notes: 'Monthly internet'
    },
    {
      id: 'expense-5',
      type: 'expense',
      category: 'Mobile Phone',
      source: 'Carrier',
      amount: 38,
      date: '2026-06-14',
      notes: 'Phone plan'
    }
  ]);

  public transactions = computed(() => this.transactionsSignal());

  public incomeTransactions = computed(() =>
    this.transactions().filter((transaction) => transaction.type === 'income')
  );

  public expenseTransactions = computed(() =>
    this.transactions().filter((transaction) => transaction.type === 'expense')
  );

  public totalIncome = computed(() =>
    this.incomeTransactions().reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  public totalExpenses = computed(() =>
    this.expenseTransactions().reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  public balance = computed(() => this.totalIncome() - this.totalExpenses());

  public topExpenseCategories = computed(() => {
    const totals = new Map<string, number>();

    this.expenseTransactions().forEach((expense) => {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  });

  public monthlyCashFlow = computed<MonthlyCashFlowItem[]>(() => {
    const buckets = new Map<string, number>();

    this.transactions().forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('en-GB', {
        month: 'short'
      });
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      buckets.set(month, (buckets.get(month) ?? 0) + amount);
    });

    return Array.from(buckets.entries()).map(([month, amount]) => ({ month, amount }));
  });

  addTransaction(transaction: Transaction) {
    this.transactionsSignal.update((current: Transaction[]) => [...current, transaction]);
  }

  removeTransaction(transactionId: string) {
    this.transactionsSignal.update((current: Transaction[]) =>
      current.filter((transaction: Transaction) => transaction.id !== transactionId)
    );
  }
}

