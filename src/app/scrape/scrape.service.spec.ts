import { TestBed } from '@angular/core/testing';

import { ScrapeService } from './scrape.service';

describe('ScrapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrapeService = TestBed.get(ScrapeService);
    expect(service).toBeTruthy();
  });
});
