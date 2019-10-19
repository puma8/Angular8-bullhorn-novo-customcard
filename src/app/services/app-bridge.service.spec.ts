import { TestBed } from '@angular/core/testing';

import { AppBridgeService } from './app-bridge.service';

describe('AppBridgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppBridgeService = TestBed.get(AppBridgeService);
    expect(service).toBeTruthy();
  });
});
