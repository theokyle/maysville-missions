import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JourneyEnrollment } from '../../../shared/models/journeys.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-active-journeys',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './active-journeys.component.html',
})
export class ActiveJourneysComponent {
  journeys = input<JourneyEnrollment[]>([]);
}
