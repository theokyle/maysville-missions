import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyProgress } from './journey-progress';

describe('JourneyProgress', () => {
  let component: JourneyProgress;
  let fixture: ComponentFixture<JourneyProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
