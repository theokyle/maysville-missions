import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupsService } from '../../../groups/services/groups.service';
import { JourneyMessagesService } from '../../services/journey-messages.service';
import { AccountService } from '../../../../core/services/account.service';

import { GroupJourneyEnrollment } from '../../../../shared/models/group.model';
import {
  JourneyMessage,
  CreateJourneyMessageDto,
  CreateJourneyReplyDto,
} from '../../../../shared/models/journey-message.model';

import { GroupJourneyHeaderComponent } from '../../components/group-journey-header/group-journey-header.component';
import { JourneyDiscussionComponent } from '../../components/journey-discussion/journey-discussion.component';
import { JourneyVideoComponent } from '../../../journeys/components/journey-video/journey-video';

@Component({
  selector: 'app-group-journey-detail-page',
  imports: [GroupJourneyHeaderComponent, JourneyDiscussionComponent, JourneyVideoComponent],
  templateUrl: './group-journey-detail-page.component.html',
})
export class GroupJourneyDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);
  private messagesService = inject(JourneyMessagesService);
  private account = inject(AccountService);

  enrollment = signal<GroupJourneyEnrollment | null>(null);
  messages = signal<JourneyMessage[]>([]);
  loading = signal(true);

  currentUserId = () => this.account.user()?.id ?? '';

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    const journeyId = this.route.snapshot.paramMap.get('journeyId');

    if (!groupId || !journeyId) {
      this.loading.set(false);
      return;
    }

    this.loadGroupJourney(groupId, journeyId);
  }

  private loadGroupJourney(groupId: string, journeyId: string): void {
    // The group detail endpoint must return its journey enrollments.
    this.groupsService.getGroup(groupId).subscribe({
      next: (group) => {
        const enrollment = group.journeyInstances?.find((item) => item.journeyId === journeyId);

        if (!enrollment) {
          this.loading.set(false);
          return;
        }

        this.enrollment.set(enrollment);
        this.loadMessages(enrollment.id);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadMessages(instanceId: string): void {
    this.messagesService.getMessages(instanceId).subscribe({
      next: (messages) => this.messages.set(messages),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  createMessage(dto: CreateJourneyMessageDto): void {
    const instanceId = this.enrollment()?.id;
    if (!instanceId) return;

    this.messagesService.createMessage(instanceId, dto).subscribe({
      next: (message) => {
        this.messages.update((items) => [...items, message]);
      },
    });
  }

  createReply(event: { messageId: string; dto: CreateJourneyReplyDto }): void {
    this.messagesService.createReply(event.messageId, event.dto).subscribe({
      next: (reply) => {
        this.messages.update((items) =>
          items.map((message) =>
            message.id === event.messageId
              ? {
                  ...message,
                  replies: [...(message.replies ?? []), reply],
                }
              : message,
          ),
        );
      },
    });
  }

  editMessage(message: JourneyMessage): void {
    const content = prompt('Edit your message', message.content);
    if (!content?.trim()) return;

    this.messagesService
      .updateMessage(message.id, {
        content: content.trim(),
      })
      .subscribe({
        next: (updated) => {
          this.messages.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
        },
      });
  }

  deleteMessage(message: JourneyMessage): void {
    if (!confirm('Delete this message?')) return;

    this.messagesService.deleteMessage(message.id).subscribe({
      next: () => {
        this.messages.update((items) => items.filter((item) => item.id !== message.id));
      },
    });
  }
}
