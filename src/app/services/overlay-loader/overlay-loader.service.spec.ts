import { TestBed } from '@angular/core/testing';

import { OverlayLoaderService } from './overlay-loader.service';

describe('OverlayLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlayLoaderService = TestBed.get(OverlayLoaderService);
    expect(service).toBeTruthy();
  });
});
