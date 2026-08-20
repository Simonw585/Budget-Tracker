import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseCategorySummary, MonthlyCashFlowItem, Transaction, TransactionType } from '../models/budget.model';
import { environment } from '../../../environments/environment';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private incomesSignal = signal<Transaction[]>([]);
  private expensesSignal = signal<Transaction[]>([]);

  public transactions = computed(() => [...this.incomesSignal(), ...this.expensesSignal()]);

  public incomeTransactions = computed(() => this.incomesSignal());
  public expenseTransactions = computed(() => this.expensesSignal());

  public totalIncome = computed(() => this.incomeTransactions().reduce((s, t) => s + t.amount, 0));
  public totalExpenses = computed(() => this.expenseTransactions().reduce((s, t) => s + t.amount, 0));
  public balance = computed(() => this.totalIncome() - this.totalExpenses());

  public topExpenseCategories = computed<ExpenseCategorySummary[]>(() => this.aggregateByCategory(this.expenseTransactions()).slice(0, 5));
  public expenseCategoryBreakdown = computed<ExpenseCategorySummary[]>(() => this.aggregateByCategory(this.expenseTransactions()));
  public incomeCategoryBreakdown = computed<ExpenseCategorySummary[]>(() => this.aggregateByCategory(this.incomeTransactions()));

  public monthlyCashFlow = computed<MonthlyCashFlowItem[]>(() => {
    const amounts = this.aggregateByMonth(this.transactions());
    return MONTH_NAMES.map((month, index) => ({ month, amount: amounts[index] }));
  });

  public annualIncomeByMonth = computed(() => this.aggregateByMonth(this.incomeTransactions()));
  public annualExpenseByMonth = computed(() => this.aggregateByMonth(this.expenseTransactions()));
  public yearLabels = computed(() => MONTH_NAMES);

  public monthlyCategorySeries = computed(() => {
    const categorySeries = new Map<string, number[]>();
    this.transactions().forEach((transaction) => {
      const monthIndex = new Date(transaction.date).getMonth();
      const series = categorySeries.get(transaction.category) ?? Array(12).fill(0);
      series[monthIndex] += transaction.amount;
      categorySeries.set(transaction.category, series);
    });
    return Array.from(categorySeries.entries()).map(([category, data]) => ({ category, data }));
  });

  constructor(private http: HttpClient) {
    this.loadAll();
  }

  private loadAll() {
    this.loadIncome();
    this.loadExpenses();
  }

  private normalizeDateValue(dateValue: string | Date | null | undefined): string {
    if (!dateValue) {
      return new Date().toISOString().slice(0, 10);
    }

    const raw = String(dateValue).trim();
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
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getTime() - (parsed.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    }

    return new Date().toISOString().slice(0, 10);
  }

  private loadIncome() {
    this.http.get<any[]>(`${environment.apiUrl}/income`).subscribe({
      next: (rows) => {
        const mapped: Transaction[] = (rows || []).map((r) => ({
          id: `income-${r.id}`,
          type: 'income',
          category: r.category_name || r.category || r.source || 'Income',
          source: r.source || '',
          amount: Number(r.amount) || 0,
          date: this.normalizeDateValue(r.date),
          notes: r.notes || ''
        }));
        this.incomesSignal.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load income from API', err);
      }
    });
  }

  private loadExpenses() {
    this.http.get<any[]>(`${environment.apiUrl}/expenses`).subscribe({
      next: (rows) => {
        const mapped: Transaction[] = (rows || []).map((r) => ({
          id: `expense-${r.id}`,
          type: 'expense',
          category: r.category_name || r.category || 'Expense',
          source: r.description || '',
          amount: Number(r.amount) || 0,
          date: this.normalizeDateValue(r.date),
          notes: r.notes || ''
        }));
        this.expensesSignal.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load expenses from API', err);
      }
    });
  }

  addTransaction(transaction: Transaction) {
    if (transaction.type === 'income') {
      const body = {
        source: transaction.source.trim(),
        category: transaction.category.trim(),
        amount: Number(transaction.amount),
        date: this.normalizeDateValue(transaction.date),
        notes: transaction.notes?.trim() || ''
      };
      this.http.post<any>(`${environment.apiUrl}/income`, body).subscribe({
        next: (res) => {
          const id = `income-${res.id}`;
          this.incomesSignal.update((cur) => [...cur, { ...transaction, id }]);
        },
        error: (err) => console.error('Failed to add income', err)
      });
    } else {
      const body = {
        category: transaction.category.trim(),
        description: transaction.source.trim(),
        amount: Number(transaction.amount),
        date: this.normalizeDateValue(transaction.date),
        notes: transaction.notes?.trim() || ''
      };
      this.http.post<any>(`${environment.apiUrl}/expenses`, body).subscribe({
        next: (res) => {
          const id = `expense-${res.id}`;
          this.expensesSignal.update((cur) => [...cur, { ...transaction, id }]);
        },
        error: (err) => console.error('Failed to add expense', err)
      });
    }
  }

  updateTransaction(transaction: Transaction) {
    const parts = transaction.id.split('-');
    const type = parts[0];
    const id = parts.slice(1).join('-');
    if (type === 'income') {
      const body = {
        source: transaction.source.trim(),
        category: transaction.category.trim(),
        amount: Number(transaction.amount),
        date: this.normalizeDateValue(transaction.date),
        notes: transaction.notes?.trim() || ''
      };
      this.http.put(`${environment.apiUrl}/income/${id}`, body).subscribe({
        next: () => this.incomesSignal.update((cur) => cur.map((t) => (t.id === transaction.id ? transaction : t))),
        error: (err) => console.error('Failed to update income', err)
      });
    } else {
      const body = {
        category: transaction.category.trim(),
        description: transaction.source.trim(),
        amount: Number(transaction.amount),
        date: this.normalizeDateValue(transaction.date),
        notes: transaction.notes?.trim() || ''
      };
      this.http.put(`${environment.apiUrl}/expenses/${id}`, body).subscribe({
        next: () => this.expensesSignal.update((cur) => cur.map((t) => (t.id === transaction.id ? transaction : t))),
        error: (err) => console.error('Failed to update expense', err)
      });
    }
  }

  removeTransaction(transactionId: string) {
    const parts = transactionId.split('-');
    const type = parts[0];
    const id = parts.slice(1).join('-');
    if (type === 'income') {
      this.http.delete(`${environment.apiUrl}/income/${id}`).subscribe({
        next: () => this.incomesSignal.update((cur) => cur.filter((t) => t.id !== transactionId)),
        error: (err) => console.error('Failed to delete income', err)
      });
    } else {
      this.http.delete(`${environment.apiUrl}/expenses/${id}`).subscribe({
        next: () => this.expensesSignal.update((cur) => cur.filter((t) => t.id !== transactionId)),
        error: (err) => console.error('Failed to delete expense', err)
      });
    }
  }

  private aggregateByCategory(transactions: Transaction[]): ExpenseCategorySummary[] {
    const totals = new Map<string, number>();
    transactions.forEach((transaction) => {
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
    });
    return Array.from(totals.entries()).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
  }

  private aggregateByMonth(transactions: Transaction[]): number[] {
    const buckets = Array(12).fill(0);
    transactions.forEach((transaction) => {
      const monthIndex = new Date(transaction.date).getMonth();
      buckets[monthIndex] += transaction.amount;
    });
    return buckets;
  }
}


