import { Injectable, computed, signal } from '@angular/core';
import { ExpenseCategorySummary, MonthlyCashFlowItem, Transaction, TransactionType } from '../models/budget.model';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private transactionsSignal = signal<Transaction[]>(this.generateYearTransactions(2026));

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

  public topExpenseCategories = computed<ExpenseCategorySummary[]>(() =>
    this.aggregateByCategory(this.expenseTransactions()).slice(0, 5)
  );

  public expenseCategoryBreakdown = computed<ExpenseCategorySummary[]>(() =>
    this.aggregateByCategory(this.expenseTransactions())
  );

  public incomeCategoryBreakdown = computed<ExpenseCategorySummary[]>(() =>
    this.aggregateByCategory(this.incomeTransactions())
  );

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

  addTransaction(transaction: Transaction) {
    this.transactionsSignal.update((current: Transaction[]) => [...current, transaction]);
  }

  updateTransaction(transaction: Transaction) {
    this.transactionsSignal.update((current: Transaction[]) =>
      current.map((existing) => (existing.id === transaction.id ? transaction : existing))
    );
  }

  removeTransaction(transactionId: string) {
    this.transactionsSignal.update((current: Transaction[]) =>
      current.filter((transaction: Transaction) => transaction.id !== transactionId)
    );
  }

  private aggregateByCategory(transactions: Transaction[]): ExpenseCategorySummary[] {
    const totals = new Map<string, number>();

    transactions.forEach((transaction) => {
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
    });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  private aggregateByMonth(transactions: Transaction[]): number[] {
    const buckets = Array(12).fill(0);

    transactions.forEach((transaction) => {
      const monthIndex = new Date(transaction.date).getMonth();
      buckets[monthIndex] += transaction.amount;
    });

    return buckets;
  }

  private generateYearTransactions(year: number): Transaction[] {
    const transactions: Transaction[] = [];
    let nextId = 1;

    const add = (
      type: TransactionType,
      category: string,
      source: string,
      amount: number,
      date: string,
      notes = ''
    ) => {
      transactions.push({
        id: `${type}-${nextId++}`,
        type,
        category,
        source,
        amount,
        date,
        notes
      });
    };

    for (let month = 0; month < 12; month += 1) {
      const monthNumber = String(month + 1).padStart(2, '0');
      add('income', 'Salary', 'Primary job', 3200, `${year}-${monthNumber}-01`, 'Monthly salary');
      add('expense', 'Rent', 'Apartment', 1200, `${year}-${monthNumber}-03`, 'Monthly rent');
      add('expense', 'Utilities', 'Gas & electric', 180, `${year}-${monthNumber}-09`, 'Monthly utilities');
      add('expense', 'Internet', 'ISP', 45, `${year}-${monthNumber}-10`, 'Monthly broadband');
      add('expense', 'Mobile Phone', 'Carrier', 38, `${year}-${monthNumber}-14`, 'Monthly mobile plan');
      add('expense', 'Groceries', 'Supermarket', 320 + month * 3, `${year}-${monthNumber}-05`, 'Food shopping');
      add('expense', 'Subscriptions', 'Streaming', 25, `${year}-${monthNumber}-18`, 'Streaming and apps');
      add('expense', 'Transport', 'Public transport', 90, `${year}-${monthNumber}-20`, 'Monthly travel');

      if (month % 3 === 0) {
        add('income', 'Freelancing', 'Consulting', 850 + month * 10, `${year}-${monthNumber}-08`, 'Contract work');
      }

      if (month % 2 === 1) {
        add('income', 'Dividends', 'Investments', 150, `${year}-${monthNumber}-15`, 'Investment payout');
      }
    }

    return transactions;
  }
}


