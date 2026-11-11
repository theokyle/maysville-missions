import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyList } from './journey-list';

describe('JourneyList', () => {
  let component: JourneyList;
  let fixture: ComponentFixture<JourneyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyList],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
