import { TestBed } from '@angular/core/testing';

import { MealPrepDBService } from './fav-db.service';

describe('MealPrepDBService', () => {
  let service: MealPrepDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealPrepDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
