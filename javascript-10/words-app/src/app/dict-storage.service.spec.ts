import { TestBed } from '@angular/core/testing';

import { DictStorageService } from './dict-storage.service';

describe('DictStorageService', () => {
  let service: DictStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
