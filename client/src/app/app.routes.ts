import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Journeys } from './features/journeys/journeys';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'journeys', component: Journeys },
];
