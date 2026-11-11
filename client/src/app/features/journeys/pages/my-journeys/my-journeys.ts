import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  Activity,
  JourneyEnrollment,
  JourneyStepProgress,
} from '../../../../shared/models/journeys.models';

import { JourneysService } from '../../services/journey-service';
import { UserJourneyCardComponent } from '../../components/user-journey-card/user-journey-card';
import { ActivityLog } from '../../components/activity-log/activity-log';

type JourneyView = 'individual' | 'group';

@Component({
  selector: 'app-my-journeys',
  standalone: true,
  imports: [UserJourneyCardComponent, ActivityLog, RouterLink],
  templateUrl: './my-journeys.html',
})
export class MyJourneysPageComponent implements OnInit {
  private journeysService = inject(JourneysService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  individualJourneys = signal<JourneyEnrollment[]>([]);
  groupJourneys = signal<JourneyEnrollment[]>([]);

  selectedView = signal<JourneyView>('individual');

  displayedJourneys = computed(() =>
    this.selectedView() === 'individual' ? this.individualJourneys() : this.groupJourneys(),
  );

  loading = signal(true);
  error = signal<string | null>(null);

  showActivityLog = signal(false);
  selectedStep = signal<JourneyStepProgress | null>(null);
  selectedActivity = signal<Activity | null>(null);

  ngOnInit(): void {
    this.loadJourneys();

    const view = this.route.snapshot.queryParamMap.get('view');

    if (view === 'group' || view === 'individual') {
      this.selectedView.set(view);
    }

    this.loadJourneys();
  }

  loadJourneys(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      individual: this.journeysService.getMyJourneys(),
      group: this.journeysService.getMyGroupJourneys(),
    }).subscribe({
      next: ({ individual, group }) => {
        this.individualJourneys.set(individual);
        this.groupJourneys.set(group);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Unable to load journeys:', err);
        this.error.set('Unable to load your journeys.');
        this.loading.set(false);
      },
    });
  }

  setView(view: JourneyView): void {
    this.selectedView.set(view);
  }

  openActivityForm(step: JourneyStepProgress): void {
    this.selectedActivity.set(null);
    this.selectedStep.set(step);
    this.showActivityLog.set(true);
  }

  viewActivity(activity: Activity): void {
    this.selectedStep.set(null);
    this.selectedActivity.set(activity);
    this.showActivityLog.set(true);
  }

  closeActivityLog(): void {
    this.showActivityLog.set(false);
    this.selectedStep.set(null);
    this.selectedActivity.set(null);
  }

  onActivitySaved(): void {
    this.closeActivityLog();
    this.loadJourneys();
  }

  onJourneyUpdated(): void {
    this.loadJourneys();
  }

  unenrollJourney(journeyId: string): void {
    this.journeysService.unenroll(journeyId).subscribe({
      next: () => this.loadJourneys(),
      error: (err) => {
        console.error('Unable to leave journey:', err);
        this.error.set('Unable to leave this journey. Please try again.');
      },
    });
  }
}
