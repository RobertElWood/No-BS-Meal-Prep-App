import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesViewComponent } from './favorites-view.component';

describe('FavoritesViewComponent', () => {
  let component: FavoritesViewComponent;
  let fixture: ComponentFixture<FavoritesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
