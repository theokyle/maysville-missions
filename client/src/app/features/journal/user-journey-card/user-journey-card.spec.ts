import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourneyCard } from './user-journey-card';

describe('UserJourneyCard', () => {
  let component: UserJourneyCard;
  let fixture: ComponentFixture<UserJourneyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourneyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserJourneyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
