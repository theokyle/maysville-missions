import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupsService } from '../../services/groups.service';
import { AccountService } from '../../../../core/services/account.service';

import { Group, GroupJourneyEnrollment } from '../../../../shared/models/group.model';

import { Journey } from '../../../../shared/models/journeys.models';

import { GroupMemberListComponent } from '../../components/group-member-list/group-member-list.component';
import { GroupJourneyListComponent } from '../../components/group-journey-list/group-journey-list.component';
import { GroupJoinButtonComponent } from '../../components/group-join-button/group-join-button.component';
import { JourneysService } from '../../../journeys/services/journey-service';

@Component({
  selector: 'app-group-detail-page',
  standalone: true,
  imports: [GroupMemberListComponent, GroupJourneyListComponent, GroupJoinButtonComponent],
  templateUrl: './group-detail-page.component.html',
})
export class GroupDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);
  private journeysService = inject(JourneysService);
  private account = inject(AccountService);

  group = signal<Group | null>(null);
  journeys = signal<GroupJourneyEnrollment[]>([]);
  allJourneys = signal<Journey[]>([]);

  isMember = signal(false);
  loading = signal(true);

  availableJourneys = computed(() => {
    const startedJourneyIds = new Set(this.journeys().map((enrollment) => enrollment.journeyId));

    return this.allJourneys().filter((journey) => {
      const isGroupJourney = journey.type === 'GROUP';
      const alreadyStarted = startedJourneyIds.has(journey.id);

      return isGroupJourney && !alreadyStarted;
    });
  });

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('id');

    if (!groupId) {
      this.loading.set(false);
      return;
    }

    this.loadGroup(groupId);
  }

  loadGroup(groupId: string): void {
    this.loading.set(true);

    this.groupsService.getGroup(groupId).subscribe({
      next: (group) => {
        this.group.set(group);
        this.journeys.set(group.journeyInstances ?? []);

        this.isMember.set(
          !!group.members?.some((member) => member.userId === this.account.user()?.id),
        );

        if (this.isMember()) {
          this.loadAvailableJourneys();
        } else {
          this.allJourneys.set([]);
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadAvailableJourneys(): void {
    this.journeysService.getJourneys().subscribe({
      next: (journeys) => {
        this.allJourneys.set(journeys);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onMembershipChange(isMember: boolean): void {
    const groupId = this.group()?.id;
    if (!groupId) return;

    this.isMember.set(isMember);
    this.loadGroup(groupId);
  }

  onJourneyJoined(journeyId: string): void {
    const groupId = this.group()?.id;
    if (!groupId) return;

    this.groupsService.joinJourney(groupId, journeyId).subscribe({
      next: () => this.loadGroup(groupId),
      error: () => {
        // Set an error signal or display a notification.
      },
    });
  }
}
