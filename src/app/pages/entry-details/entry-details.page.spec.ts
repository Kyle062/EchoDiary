import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryDetailsPage } from './entry-details.page';

describe('EntryDetailsPage', () => {
  let component: EntryDetailsPage;
  let fixture: ComponentFixture<EntryDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
