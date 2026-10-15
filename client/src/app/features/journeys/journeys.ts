import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JourneyService } from './journey-service';
import { Journey } from '../../types/journey';
import { JourneyCard } from './journey-card/journey-card';

@Component({
  selector: 'app-journeys',
  imports: [JourneyCard],
  templateUrl: './journeys.html',
})
export class Journeys implements OnInit {
  private journeyService = inject(JourneyService);
  protected journeys = signal<Journey[]>([]);

  ngOnInit() {
    this.journeyService.getJourneys().subscribe((result) => {
      this.journeys.set(result);
    });
  }

  enroll(journeyId: string) {}

  protected currentPage = signal(0);
  protected pageSize = 3;

  protected totalPages = computed(() => Math.ceil(this.journeys().length / this.pageSize));

  protected pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  protected visibleJourneys = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.journeys().slice(start, start + this.pageSize);
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
}
