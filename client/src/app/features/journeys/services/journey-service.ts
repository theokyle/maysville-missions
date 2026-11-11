import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Journey, JourneyEnrollment } from '../../../shared/models/journeys.models';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JourneysService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.api_url}/api`;

  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.apiUrl}/journeys`);
  }

  getJourney(id: string): Observable<Journey> {
    return this.http.get<Journey>(`${this.apiUrl}/journeys/${id}`);
  }

  getMyJourneys(): Observable<JourneyEnrollment[]> {
    return this.http.get<JourneyEnrollment[]>(`${this.apiUrl}/me/journeys`);
  }

  getMyGroupJourneys(): Observable<JourneyEnrollment[]> {
    return this.http.get<JourneyEnrollment[]>(`${this.apiUrl}/me/group-journeys`);
  }

  enroll(journeyId: string): Observable<JourneyEnrollment> {
    return this.http.post<JourneyEnrollment>(`${this.apiUrl}/journeys/${journeyId}/enroll`, {});
  }

  unenroll(journeyId: string) {
    return this.http.delete(`${this.apiUrl}/me/journeys/${journeyId}`);
  }
}
