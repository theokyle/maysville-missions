import { Component, inject, OnInit, signal } from '@angular/core';

import { GroupsService } from '../../services/groups.service';
import { Group } from '../../../../shared/models/group.model';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [GroupCardComponent],
  templateUrl: './groups-page.component.html',
})
export class GroupsPageComponent implements OnInit {
  private groupsService = inject(GroupsService);

  groups = signal<Group[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.groupsService.getGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load groups.');
        this.loading.set(false);
      },
    });
  }
}
