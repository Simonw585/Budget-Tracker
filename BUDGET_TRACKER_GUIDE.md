# Budget Tracker Guide

A complete professional guide for an Angular 21 budget tracker app built for modern productivity, responsive dashboards, Chart.js visualizations, glassmorphism styling, and a production-ready architecture.

## 1. Angular 21 Project Overview

Your project is structured for clarity, modularity, and scalability:

- `angular.json` — Angular CLI workspace configuration
- `package.json` — app dependencies and npm scripts
- `src/` — application source code
  - `src/app/` — main application module and feature boundaries
    - `core/` — shared services, app-level providers, state logic
      - `services/` — budget data, chart config, auth stubs
    - `features/` — business features
      - `dashboard/` — home analytics and charts
      - `expenses/` — expense management and categories
      - `income/` — income sources and entry forms
    - `layout/` — reusable layout components
      - `sidebar/` — site navigation and menu
    - `shared/` — UI components, models, pipes, directives
      - `components/` — cards, widgets, summary blocks
  - `src/styles/` — global styling utilities and theme files
  - `src/styles.scss` — root styles and glassmorphism theme
  - `src/main.ts` — application bootstrap
  - `src/index.html` — shell HTML and meta tags

## 2. VS Code Startup Walkthrough

1. Open VS Code.
2. Open folder: `File` → `Open Folder...` → `c:\Users\si.white\budget-tracker`
3. Install recommended extensions (optional but useful):
   - ESLint
   - Angular Language Service
   - Prettier
   - Live Server / Debugger for Chrome
4. Open an integrated terminal: `Terminal` → `New Terminal`
5. Run the app:

```bash
npm install
npm start
```

6. Visit `http://localhost:4200`.
7. Use the Explorer to navigate `src/app/` and the `dashboard`, `expenses`, `income` feature modules.
8. Use `Ctrl+Shift+P` to access Angular commands and search `Angular: Generate Component` or `Angular: Generate Service`.

## 3. Full CGI-style Dashboard Setup

A professional budget tracker dashboard should include:

- Summary cards for total income, total expenses, savings, and budget balance
- Chart widgets for expense distribution, income breakdown, and cash-flow trends
- A rich card layout with glassmorphism styling and soft shadows
- Header controls and quick action buttons
- Responsive grid layout adapting from desktop to mobile

### Recommended Dashboard Components

- `dashboard-summary-card` — total values, daily/weekly change
- `dashboard-chart-card` — Chart.js area chart for cash flow
- `dashboard-pie-card` — expense category breakdown
- `dashboard-income-table` — recent income entries
- `dashboard-expense-table` — recent expense entries

### Dashboard Data Model

Use a typed model for dashboard metrics and charts:

- `incomeSources: IncomeSource[]`
- `expenseCategories: ExpenseCategory[]`
- `transactions: Transaction[]`
- `dashboardStats: DashboardStats`

## 4. Chart.js Integration

This project already includes Chart.js and `ng2-charts` in `package.json`.

### Install and configure

```bash
npm install
npm install chart.js ng2-charts
```

### Example `DashboardChartComponent`

- Import `NgChartsModule` in `AppModule` or `DashboardModule`
- Define chart data with `ChartConfiguration` and `ChartDataset`
- Use `baseChart` in the template

#### Template example

```html
<div class="chart-card glass-card">
  <canvas baseChart
    [data]="chartData"
    [options]="chartOptions"
    [type]="chartType">
  </canvas>
</div>
```

#### Component example

```ts
import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent {
  public chartType: ChartType = 'line';
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [4200, 4600, 5200, 5000, 5400, 5800],
        label: 'Cash Flow',
        backgroundColor: 'rgba(63, 81, 181, 0.25)',
        borderColor: '#3f51b5',
        fill: true,
      }
    ]
  };
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };
}
```

## 5. Responsive Layouts

Design responsive UI using a combination of CSS grid and flexbox.

### Core layout rules

- Desktop: 3-column grid cards
- Tablet: 2-column grid
- Mobile: single-column stacked cards
- Use `minmax(280px, 1fr)` for flexible card columns

### Example SCSS layout

```scss
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.glass-card {
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

@media (max-width: 900px) {
  .dashboard-grid { gap: 1rem; }
}

@media (max-width: 600px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
```

## 6. Income Sources (10 Recommended)

A budget tracker becomes more useful when it supports many income streams.

Recommended income sources:

| Income Sources    | Example Amount (GBP) |
| ----------------- | -------------------- |
| Salary            | £3,200               |
| Freelancing       | £850                 |
| Investments       | £420                 |
| Rental Income     | £1,100               |
| Side Hustle       | £360                 |
| Dividends         | £150                 |
| Online Sales      | £290                 |
| Affiliate Revenue | £120                 |
| Cashback Rewards  | £45                  |
| Bonuses           | £540                 |

### Income form fields

- Source name
- Amount (GBP)
- Category / type
- Date received
- Notes

## 7. Expense Categories (20 Recommended)

Track spending across broad categories for better budget control.

Recommended expense categories:

| Expense Categories | Example Amount (GBP) |
| ------------------ | -------------------- |
| Rent               | £1,200               |
| Mortgage           | £1,050               |
| Utilities          | £180                 |
| Internet           | £45                  |
| Mobile Phone       | £38                  |
| Insurance          | £120                 |
| Fuel               | £75                  |
| Car Payments       | £290                 |
| Public Transport   | £55                  |
| Groceries          | £320                 |
| Dining Out         | £140                 |
| Entertainment      | £85                  |
| Subscriptions      | £60                  |
| Medical            | £70                  |
| Gym                | £35                  |
| Shopping           | £150                 |
| Education          | £90                  |
| Childcare          | £250                 |
| Savings            | £300                 |
| Emergency Fund     | £100                 |

### Expense entry fields

- Category
- Amount (GBP)
- Merchant / payee
- Date
- Notes

## 8. Production-ready Architecture

Build for production with scalable, maintainable patterns.

### Core principles

- Feature modules for `dashboard`, `income`, and `expenses`
- `core` module for services and singleton providers
- `shared` module for reusable UI elements
- On-push change detection for performance-critical views
- Lazy loading for feature routes
- Environment configuration for dev and prod builds

### Suggested architecture

- `app/core/services/budget.service.ts` — hold transaction logic and data helpers
- `app/features/dashboard/dashboard.module.ts` — encapsulate dashboard feature
- `app/features/expenses/expenses.module.ts` — expense flows and category management
- `app/features/income/income.module.ts` — income dashboard and add/edit flows
- `app/shared/components/` — cards, buttons, chart wrappers, form controls

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
