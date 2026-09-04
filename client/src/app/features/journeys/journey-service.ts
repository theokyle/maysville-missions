import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Journey } from '../../../types/journey';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private http = inject(HttpClient);
  private baseUrl = environment.base_url;

  getJourneys() {
    return this.http.get<Journey[]>(this.baseUrl + '/journeys');
  }

  enroll(journeyId: string) {
    return this.http.post(`${this.baseUrl}/journeys/${journeyId}/enroll`, {});
  }
}
