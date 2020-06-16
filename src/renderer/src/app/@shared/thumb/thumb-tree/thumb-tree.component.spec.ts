import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbTreeComponent } from './thumb-tree.component';

describe('ThumbTreeComponent', () => {
  let component: ThumbTreeComponent;
  let fixture: ComponentFixture<ThumbTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
