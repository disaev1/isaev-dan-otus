import * as moment from 'moment';

import { Injectable, ApplicationRef } from '@angular/core';
import { of } from 'rxjs';

import { localStorageAppPrefix } from './constants';


interface Translation {
  fromLang: string,
  toLang: string,
  source: string,
  result: string,
};

interface WordTranslations {
  [lang: string]: string;
}

interface LangDict {
  [word: string]: WordTranslations;
}

export interface TranslationRecord {
  origin: string;
  added: string;
  translation: string;
}

export interface Dict {
  [fromLang: string]: TranslationRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class DictStorageService {
  dict: Dict;

  constructor(private app: ApplicationRef) {
    this.dict = this.getDict();
  }

  getDict(): Dict {
    const dictJson = localStorage.getItem(`${localStorageAppPrefix}.dict`);

    if (!dictJson) {
      return {};
    }

    return JSON.parse(dictJson);
  }

  saveDict(dict: Dict): void {
    this.dict = dict;
    localStorage.setItem(`${localStorageAppPrefix}.dict`, JSON.stringify(dict));
    this.app.tick();
  }

  save({ fromLang, toLang, source, result }: Translation) {
    if (!this.dict[fromLang]) {
      this.dict[fromLang] = [];
    }

    const targetDict = this.dict[fromLang];

    const targetRecord = targetDict.find(item => item.origin === source);

    if (!targetRecord) {
      targetDict.push({ origin: source, added: moment.utc().format(), translation: result });
    } else {
      targetRecord.added = moment.utc().format();
      targetRecord.translation = result;
    }

    this.saveDict(this.dict);

    return of({ fromLang, toLang, source, result });
  }
}
