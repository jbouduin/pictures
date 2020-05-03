import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbListComponent } from './thumb-list.component';

describe('ThumbListComponent', () => {
  let component: ThumbListComponent;
  let fixture: ComponentFixture<ThumbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
