import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JournalService } from './journal-service';
import { Activity, JourneyInstance } from '../../types/journey';
import { UserJourneyCard } from './user-journey-card/user-journey-card';
import { ActivityLog } from './activity-log/activity-log';

@Component({
  selector: 'app-journeys',
  imports: [UserJourneyCard, ActivityLog],
  templateUrl: './journal.html',
})
export class Journal implements OnInit {
  private journalService = inject(JournalService);

  protected userJourneys = signal<JourneyInstance[]>([]);

  // Activity drawer state
  protected showActivityDrawer = signal(false);
  protected selectedActivity = signal<Activity | null>(null);

  ngOnInit() {
    this.loadJourneys();
  }

  private loadJourneys() {
    this.journalService.getUserJourneys().subscribe({
      next: (result) => {
        this.userJourneys.set(result);
      },
      error: (error) => {
        console.error('Failed to load journeys:', error);
      },
    });
  }

  // Open drawer to create a new activity
  protected openNewActivity() {
    this.selectedActivity.set(null);
    this.showActivityDrawer.set(true);
  }

  // Open drawer to view an existing activity
  protected openExistingActivity(activity: Activity) {
    this.selectedActivity.set(activity);
    this.showActivityDrawer.set(true);
  }

  // Close drawer
  protected closeActivityDrawer() {
    this.showActivityDrawer.set(false);
    this.selectedActivity.set(null);
  }

  // Refresh journey data after an activity is saved
  protected onActivitySaved() {
    this.closeActivityDrawer();
    this.loadJourneys();
  }

  enroll(journeyId: string) {}

  protected currentPage = signal(0);
  protected pageSize = 3;

  protected totalPages = computed(() => Math.ceil(this.userJourneys().length / this.pageSize));

  protected pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  protected visibleJourneys = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.userJourneys().slice(start, start + this.pageSize);
  });

  protected previousPage() {
    this.currentPage.update((page) => Math.max(0, page - 1));
  }

  protected nextPage() {
    this.currentPage.update((page) => Math.min(this.totalPages() - 1, page + 1));
  }

  protected goToPage(page: number) {
    this.currentPage.set(Math.max(0, Math.min(page, this.totalPages() - 1)));
  }

  updateJourneyStatus(event: { journeyId: string; status: 'ABANDONED' | 'IN_PROGRESS' }) {
    this.userJourneys.update((journeys) =>
      journeys.map((journey) =>
        journey.journeyId === event.journeyId ? { ...journey, status: event.status } : journey,
      ),
    );
  }
}
