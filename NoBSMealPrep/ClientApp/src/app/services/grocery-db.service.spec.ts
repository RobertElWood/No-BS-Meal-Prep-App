import { TestBed } from '@angular/core/testing';

import { GroceryDbService } from './grocery-db.service';

describe('GroceryDbService', () => {
  let service: GroceryDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
