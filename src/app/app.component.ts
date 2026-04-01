/* File: C:\Users\si.white\budget-tracker\src\app\app.component.ts
   Description: Root component. Bootstraps the full app UI and host for routed pages.
*/

import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { TransactionListComponent } from './components/add-transaction/transaction-list/transaction-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BrowserModule, AddTransactionComponent, TransactionListComponent],
  template: `
    <div class="main-container">
      <h1>Budget Tracker</h1>
      <app-add-transaction></app-add-transaction>
      <app-transaction-list></app-transaction-list>
    </div>
  `
})
export class AppComponent {}
