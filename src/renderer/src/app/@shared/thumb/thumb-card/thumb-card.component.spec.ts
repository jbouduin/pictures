import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbCardComponent } from './thumb-card.component';

describe('ThumbCardComponent', () => {
  let component: ThumbCardComponent;
  let fixture: ComponentFixture<ThumbCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
