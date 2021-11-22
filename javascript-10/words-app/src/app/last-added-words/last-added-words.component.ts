import * as moment from 'moment';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { DictStorageService } from '../dict-storage.service';

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
  // lastAddedWords = [
  //   {
  //     date: '2021-04-01',
  //     items: [
  //       {
  //         origin: 'to wash',
  //         translation: 'мыть',
  //       },
  //       {
  //         origin: 'people',
  //         translation: 'люди',
  //       },
  //       {
  //         origin: 'ball',
  //         translation: 'мяч',
  //       },
  //     ],
  //   },
  //   {
  //     date: '2021-03-31',
  //     items: [
  //       {
  //         origin: 'to roar',
  //         translation: 'рычать',
  //       },
  //       {
  //         origin: 'to cancel',
  //         translation: 'отменять',
  //       },
  //       {
  //         origin: 'to persuade',
  //         translation: 'настаивать',
  //       },
  //     ],
  //   }
  // ];
  settings = {
    fromLang: 'en',
  };

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

  constructor(public dictStorage: DictStorageService) { }

  ngOnInit(): void {
  }

}
