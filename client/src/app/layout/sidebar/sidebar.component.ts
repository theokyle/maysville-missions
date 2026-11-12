import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isMobile = input(false);
  navigate = output<void>();

  dashboardLink = { label: 'Dashboard', path: '/dashboard' };

  navigationGroups = [
    {
      label: 'Discover',
      links: [
        { label: 'Explore Journeys', path: '/journeys' },
        { label: 'Groups', path: '/groups' },
      ],
    },
    {
      label: 'Practice',
      links: [
        { label: 'My Journeys', path: '/my-journeys' },
        { label: 'My Journal', path: '/journal' },
      ],
    },
    {
      label: 'Account',
      links: [{ label: 'Profile', path: '/profile' }],
    },
  ];
}
