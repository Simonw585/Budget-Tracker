import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { NavbarComponent } from './app/layout/navbar/navbar';
import { SidebarComponent } from './app/layout/sidebar/sidebar';
import { appRoutes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
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
  styleUrls: ['./styles.scss']
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes)]
});
