import moment from 'moment';
import _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { DictStorageService } from '../dict-storage.service';
import { SettingsService } from '../settings.service';
import type { Settings } from '../settings.service';
import { WordsProcessorService } from '../words-processor.service';

interface TranslationRecord {
  origin: string;
  added: string;
  translation: string;
}

interface WordsByDate {
  [date: string]: TranslationRecord[];
}

interface WordsByDateArrayRecord {
  date: string;
  items: TranslationRecord[];
}

@Component({
  selector: 'app-last-added-words',
  templateUrl: './last-added-words.component.html',
  styleUrls: ['./last-added-words.component.scss']
})
export class LastAddedWordsComponent implements OnInit {
  settings: Settings;

  words = '';
  status = '';

  get lastAddedWords(): WordsByDateArrayRecord[] {
    const dict = this.dictStorage.dict;
    const targetDict = dict[this.settings.fromLang] || [];
    
    let acc: WordsByDate = {};

    targetDict.forEach(record => {
      const date = moment(record.added).format('DD.MM.YYYY');

      if (!acc[date]) {
        acc[date] = [record];
      } else {
        acc[date].push(record);
      }
    });

    const result: WordsByDateArrayRecord[] =
      _.sortBy(
        _.map(acc, (wordsByDate: TranslationRecord[], date: string): WordsByDateArrayRecord => ({ date, items: wordsByDate })),
        (record: WordsByDateArrayRecord) => record.date
      );

    result.reverse();

    return result;
  }

  constructor(
    private wordsProcessor: WordsProcessorService,
    private dictStorage: DictStorageService,
    private settingsService: SettingsService,
  ) {
    this.settings = this.settingsService.getSettings();
  }

  ngOnInit(): void {
  }

  async translate() {
    this.status = 'Переводим...';

    this.wordsProcessor.process(this.words).subscribe(
      () => {},
      () => { this.status = 'Ошибка!'; },
      () => {
        this.status = '';
        this.words = '';
      },
    );
  }
}
