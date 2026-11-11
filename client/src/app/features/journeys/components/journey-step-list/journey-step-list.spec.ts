import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyStepList } from './journey-step-list';

describe('JourneyStepList', () => {
  let component: JourneyStepList;
  let fixture: ComponentFixture<JourneyStepList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyStepList],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyStepList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
