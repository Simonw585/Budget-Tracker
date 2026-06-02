# Budget Tracker Guide

This guide has been updated to match the current Budget Tracker project and reflects both manual review and AI-assisted refinement.

## 1. Current Project Overview

Budget Tracker is built with Angular 21 using standalone components, router-based navigation, and Chart.js analytics.

Key project files:

- `angular.json` — workspace configuration
- `package.json` — dependencies and scripts
- `src/main.ts` — bootstrapApplication entrypoint
- `src/app/app.routes.ts` — route definitions
- `src/app/core/services/budget.service.ts` — transaction state and analytics data
- `src/app/core/models/budget.model.ts` — typed transaction model
- `src/app/features/dashboard/dashboard.ts` — home dashboard view
- `src/app/features/income/income.ts` — income entry and editing
- `src/app/features/expenses/expenses.ts` — expense entry and editing
- `src/app/features/analytics/analytics.ts` — Chart.js analytics page
- `src/app/layout/navbar/navbar.ts` — top navigation bar
- `src/app/layout/sidebar/sidebar.ts` — app navigation links
- `src/styles.scss` — global styles

## 2. Current Architecture

Budget Tracker uses a standalone application bootstrap model with `bootstrapApplication` and a route provider.

### Main entry point

`src/main.ts` contains:

- `AppComponent` as a standalone root component
- `RouterOutlet` for page rendering
- `NavbarComponent` and `SidebarComponent` for layout
- `provideRouter(appRoutes)` to wire routing

### Router configuration

`src/app/app.routes.ts` defines:

- `/` → `DashboardComponent`
- `/income` → `IncomeComponent`
- `/expenses` → `ExpensesComponent`
- `/analytics` → `AnalyticsComponent`
- wildcard route redirect to `/`

## 3. Key Features

### Dashboard

The dashboard component shows:

- total income
- total expenses
- current balance
- top expense categories
- monthly cash flow summary

It reads data from `BudgetService` using Angular computed signals.

### Income

The income feature supports:

- adding new income transactions
- inline editing of income records
- deleting income records

The component uses `FormsModule` and `ngModel` for form binding.

### Expenses

The expenses feature supports:

- adding new expense transactions
- inline editing of expenses
- deleting expense records

This view also uses `FormsModule` and `ngModel`.

### Analytics

The analytics page renders:

- a monthly income vs expense line chart
- an expense category doughnut chart
- a category breakdown list

The `AnalyticsComponent` uses `ng2-charts` with `BaseChartDirective` and `provideCharts(withDefaultRegisterables())`.

## 4. BudgetService and Data Model

`src/app/core/services/budget.service.ts` is the central state store.

It provides:

- `transactions` signal
- `incomeTransactions` and `expenseTransactions`
- `totalIncome`, `totalExpenses`, `balance`
- `topExpenseCategories`
- `expenseCategoryBreakdown`
- `annualIncomeByMonth`, `annualExpenseByMonth`
- `yearLabels`
- `monthlyCashFlow`
- `monthlyCategorySeries`

It also provides methods for:

- `addTransaction()`
- `updateTransaction()`
- `removeTransaction()`

The service generates a full year of sample income and expense transactions automatically for charting.

### Transaction model

`src/app/core/models/budget.model.ts` defines:

```ts
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
```

## 5. Current Dependencies

`package.json` includes:

- `@angular/*` 21.2.x
- `@angular/forms`
- `@angular/router`
- `chart.js`
- `ng2-charts`
- `rxjs`
- `zone.js`

## 6. Run and Build Instructions

From the project root:

```bash
npm install
npm start
```

For a production-style build:

```bash
npm run build -- --configuration development
```

Then open `http://localhost:4200`.

## 7. Styling and Layout

The current app uses glassmorphism styling and a grid layout in `styles.scss`.

The root layout includes:

- `app-shell` container
- `layout-grid` for sidebar + page content
- `glass-card` panels for feature pages

Use responsive rules to keep the page usable on smaller screens.

## 8. Updating the App

If you want to extend Budget Tracker, the cleanest places to add features are:

- `src/app/core/services/budget.service.ts` for analytics and transaction storage
- `src/app/features/dashboard/dashboard.ts` for business summaries
- `src/app/features/income/income.ts` and `src/app/features/expenses/expenses.ts` for entry/edit flows
- `src/app/features/analytics/analytics.ts` for chart visualizations
- `src/app/layout/navbar/navbar.ts` and `sidebar/sidebar.ts` for navigation updates

## 9. Notes on AI + Manual Creation

This guide was updated manually to reflect the current source tree and also refined using AI assistance to ensure accuracy and readability.

- Manual: verified actual file names and routes
- AI-assisted: drafted structure, summarized features, and aligned the guide with the current codebase

Use this guide as a reference when exploring, extending, or maintaining the Budget Tracker project.

### Production build command

```bash
npm run build -- --configuration production
```

### Deployment considerations

- Use lazy-loaded routes to reduce initial bundle size
- Optimize images and icon assets
- Enable Angular production mode
- Serve via an HTTP server or static host

## 9. SCSS Glassmorphism Styling

A polished glassmorphism theme enhances modern dashboard UI.

### Example global SCSS

```scss
:root {
  --surface: rgba(255, 255, 255, 0.12);
  --surface-strong: rgba(255, 255, 255, 0.22);
  --border: rgba(255, 255, 255, 0.18);
  --text-primary: #f4f7ff;
  --text-secondary: #cfd8ff;
  --accent: #4f7bff;
  --background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0b111c 100%);
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
  background: var(--background);
}

.glass-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(18px);
  padding: 1.8rem;
}

.glass-card h3 {
  color: var(--text-primary);
}
```

### UI polish tips

- Use subtle gradients for cards and backgrounds
- Add soft icon accents and micro-animations
- Use clear spacing and rounded corners for comfort
- Keep text contrast high for readability

## 10. Commands to Install and Run

Use these commands in the workspace root.

```bash
npm install
npm start
```

Alternative Angular CLI commands:

```bash
ng serve
ng build
ng test
```

For production build:

```bash
npm run build -- --configuration production
```

## 11. Deployment Instructions

### Deploy to static hosting

- Build production: `npm run build -- --configuration production`
- Deploy `dist/budget-tracker-pro/` contents to a static host

### Options

- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

### Example Netlify deploy

1. Build app:
   ```bash
   npm run build -- --configuration production
   ```
2. Drag `dist/budget-tracker-pro` folder into Netlify deploy panel or connect repository.

### Example GitHub Pages deploy

1. Install Angular CLI GitHub Pages deployer:
   ```bash
   npm install -D angular-cli-ghpages
   ```
2. Build app:
   ```bash
   npm run build -- --configuration production
   ```
3. Deploy:
   ```bash
   npx ngh --dir=dist/budget-tracker-pro
   ```

## 12. Future Upgrade Ideas

A roadmap of next-level improvements:

- Add authentication and user accounts
- Persist data with Firebase, Supabase, or REST API backend
- Add recurring income/expense scheduling
- Create forecast and savings goal planning tools
- Add currency conversion and multi-currency support
- Add export/import CSV, PDF reports, and printable summaries
- Add notifications and budget limit alerts
- Add dark/light theme toggle
- Add mobile PWA support
- Add transaction search, filters, and tags

## 13. Recommended App Enhancements

- Use local storage or backend API for persistence
- Add automated test coverage for components and services
- Use Angular route guards and state management patterns
- Apply accessibility best practices and keyboard support
- Continue optimizing for mobile-first UX

---

This guide is designed to fit your existing Angular 21 budget tracker workspace and support a complete, professional build from setup through deployment.
