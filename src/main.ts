import { bootstrapApplication } from '@angular/platform-browser';
import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './app/layout/navbar/navbar';
import { appRoutes } from './app/app.routes';

// App entry point: boots the Angular shell and sets up routing + HTTP access.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <main class="page-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./styles.scss']
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes), importProvidersFrom(HttpClientModule)]
});
