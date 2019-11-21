import { TestBed } from '@angular/core/testing';

import { KanbanIssuesService } from './kanban-issues.service';

describe('KanbanIssuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KanbanIssuesService = TestBed.get(KanbanIssuesService);
    expect(service).toBeTruthy();
  });
});
