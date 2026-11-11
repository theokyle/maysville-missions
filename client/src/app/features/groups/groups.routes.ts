import { Routes } from '@angular/router';

import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { GroupDetailPageComponent } from './pages/group-detail-page/group-detail-page.component';
import { GroupJourneyDetailPageComponent } from '../group-journeys/pages/group-journey-detail-page/group-journey-detail-page.component';

export const GROUPS_ROUTES: Routes = [
  {
    path: '',
    component: GroupsPageComponent,
  },
  {
    path: ':id',
    component: GroupDetailPageComponent,
  },
  {
    path: ':groupId/journeys/:journeyId',
    component: GroupJourneyDetailPageComponent,
  },
];
