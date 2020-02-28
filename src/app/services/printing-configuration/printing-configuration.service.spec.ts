import { TestBed } from '@angular/core/testing'

import { PrintingConfigurationService } from './printing-configuration.service'

describe('PrintingConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: PrintingConfigurationService = TestBed.get(PrintingConfigurationService)
    expect(service).toBeTruthy()
  })
})
