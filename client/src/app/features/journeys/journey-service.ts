import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Journey } from '../../types/journey';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private http = inject(HttpClient);

  getJourneys() {
    return this.http.get<Journey[]>('http://localhost:3000/journeys');
  }
}
