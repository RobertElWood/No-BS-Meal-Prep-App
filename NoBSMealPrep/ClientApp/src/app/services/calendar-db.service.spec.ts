import { TestBed } from '@angular/core/testing';

import { CalendarDbService } from './calendar-db.service';

describe('CalendarDbService', () => {
  let service: CalendarDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
