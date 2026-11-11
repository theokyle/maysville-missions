import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  JourneyMessage,
  CreateJourneyMessageDto,
  CreateJourneyReplyDto,
  UpdateJourneyMessageDto,
} from '../../../shared/models/journey-message.model';

@Injectable({ providedIn: 'root' })
export class JourneyMessagesService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.api_url}/api/journey-messages`;

  getMessages(journeyInstanceId: string, journeyStepId?: string): Observable<JourneyMessage[]> {
    let params = new HttpParams();

    if (journeyStepId) {
      params = params.set('journeyStepId', journeyStepId);
    }

    return this.http.get<JourneyMessage[]>(`${this.apiUrl}/${journeyInstanceId}`, { params });
  }

  createMessage(
    journeyInstanceId: string,
    dto: CreateJourneyMessageDto,
  ): Observable<JourneyMessage> {
    return this.http.post<JourneyMessage>(`${this.apiUrl}/${journeyInstanceId}`, dto);
  }

  createReply(messageId: string, dto: CreateJourneyReplyDto): Observable<JourneyMessage> {
    return this.http.post<JourneyMessage>(`${this.apiUrl}/${messageId}/replies`, dto);
  }

  updateMessage(messageId: string, dto: UpdateJourneyMessageDto): Observable<JourneyMessage> {
    return this.http.patch<JourneyMessage>(`${this.apiUrl}/${messageId}`, dto);
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}
