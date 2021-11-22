import { Injectable } from '@angular/core';
import _ from 'lodash';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DictStorageService } from './dict-storage.service';
import { TranslatorService } from './translator.service';

interface Translation {
  source: string;
  result: string;
  fromLang: string;
  toLang: string;
}

interface TranslationError {
  error: Error;
}

@Injectable({
  providedIn: 'root'
})
export class WordsProcessorService {
  constructor(private translator: TranslatorService, private dictStorage: DictStorageService) {
  }

  process(text: string) {
    const words = _.uniq(_.compact(text.split(/[\s\.\,\-:;\(\)]/)));

    const wordsPipeline = from(words)
      .pipe(
        mergeMap(word => this.translator.translate(word as string, 'en', 'ru')),
        mergeMap(translation => {
          if ((translation as TranslationError).error) {
            throw new Error('Ошибка перевода');
          }

          return this.dictStorage.save(translation as Translation);
        }),
      );

    return wordsPipeline;
  }
}
