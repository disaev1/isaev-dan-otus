import { Injectable, ApplicationRef } from '@angular/core';
import { of } from 'rxjs';

const localStorageAppPrefix = 'wordsAppOtus';

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

interface Dict {
  [fromLang: string]: LangDict;
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
      this.dict[fromLang] = {};
    }

    const targetDict = this.dict[fromLang];

    if (!targetDict[source]) {
      targetDict[source] = { [toLang]: result };
    } else {
      targetDict[source][toLang] = result;
    }

    this.saveDict(this.dict);

    return of({ fromLang, toLang, source, result });
  }
}
