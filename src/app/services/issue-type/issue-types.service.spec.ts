import { TestBed } from '@angular/core/testing'

import { IssueTypesService } from './issue-types.service'

describe('IssueTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: IssueTypesService = TestBed.get(IssueTypesService)
    expect(service).toBeTruthy()
  })
})
