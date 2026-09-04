import { Component, input } from '@angular/core';
import { Journey } from '../../../types/journey';

@Component({
  selector: 'app-user-journey-card',
  imports: [],
  templateUrl: './user-journey-card.html',
  styleUrl: './user-journey-card.css',
})
export class UserJourneyCard {
  protected journey = input<Journey>();
}
