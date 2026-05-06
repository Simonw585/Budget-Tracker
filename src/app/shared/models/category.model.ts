/* File: C:\Users\si.white\budget-tracker\src\app\shared\models\category.model.ts
   Description: Data model representing transaction category metadata.
*/

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}


