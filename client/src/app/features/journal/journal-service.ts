import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { JourneyInstance } from '../../types/journey';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private http = inject(HttpClient);
  private baseUrl = environment.base_url;

  getUserJourneys(): Observable<JourneyInstance[]> {
    return this.http.get<JourneyInstance[]>(`${this.baseUrl}/me/journeys`, {});
  }
}
