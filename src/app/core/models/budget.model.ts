export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  source: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface ExpenseCategorySummary {
  category: string;
  amount: number;
}

export interface MonthlyCashFlowItem {
  month: string;
  amount: number;
}
