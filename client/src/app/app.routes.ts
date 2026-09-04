import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Journeys } from './features/journeys/journeys';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'journeys', component: Journeys },
  { path: 'dashboard', component: Dashboard },
];
