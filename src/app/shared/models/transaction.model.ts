/* File: C:\Users\si.white\budget-tracker\src\app\shared\models\transaction.model.ts
   Description: Data model for individual transactions (amount, date, type, category).
*/

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  note?: string;
}



