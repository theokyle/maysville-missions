import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Group, GroupJourneyEnrollment } from '../../../shared/models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.api_url}/api/groups`;

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroup(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${groupId}`);
  }

  createGroup(data: { name: string; description?: string }): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, data);
  }

  joinGroup(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/join`, {});
  }

  leaveGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/leave`);
  }

  joinJourney(groupId: string, journeyId: string): Observable<GroupJourneyEnrollment> {
    return this.http.post<GroupJourneyEnrollment>(
      `${this.apiUrl}/${groupId}/journeys/${journeyId}/enroll`,
      {},
    );
  }
}
