import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JournalService } from './journal-service';
import { JourneyInstance } from '../../types/journey';
import { UserJourneyCard } from './user-journey-card/user-journey-card';

@Component({
  selector: 'app-journeys',
  imports: [UserJourneyCard],
  templateUrl: './journal.html',
})
export class Journal implements OnInit {
  private journalService = inject(JournalService);
  protected userJourneys = signal<JourneyInstance[]>([]);

  ngOnInit() {
    this.journalService.getUserJourneys().subscribe((result) => {
      this.userJourneys.set(result);
    });
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
