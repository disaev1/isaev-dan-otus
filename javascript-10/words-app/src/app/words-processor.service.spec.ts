import { TestBed } from '@angular/core/testing';

import { WordsProcessorService } from './words-processor.service';

describe('WordsProcessorService', () => {
  let service: WordsProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
