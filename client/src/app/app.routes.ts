import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { Journeys } from './features/journeys/journeys';
import { Dashboard } from './features/dashboard/dashboard';
import { Journal } from './features/journal/journal';
import { Register } from './core/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'journeys', component: Journeys },
  { path: 'dashboard', component: Dashboard },
  { path: 'journal', component: Journal },
];
