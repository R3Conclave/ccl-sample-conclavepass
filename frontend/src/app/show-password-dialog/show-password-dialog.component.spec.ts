import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPasswordDialogComponent } from './show-password-dialog.component';

describe('ShowPasswordDialogComponent', () => {
  let component: ShowPasswordDialogComponent;
  let fixture: ComponentFixture<ShowPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
