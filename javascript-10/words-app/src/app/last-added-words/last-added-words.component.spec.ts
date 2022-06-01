import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastAddedWordsComponent } from './last-added-words.component';

describe('LastAddedWordsComponent', () => {
  let component: LastAddedWordsComponent;
  let fixture: ComponentFixture<LastAddedWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastAddedWordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastAddedWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
