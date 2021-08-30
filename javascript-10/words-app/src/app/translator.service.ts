import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

import _ from 'lodash';

const TRANSLATION_API = 'https://api.mymemory.translated.net/get';

interface TranslationApiResponseData {
  translatedText: string;
}

interface TranslationApiResponse {
  responseData: TranslationApiResponseData;
  responseStatus: number;
}

interface Translation {
  source: string,
  result: string,
  fromLang: string,
  toLang: string,
}

interface TranslationError {
  error: Error;
}

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  constructor() {
    
  }

  translate(key: string, fromLang: string, toLang: string): Observable<Translation | TranslationError> {
    const url = new URL(TRANSLATION_API);

    url.searchParams.set('q', key);
    url.searchParams.set('langpair', `${fromLang}|${toLang}`);
    
    return ajax.getJSON<TranslationApiResponse>(url.toString())
      .pipe(
        map((res: TranslationApiResponse) => {
          if (res.responseStatus !== 200) {
            throw new Error('Error response ' + JSON.stringify(res.responseStatus));
          }

          return { source: key, result: res.responseData.translatedText, fromLang, toLang };
        }),
      );
  }
}
