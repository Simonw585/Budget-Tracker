(self["webpackChunkbudget_tracker_pro"] = self["webpackChunkbudget_tracker_pro"] || []).push([["main"],{

/***/ 2181
/*!*******************************!*\
  !*** ./src/app/app.routes.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appRoutes: () => (/* binding */ appRoutes)
/* harmony export */ });
/* harmony import */ var _features_dashboard_dashboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./features/dashboard/dashboard */ 1547);
/* harmony import */ var _features_income_income__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features/income/income */ 4851);
/* harmony import */ var _features_expenses_expenses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/expenses/expenses */ 6643);
/* harmony import */ var _features_analytics_analytics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/analytics/analytics */ 6135);




const appRoutes = [{
  path: '',
  component: _features_dashboard_dashboard__WEBPACK_IMPORTED_MODULE_0__.DashboardComponent
}, {
  path: 'income',
  component: _features_income_income__WEBPACK_IMPORTED_MODULE_1__.IncomeComponent
}, {
  path: 'expenses',
  component: _features_expenses_expenses__WEBPACK_IMPORTED_MODULE_2__.ExpensesComponent
}, {
  path: 'analytics',
  component: _features_analytics_analytics__WEBPACK_IMPORTED_MODULE_3__.AnalyticsComponent
}, {
  path: '**',
  redirectTo: ''
}];

/***/ },

/***/ 2061
/*!*************************************************!*\
  !*** ./src/app/core/services/budget.service.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BudgetService: () => (/* binding */ BudgetService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4363);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2260);


const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let BudgetService = class BudgetService {
  constructor() {
    this.transactionsSignal = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.signal)(this.generateYearTransactions(2026));
    this.transactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactionsSignal());
    this.incomeTransactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactions().filter(transaction => transaction.type === 'income'));
    this.expenseTransactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactions().filter(transaction => transaction.type === 'expense'));
    this.totalIncome = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.incomeTransactions().reduce((sum, transaction) => sum + transaction.amount, 0));
    this.totalExpenses = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.expenseTransactions().reduce((sum, transaction) => sum + transaction.amount, 0));
    this.balance = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.totalIncome() - this.totalExpenses());
    this.topExpenseCategories = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.aggregateByCategory(this.expenseTransactions()).slice(0, 5));
    this.expenseCategoryBreakdown = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.aggregateByCategory(this.expenseTransactions()));
    this.incomeCategoryBreakdown = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.aggregateByCategory(this.incomeTransactions()));
    this.monthlyCashFlow = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => {
      const amounts = this.aggregateByMonth(this.transactions());
      return MONTH_NAMES.map((month, index) => ({
        month,
        amount: amounts[index]
      }));
    });
    this.annualIncomeByMonth = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.aggregateByMonth(this.incomeTransactions()));
    this.annualExpenseByMonth = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.aggregateByMonth(this.expenseTransactions()));
    this.yearLabels = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => MONTH_NAMES);
    this.monthlyCategorySeries = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => {
      const categorySeries = new Map();
      this.transactions().forEach(transaction => {
        const monthIndex = new Date(transaction.date).getMonth();
        const series = categorySeries.get(transaction.category) ?? Array(12).fill(0);
        series[monthIndex] += transaction.amount;
        categorySeries.set(transaction.category, series);
      });
      return Array.from(categorySeries.entries()).map(([category, data]) => ({
        category,
        data
      }));
    });
  }
  addTransaction(transaction) {
    this.transactionsSignal.update(current => [...current, transaction]);
  }
  updateTransaction(transaction) {
    this.transactionsSignal.update(current => current.map(existing => existing.id === transaction.id ? transaction : existing));
  }
  removeTransaction(transactionId) {
    this.transactionsSignal.update(current => current.filter(transaction => transaction.id !== transactionId));
  }
  aggregateByCategory(transactions) {
    const totals = new Map();
    transactions.forEach(transaction => {
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
    });
    return Array.from(totals.entries()).map(([category, amount]) => ({
      category,
      amount
    })).sort((a, b) => b.amount - a.amount);
  }
  aggregateByMonth(transactions) {
    const buckets = Array(12).fill(0);
    transactions.forEach(transaction => {
      const monthIndex = new Date(transaction.date).getMonth();
      buckets[monthIndex] += transaction.amount;
    });
    return buckets;
  }
  generateYearTransactions(year) {
    const transactions = [];
    let nextId = 1;
    const add = (type, category, source, amount, date, notes = '') => {
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
};
BudgetService = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.Injectable)({
  providedIn: 'root'
})], BudgetService);


/***/ },

/***/ 6135
/*!*************************************************!*\
  !*** ./src/app/features/analytics/analytics.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnalyticsComponent: () => (/* binding */ AnalyticsComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _analytics_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./analytics.html?ngResource */ 8693);
/* harmony import */ var _analytics_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./analytics.css?ngResource */ 1608);
/* harmony import */ var _analytics_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_analytics_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4363);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2260);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 9748);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ng2-charts */ 6045);
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);







let AnalyticsComponent = class AnalyticsComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_8__.BudgetService);
    this.yearLabels = this.budgetService.yearLabels;
    this.incomeByMonth = this.budgetService.annualIncomeByMonth;
    this.expensesByMonth = this.budgetService.annualExpenseByMonth;
    this.expenseCategories = this.budgetService.expenseCategoryBreakdown;
    this.lineChartData = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.computed)(() => ({
      labels: this.yearLabels(),
      datasets: [{
        data: this.incomeByMonth(),
        label: 'Income',
        borderColor: '#4f7bff',
        backgroundColor: 'rgba(79, 123, 255, 0.25)',
        tension: 0.35,
        fill: true
      }, {
        data: this.expensesByMonth(),
        label: 'Expenses',
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.25)',
        tension: 0.35,
        fill: true
      }]
    }));
    this.doughnutChartData = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.computed)(() => ({
      labels: this.expenseCategories().map(item => item.category),
      datasets: [{
        data: this.expenseCategories().map(item => item.amount),
        backgroundColor: ['#4f46e5', '#2563eb', '#22c55e', '#facc15', '#fb7185', '#f97316']
      }]
    }));
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };
    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }
};
AnalyticsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-analytics',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, ng2_charts__WEBPACK_IMPORTED_MODULE_7__.BaseChartDirective],
  providers: [(0,ng2_charts__WEBPACK_IMPORTED_MODULE_7__.provideCharts)((0,ng2_charts__WEBPACK_IMPORTED_MODULE_7__.withDefaultRegisterables)())],
  template: _analytics_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_analytics_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], AnalyticsComponent);


/***/ },

/***/ 1547
/*!*************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardComponent: () => (/* binding */ DashboardComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _dashboard_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.html?ngResource */ 1873);
/* harmony import */ var _dashboard_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dashboard.css?ngResource */ 3300);
/* harmony import */ var _dashboard_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dashboard_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4363);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9748);
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);






let DashboardComponent = class DashboardComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__.BudgetService);
    this.totalIncome = this.budgetService.totalIncome;
    this.totalExpenses = this.budgetService.totalExpenses;
    this.balance = this.budgetService.balance;
    this.topExpenseCategories = this.budgetService.topExpenseCategories;
    this.monthlyCashFlow = this.budgetService.monthlyCashFlow;
  }
};
DashboardComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-dashboard',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule],
  template: _dashboard_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_dashboard_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], DashboardComponent);


/***/ },

/***/ 6643
/*!***********************************************!*\
  !*** ./src/app/features/expenses/expenses.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpensesComponent: () => (/* binding */ ExpensesComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _expenses_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expenses.html?ngResource */ 5713);
/* harmony import */ var _expenses_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expenses.css?ngResource */ 228);
/* harmony import */ var _expenses_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_expenses_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4363);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9748);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);







let ExpensesComponent = class ExpensesComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_7__.BudgetService);
    this.expenseTransactions = this.budgetService.expenseTransactions;
    this.editingId = null;
    this.editModel = null;
    this.newTransaction = {
      source: '',
      category: 'Groceries',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }
  startEdit(transaction) {
    this.editingId = transaction.id;
    this.editModel = {
      ...transaction
    };
  }
  saveEdit() {
    if (this.editModel) {
      this.budgetService.updateTransaction(this.editModel);
      this.cancelEdit();
    }
  }
  cancelEdit() {
    this.editingId = null;
    this.editModel = null;
  }
  deleteTransaction(transactionId) {
    this.budgetService.removeTransaction(transactionId);
  }
  addExpense() {
    const id = `expense-${Date.now()}`;
    this.budgetService.addTransaction({
      id,
      type: 'expense',
      category: this.newTransaction.category,
      source: this.newTransaction.source,
      amount: Number(this.newTransaction.amount),
      date: this.newTransaction.date,
      notes: this.newTransaction.notes
    });
    this.newTransaction = {
      source: '',
      category: 'Groceries',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }
};
ExpensesComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-expenses',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule],
  template: _expenses_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_expenses_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], ExpensesComponent);


/***/ },

/***/ 4851
/*!*******************************************!*\
  !*** ./src/app/features/income/income.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncomeComponent: () => (/* binding */ IncomeComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _income_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./income.html?ngResource */ 8985);
/* harmony import */ var _income_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./income.css?ngResource */ 2596);
/* harmony import */ var _income_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_income_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4363);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9748);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);







let IncomeComponent = class IncomeComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_7__.BudgetService);
    this.incomeTransactions = this.budgetService.incomeTransactions;
    this.editingId = null;
    this.editModel = null;
    this.newTransaction = {
      source: '',
      category: 'Salary',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }
  startEdit(transaction) {
    this.editingId = transaction.id;
    this.editModel = {
      ...transaction
    };
  }
  saveEdit() {
    if (this.editModel) {
      this.budgetService.updateTransaction(this.editModel);
      this.cancelEdit();
    }
  }
  cancelEdit() {
    this.editingId = null;
    this.editModel = null;
  }
  deleteTransaction(transactionId) {
    this.budgetService.removeTransaction(transactionId);
  }
  addIncome() {
    const id = `income-${Date.now()}`;
    this.budgetService.addTransaction({
      id,
      type: 'income',
      category: this.newTransaction.category,
      source: this.newTransaction.source,
      amount: Number(this.newTransaction.amount),
      date: this.newTransaction.date,
      notes: this.newTransaction.notes
    });
    this.newTransaction = {
      source: '',
      category: 'Salary',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }
};
IncomeComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-income',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule],
  template: _income_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_income_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], IncomeComponent);


/***/ },

/***/ 7436
/*!*****************************************!*\
  !*** ./src/app/layout/navbar/navbar.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavbarComponent: () => (/* binding */ NavbarComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _navbar_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navbar.html?ngResource */ 7600);
/* harmony import */ var _navbar_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navbar.css?ngResource */ 1575);
/* harmony import */ var _navbar_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_navbar_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 6264);





let NavbarComponent = class NavbarComponent {};
NavbarComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-navbar',
  standalone: true,
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
  template: _navbar_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_navbar_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], NavbarComponent);


/***/ },

/***/ 7954
/*!*******************************************!*\
  !*** ./src/app/layout/sidebar/sidebar.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarComponent: () => (/* binding */ SidebarComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _sidebar_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar.html?ngResource */ 6718);
/* harmony import */ var _sidebar_css_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidebar.css?ngResource */ 5261);
/* harmony import */ var _sidebar_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sidebar_css_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 6264);





let SidebarComponent = class SidebarComponent {};
SidebarComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-sidebar',
  standalone: true,
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
  template: _sidebar_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_sidebar_css_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], SidebarComponent);


/***/ },

/***/ 4429
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4398);
/* harmony import */ var _styles_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss?ngResource */ 5374);
/* harmony import */ var _styles_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ 4967);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6124);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 3305);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 6264);
/* harmony import */ var _app_layout_navbar_navbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app/layout/navbar/navbar */ 7436);
/* harmony import */ var _app_layout_sidebar_sidebar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app/layout/sidebar/sidebar */ 7954);
/* harmony import */ var _app_app_routes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app/app.routes */ 2181);








let AppComponent = class AppComponent {};
AppComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-root',
  standalone: true,
  imports: [_app_layout_navbar_navbar__WEBPACK_IMPORTED_MODULE_6__.NavbarComponent, _app_layout_sidebar_sidebar__WEBPACK_IMPORTED_MODULE_7__.SidebarComponent, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterOutlet],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <div class="layout-grid">
        <app-sidebar></app-sidebar>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [(_styles_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
})], AppComponent);

(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.bootstrapApplication)(AppComponent, {
  providers: [(0,_angular_router__WEBPACK_IMPORTED_MODULE_5__.provideRouter)(_app_app_routes__WEBPACK_IMPORTED_MODULE_8__.appRoutes)]
});

/***/ },

/***/ 1608
/*!*************************************************************!*\
  !*** ./src/app/features/analytics/analytics.css?ngResource ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 3300
/*!*************************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.css?ngResource ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 228
/*!***********************************************************!*\
  !*** ./src/app/features/expenses/expenses.css?ngResource ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 2596
/*!*******************************************************!*\
  !*** ./src/app/features/income/income.css?ngResource ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 1575
/*!*****************************************************!*\
  !*** ./src/app/layout/navbar/navbar.css?ngResource ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 5261
/*!*******************************************************!*\
  !*** ./src/app/layout/sidebar/sidebar.css?ngResource ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 5374
/*!***************************************!*\
  !*** ./src/styles.scss?ngGlobalStyle ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.container {
  padding: 40px;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.app-shell {
  min-height: 100vh;
  padding: 20px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.5rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.nav-actions a,
.sidebar a {
  color: #dbeafe;
  text-decoration: none;
  font-weight: 500;
}

.sidebar {
  min-height: 300px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin: 0.75rem 0;
}

.feature-page,
.dashboard-page {
  display: block;
}

.feature-page h2,
.dashboard-page h3,
.dashboard-page h4 {
  margin-top: 0;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}`, "",{"version":3,"sources":["webpack://./src/styles.scss"],"names":[],"mappings":"AAAA;EACE,SAAA;EACA,gCAAA;EACA,qDACE;EACF,YAAA;AAAF;;AAGA;EACE,qCAAA;EACA,mCAAA;EACA,2BAAA;EACA,0CAAA;EACA,mBAAA;EACA,aAAA;EACA,yCACE;AADJ;;AAIA;EACE,aAAA;AADF;;AAIA;EACE,qCAAA;EACA,mCAAA;EACA,2BAAA;EACA,mBAAA;EACA,aAAA;EACA,gBAAA;AADF;;AAIA;EACE,aAAA;EACA,2DACE;EACF,SAAA;AAFF;;AAKA;EACE,iBAAA;EACA,aAAA;AAFF;;AAKA;EACE,aAAA;EACA,gCAAA;EACA,SAAA;EACA,kBAAA;AAFF;;AAKA;EACE,aAAA;EACA,sBAAA;EACA,SAAA;AAFF;;AAKA;EACE,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,SAAA;EACA,oBAAA;AAFF;;AAKA;EACE,aAAA;EACA,SAAA;AAFF;;AAKA;;EAEE,cAAA;EACA,qBAAA;EACA,gBAAA;AAFF;;AAKA;EACE,iBAAA;AAFF;;AAKA;EACE,gBAAA;EACA,UAAA;EACA,SAAA;AAFF;;AAKA;EACE,iBAAA;AAFF;;AAKA;;EAEE,cAAA;AAFF;;AAKA;;;EAGE,aAAA;AAFF;;AAKA;EACE;IACE,0BAAA;EAFF;AACF","sourcesContent":["body {\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n  background:\n    linear-gradient(135deg, #0f172a, #1e293b);\n  color: white;\n}\n\n.glass-card {\n  background: rgba(255,255,255,0.08);\n  -webkit-backdrop-filter: blur(18px);\n  backdrop-filter: blur(18px);\n  border: 1px solid rgba(255,255,255,0.1);\n  border-radius: 20px;\n  padding: 20px;\n  box-shadow:\n    0 8px 32px rgba(0,0,0,0.3);\n}\n\n.container {\n  padding: 40px;\n}\n\n.card {\n  background: rgba(255,255,255,0.08);\n  -webkit-backdrop-filter: blur(18px);\n  backdrop-filter: blur(18px);\n  border-radius: 20px;\n  padding: 20px;\n  margin-top: 20px;\n}\n\n.dashboard-grid {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n\n.app-shell {\n  min-height: 100vh;\n  padding: 20px;\n}\n\n.layout-grid {\n  display: grid;\n  grid-template-columns: 280px 1fr;\n  gap: 20px;\n  align-items: start;\n}\n\n.page-content {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  padding: 1rem 1.5rem;\n}\n\n.nav-actions {\n  display: flex;\n  gap: 1rem;\n}\n\n.nav-actions a,\n.sidebar a {\n  color: #dbeafe;\n  text-decoration: none;\n  font-weight: 500;\n}\n\n.sidebar {\n  min-height: 300px;\n}\n\n.sidebar ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.sidebar li {\n  margin: 0.75rem 0;\n}\n\n.feature-page,\n.dashboard-page {\n  display: block;\n}\n\n.feature-page h2,\n.dashboard-page h3,\n.dashboard-page h4 {\n  margin-top: 0;\n}\n\n@media (max-width: 900px) {\n  .layout-grid {\n    grid-template-columns: 1fr;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ },

/***/ 8693
/*!**************************************************************!*\
  !*** ./src/app/features/analytics/analytics.html?ngResource ***!
  \**************************************************************/
(module) {

"use strict";
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Analytics</h2>\r\n  <p>Review charts, trends, and category breakdowns for every GBP transaction.</p>\r\n\r\n  <div class=\"chart-grid\">\r\n    <article class=\"glass-card chart-card\">\r\n      <h4>Income vs Expenses</h4>\r\n      <div class=\"chart-wrapper\">\r\n        <canvas baseChart\r\n          [data]=\"lineChartData()\"\r\n          [options]=\"lineChartOptions\"\r\n          [type]=\"'line'\">\r\n        </canvas>\r\n      </div>\r\n    </article>\r\n\r\n    <article class=\"glass-card chart-card\">\r\n      <h4>Expense Category Breakdown</h4>\r\n      <div class=\"chart-wrapper\">\r\n        <canvas baseChart\r\n          [data]=\"doughnutChartData()\"\r\n          [options]=\"doughnutChartOptions\"\r\n          [type]=\"'doughnut'\">\r\n        </canvas>\r\n      </div>\r\n    </article>\r\n  </div>\r\n\r\n  <section class=\"glass-card\">\r\n    <h4>Expense categories</h4>\r\n    <ul>\r\n      <li *ngFor=\"let category of expenseCategories()\">\r\n        {{ category.category }} — {{ category.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}\r\n      </li>\r\n    </ul>\r\n  </section>\r\n</section>\r\n";

/***/ },

/***/ 1873
/*!**************************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.html?ngResource ***!
  \**************************************************************/
(module) {

"use strict";
module.exports = "<section class=\"dashboard-page\">\r\n  <div class=\"dashboard-grid\">\r\n    <article class=\"glass-card\">\r\n      <h3>Total Income</h3>\r\n      <p>{{ totalIncome() | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</p>\r\n    </article>\r\n    <article class=\"glass-card\">\r\n      <h3>Total Expenses</h3>\r\n      <p>{{ totalExpenses() | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</p>\r\n    </article>\r\n    <article class=\"glass-card\">\r\n      <h3>Balance</h3>\r\n      <p>{{ balance() | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</p>\r\n    </article>\r\n  </div>\r\n\r\n  <div class=\"dashboard-grid\">\r\n    <article class=\"glass-card\">\r\n      <h4>Monthly Cash Flow</h4>\r\n      <ul>\r\n        <li *ngFor=\"let item of monthlyCashFlow()\">\r\n          {{ item.month }}: {{ item.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}\r\n        </li>\r\n      </ul>\r\n    </article>\r\n    <article class=\"glass-card\">\r\n      <h4>Top Expense Categories</h4>\r\n      <ul>\r\n        <li *ngFor=\"let category of topExpenseCategories()\">\r\n          {{ category.category }}: {{ category.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}\r\n        </li>\r\n      </ul>\r\n    </article>\r\n  </div>\r\n</section>\r\n";

/***/ },

/***/ 5713
/*!************************************************************!*\
  !*** ./src/app/features/expenses/expenses.html?ngResource ***!
  \************************************************************/
(module) {

"use strict";
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Expenses</h2>\r\n  <p>Log costs for rent, utilities, groceries, transport, subscriptions, and savings.</p>\r\n\r\n  <form class=\"transaction-form\" (ngSubmit)=\"addExpense()\">\r\n    <div>\r\n      <label>Merchant</label>\r\n      <input [(ngModel)]=\"newTransaction.source\" name=\"expenseSource\" required />\r\n    </div>\r\n    <div>\r\n      <label>Category</label>\r\n      <input [(ngModel)]=\"newTransaction.category\" name=\"expenseCategory\" required />\r\n    </div>\r\n    <div>\r\n      <label>Date</label>\r\n      <input type=\"date\" [(ngModel)]=\"newTransaction.date\" name=\"expenseDate\" required />\r\n    </div>\r\n    <div>\r\n      <label>Amount</label>\r\n      <input type=\"number\" [(ngModel)]=\"newTransaction.amount\" name=\"expenseAmount\" required />\r\n    </div>\r\n    <div>\r\n      <label>Notes</label>\r\n      <input [(ngModel)]=\"newTransaction.notes\" name=\"expenseNotes\" />\r\n    </div>\r\n    <button type=\"submit\">Add Expense</button>\r\n  </form>\r\n\r\n  <table>\r\n    <thead>\r\n      <tr>\r\n        <th>Category</th>\r\n        <th>Merchant</th>\r\n        <th>Date</th>\r\n        <th>Amount</th>\r\n        <th>Actions</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let transaction of expenseTransactions()\">\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.category }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input [(ngModel)]=\"editModel.category\" name=\"editCategory\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.source }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input [(ngModel)]=\"editModel.source\" name=\"editSource\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.date }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input type=\"date\" [(ngModel)]=\"editModel.date\" name=\"editDate\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input type=\"number\" [(ngModel)]=\"editModel.amount\" name=\"editAmount\" />\r\n        </td>\r\n        <td>\r\n          <button *ngIf=\"editingId !== transaction.id\" type=\"button\" (click)=\"startEdit(transaction)\">Edit</button>\r\n          <button *ngIf=\"editingId === transaction.id\" type=\"button\" (click)=\"saveEdit()\">Save</button>\r\n          <button *ngIf=\"editingId === transaction.id\" type=\"button\" (click)=\"cancelEdit()\">Cancel</button>\r\n          <button type=\"button\" (click)=\"deleteTransaction(transaction.id)\">Delete</button>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</section>\r\n";

/***/ },

/***/ 8985
/*!********************************************************!*\
  !*** ./src/app/features/income/income.html?ngResource ***!
  \********************************************************/
(module) {

"use strict";
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Income</h2>\r\n  <p>Track salary, freelance, investments and all GBP income sources.</p>\r\n\r\n  <form class=\"transaction-form\" (ngSubmit)=\"addIncome()\">\r\n    <div>\r\n      <label>Source</label>\r\n      <input [(ngModel)]=\"newTransaction.source\" name=\"incomeSource\" required />\r\n    </div>\r\n    <div>\r\n      <label>Category</label>\r\n      <input [(ngModel)]=\"newTransaction.category\" name=\"incomeCategory\" required />\r\n    </div>\r\n    <div>\r\n      <label>Date</label>\r\n      <input type=\"date\" [(ngModel)]=\"newTransaction.date\" name=\"incomeDate\" required />\r\n    </div>\r\n    <div>\r\n      <label>Amount</label>\r\n      <input type=\"number\" [(ngModel)]=\"newTransaction.amount\" name=\"incomeAmount\" required />\r\n    </div>\r\n    <div>\r\n      <label>Notes</label>\r\n      <input [(ngModel)]=\"newTransaction.notes\" name=\"incomeNotes\" />\r\n    </div>\r\n    <button type=\"submit\">Add Income</button>\r\n  </form>\r\n\r\n  <table>\r\n    <thead>\r\n      <tr>\r\n        <th>Source</th>\r\n        <th>Category</th>\r\n        <th>Date</th>\r\n        <th>Amount</th>\r\n        <th>Actions</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let transaction of incomeTransactions()\">\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.source }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input [(ngModel)]=\"editModel.source\" name=\"editSource\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.category }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input [(ngModel)]=\"editModel.category\" name=\"editCategory\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.date }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input type=\"date\" [(ngModel)]=\"editModel.date\" name=\"editDate\" />\r\n        </td>\r\n        <td *ngIf=\"editingId !== transaction.id\">{{ transaction.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</td>\r\n        <td *ngIf=\"editingId === transaction.id\">\r\n          <input type=\"number\" [(ngModel)]=\"editModel.amount\" name=\"editAmount\" />\r\n        </td>\r\n        <td>\r\n          <button *ngIf=\"editingId !== transaction.id\" type=\"button\" (click)=\"startEdit(transaction)\">Edit</button>\r\n          <button *ngIf=\"editingId === transaction.id\" type=\"button\" (click)=\"saveEdit()\">Save</button>\r\n          <button *ngIf=\"editingId === transaction.id\" type=\"button\" (click)=\"cancelEdit()\">Cancel</button>\r\n          <button type=\"button\" (click)=\"deleteTransaction(transaction.id)\">Delete</button>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</section>\r\n";

/***/ },

/***/ 7600
/*!******************************************************!*\
  !*** ./src/app/layout/navbar/navbar.html?ngResource ***!
  \******************************************************/
(module) {

"use strict";
module.exports = "<nav class=\"navbar glass-card\">\r\n  <div class=\"brand\">Budget Tracker</div>\r\n  <div class=\"nav-actions\">\r\n    <a routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\">Dashboard</a>\r\n    <a routerLink=\"/income\" routerLinkActive=\"active\">Income</a>\r\n    <a routerLink=\"/expenses\" routerLinkActive=\"active\">Expenses</a>\r\n    <a routerLink=\"/analytics\" routerLinkActive=\"active\">Analytics</a>\r\n  </div>\r\n</nav>\r\n";

/***/ },

/***/ 6718
/*!********************************************************!*\
  !*** ./src/app/layout/sidebar/sidebar.html?ngResource ***!
  \********************************************************/
(module) {

"use strict";
module.exports = "<aside class=\"sidebar glass-card\">\r\n  <h2>Navigation</h2>\r\n  <ul>\r\n    <li><a routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{ exact: true }\">Dashboard</a></li>\r\n    <li><a routerLink=\"/income\" routerLinkActive=\"active\">Income</a></li>\r\n    <li><a routerLink=\"/expenses\" routerLinkActive=\"active\">Expenses</a></li>\r\n    <li><a routerLink=\"/analytics\" routerLinkActive=\"active\">Analytics</a></li>\r\n  </ul>\r\n</aside>\r\n";

/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map