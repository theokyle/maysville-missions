import { Component, inject, OnInit, signal } from '@angular/core';

import { ProgressService } from '../../journal/services/progress.service';
import { Activity } from '../../../shared/models/activity.model';

import { ActiveJourneysComponent } from '../active-journeys/active-journeys.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';
import { GroupUpdatesComponent } from '../group-updates/group-updates.component';
import { JourneyEnrollment } from '../../../shared/models/journeys.models';
import { JourneysService } from '../../journeys/services/journey-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ActiveJourneysComponent, RecentActivityComponent, GroupUpdatesComponent],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  private journeysService = inject(JourneysService);
  private progressService = inject(ProgressService);

  journeys = signal<JourneyEnrollment[]>([]);
  activities = signal<Activity[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.journeysService.getMyJourneys().subscribe({
      next: (data) => this.journeys.set(data.filter((item) => item.status === 'IN_PROGRESS')),
      error: () => {},
    });

    this.progressService.getAllSteps().subscribe({
      next: (steps) => {
        const activities = steps.flatMap((step) =>
          step.activities.map((activity) => ({
            ...activity,
            journeyTitle: step.journeyInstance.journey.title,
            journeyIcon: step.journeyInstance.journey.icon,
            journeyType: step.journeyInstance.journey.type,
            groupName: step.journeyInstance.group?.name ?? null,
            stepTitle: step.journeyStep.title,
          })),
        );

        this.activities.set(
          activities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
        );
      },
      error: (error) => {
        error.set('Unable to load recent activities.');
      },
      complete: () => this.loading.set(false),
    });
  }
}
