import { TestBed, inject } from '@angular/core/testing';

import { SprintService } from './sprint.service';

describe('SprintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SprintService]
    });
  });

  it('should be created', inject([SprintService], (service: SprintService) => {
    expect(service).toBeTruthy();
  }));
});
