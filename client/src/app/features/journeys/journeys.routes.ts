import { Routes } from '@angular/router';

import { DiscoverJourneysPageComponent } from './pages/discover-journeys/discover-journeys';
import { JourneyDetailPageComponent } from './pages/journey-detail/journey-detail';

export const JOURNEY_ROUTES: Routes = [
  {
    path: '',
    component: DiscoverJourneysPageComponent,
  },
  {
    path: ':id',
    component: JourneyDetailPageComponent,
  },
];
