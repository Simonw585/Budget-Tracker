import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { IncomeComponent } from './features/income/income';
import { ExpensesComponent } from './features/expenses/expenses';
import { AnalyticsComponent } from './features/analytics/analytics';
import { ProfileComponent } from './features/profile/profile';

// Page routes: dashboard, income, expenses, analytics, profile, and a fallback redirect.
export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
