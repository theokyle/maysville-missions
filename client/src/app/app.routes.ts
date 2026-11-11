import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },

  // Protected application routes
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent,
          ),
      },
      {
        path: 'journeys',
        loadChildren: () =>
          import('./features/journeys/journeys.routes').then((m) => m.JOURNEY_ROUTES),
      },
      {
        path: 'my-journeys',
        loadComponent: () =>
          import('./features/journeys/pages/my-journeys/my-journeys').then(
            (m) => m.MyJourneysPageComponent,
          ),
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./features/journal/pages/journal-page/journal-page.component').then(
            (m) => m.JournalPageComponent,
          ),
      },
      {
        path: 'groups',
        loadChildren: () => import('./features/groups/groups.routes').then((m) => m.GROUPS_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-page/profile-page.component').then(
            (m) => m.ProfilePageComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
