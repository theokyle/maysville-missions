import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  Activity,
  CreateActivityPayload,
  StepProgress,
  UpdateActivityPayload,
} from '../../../shared/models/progress.models';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.api_url}/api/me/steps`;

  getAllSteps(): Observable<StepProgress[]> {
    return this.http.get<StepProgress[]>(this.apiUrl);
  }

  addActivity(stepProgressId: string, data: CreateActivityPayload): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/${stepProgressId}/activities`, data);
  }

  getActivities(stepProgressId: string): Observable<StepProgress> {
    return this.http.get<StepProgress>(`${this.apiUrl}/${stepProgressId}/activities`);
  }

  updateActivity(
    stepProgressId: string,
    activityId: string,
    data: UpdateActivityPayload,
  ): Observable<Activity> {
    return this.http.patch<Activity>(
      `${this.apiUrl}/${stepProgressId}/activities/${activityId}`,
      data,
    );
  }

  deleteActivity(stepProgressId: string, activityId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/${stepProgressId}/activities/${activityId}`,
    );
  }
}
