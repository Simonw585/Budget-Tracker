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


let BudgetService = class BudgetService {
  constructor() {
    this.transactionsSignal = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.signal)([{
      id: 'income-1',
      type: 'income',
      category: 'Salary',
      source: 'Primary job',
      amount: 3200,
      date: '2026-06-01',
      notes: 'June pay'
    }, {
      id: 'income-2',
      type: 'income',
      category: 'Freelancing',
      source: 'Consulting',
      amount: 850,
      date: '2026-06-08',
      notes: 'Client work'
    }, {
      id: 'income-3',
      type: 'income',
      category: 'Dividends',
      source: 'Investments',
      amount: 150,
      date: '2026-06-12',
      notes: 'Dividend payment'
    }, {
      id: 'expense-1',
      type: 'expense',
      category: 'Rent',
      source: 'Apartment',
      amount: 1200,
      date: '2026-06-03',
      notes: 'Monthly rent'
    }, {
      id: 'expense-2',
      type: 'expense',
      category: 'Groceries',
      source: 'Supermarket',
      amount: 320,
      date: '2026-06-05',
      notes: 'Weekly shop'
    }, {
      id: 'expense-3',
      type: 'expense',
      category: 'Utilities',
      source: 'Gas & electric',
      amount: 180,
      date: '2026-06-09',
      notes: 'Monthly utilities'
    }, {
      id: 'expense-4',
      type: 'expense',
      category: 'Internet',
      source: 'ISP',
      amount: 45,
      date: '2026-06-10',
      notes: 'Monthly internet'
    }, {
      id: 'expense-5',
      type: 'expense',
      category: 'Mobile Phone',
      source: 'Carrier',
      amount: 38,
      date: '2026-06-14',
      notes: 'Phone plan'
    }]);
    this.transactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactionsSignal());
    this.incomeTransactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactions().filter(transaction => transaction.type === 'income'));
    this.expenseTransactions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.transactions().filter(transaction => transaction.type === 'expense'));
    this.totalIncome = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.incomeTransactions().reduce((sum, transaction) => sum + transaction.amount, 0));
    this.totalExpenses = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.expenseTransactions().reduce((sum, transaction) => sum + transaction.amount, 0));
    this.balance = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => this.totalIncome() - this.totalExpenses());
    this.topExpenseCategories = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => {
      const totals = new Map();
      this.expenseTransactions().forEach(expense => {
        totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
      });
      return Array.from(totals.entries()).map(([category, amount]) => ({
        category,
        amount
      })).sort((a, b) => b.amount - a.amount).slice(0, 5);
    });
    this.monthlyCashFlow = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.computed)(() => {
      const buckets = new Map();
      this.transactions().forEach(transaction => {
        const month = new Date(transaction.date).toLocaleString('en-GB', {
          month: 'short'
        });
        const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        buckets.set(month, (buckets.get(month) ?? 0) + amount);
      });
      return Array.from(buckets.entries()).map(([month, amount]) => ({
        month,
        amount
      }));
    });
  }
  addTransaction(transaction) {
    this.transactionsSignal.update(current => [...current, transaction]);
  }
  removeTransaction(transactionId) {
    this.transactionsSignal.update(current => current.filter(transaction => transaction.id !== transactionId));
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




let AnalyticsComponent = class AnalyticsComponent {};
AnalyticsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-analytics',
  standalone: true,
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
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);






let ExpensesComponent = class ExpensesComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__.BudgetService);
    this.expenseTransactions = this.budgetService.expenseTransactions;
  }
};
ExpensesComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-expenses',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule],
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
/* harmony import */ var _core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../core/services/budget.service */ 2061);






let IncomeComponent = class IncomeComponent {
  constructor() {
    this.budgetService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_core_services_budget_service__WEBPACK_IMPORTED_MODULE_6__.BudgetService);
    this.incomeTransactions = this.budgetService.incomeTransactions;
  }
};
IncomeComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-income',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule],
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
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Analytics</h2>\r\n  <p>Review charts, trends, and category breakdowns for every GBP transaction.</p>\r\n</section>\r\n";

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
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Expenses</h2>\r\n  <p>Log costs for rent, utilities, groceries, transport, subscriptions, and savings.</p>\r\n  <table>\r\n    <thead>\r\n      <tr>\r\n        <th>Category</th>\r\n        <th>Merchant</th>\r\n        <th>Date</th>\r\n        <th>Amount</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let transaction of expenseTransactions()\">\r\n        <td>{{ transaction.category }}</td>\r\n        <td>{{ transaction.source }}</td>\r\n        <td>{{ transaction.date }}</td>\r\n        <td>{{ transaction.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</section>\r\n";

/***/ },

/***/ 8985
/*!********************************************************!*\
  !*** ./src/app/features/income/income.html?ngResource ***!
  \********************************************************/
(module) {

"use strict";
module.exports = "<section class=\"feature-page glass-card\">\r\n  <h2>Income</h2>\r\n  <p>Track salary, freelance, investments and all GBP income sources.</p>\r\n  <table>\r\n    <thead>\r\n      <tr>\r\n        <th>Source</th>\r\n        <th>Category</th>\r\n        <th>Date</th>\r\n        <th>Amount</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let transaction of incomeTransactions()\">\r\n        <td>{{ transaction.source }}</td>\r\n        <td>{{ transaction.category }}</td>\r\n        <td>{{ transaction.date }}</td>\r\n        <td>{{ transaction.amount | currency:'GBP':'symbol':'1.0-0':'en-GB' }}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</section>\r\n";

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