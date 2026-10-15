import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { JourneyInstance } from '../../types/journey';
import { CreateActivityDto, UpdateActivityDto, Activity } from '../../types/journey';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private http = inject(HttpClient);
  private baseUrl = environment.api_url;

  getUserJourneys(): Observable<JourneyInstance[]> {
    return this.http.get<JourneyInstance[]>(`${this.baseUrl}/me/journeys`, {});
  }

  addActivity(stepProgressId: string, activity: CreateActivityDto) {
    return this.http.post<Activity>(
      `${this.baseUrl}/me/steps/${stepProgressId}/activities`,
      activity,
    );
  }

  updateActivity(stepProgressId: string, activityId: string, activity: UpdateActivityDto) {
    return this.http.patch<Activity>(
      `${this.baseUrl}/me/steps/${stepProgressId}/activities/${activityId}`,
      activity,
    );
  }

  deleteActivity(stepProgressId: string, activityId: string) {
    return this.http.delete<{ success: boolean }>(
      `${this.baseUrl}/me/steps/${stepProgressId}/activities/${activityId}`,
    );
  }
}
