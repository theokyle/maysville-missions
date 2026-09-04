import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private http = inject(HttpClient);
  private baseUrl = environment.base_url;

  getUserJourneys() {
    return this.http.get(`${this.baseUrl}/me/journeys`, {});
  }
}
