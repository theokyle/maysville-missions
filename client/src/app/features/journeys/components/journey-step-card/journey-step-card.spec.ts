import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyStepCard } from './journey-step-card';

describe('JourneyStepCard', () => {
  let component: JourneyStepCard;
  let fixture: ComponentFixture<JourneyStepCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyStepCard],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyStepCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
