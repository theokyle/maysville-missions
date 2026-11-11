import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyEnrollmentButton } from './journey-enrollment-button';

describe('JourneyEnrollmentButton', () => {
  let component: JourneyEnrollmentButton;
  let fixture: ComponentFixture<JourneyEnrollmentButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyEnrollmentButton],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyEnrollmentButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
