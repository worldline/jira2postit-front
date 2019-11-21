import { TestBed, inject } from '@angular/core/testing';

import { ScrumIssuesService } from './scrum-issues.service';

describe('ScrumIssuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrumIssuesService]
    });
  });

  it('should be created', inject([ScrumIssuesService], (service: ScrumIssuesService) => {
    expect(service).toBeTruthy();
  }));
});
