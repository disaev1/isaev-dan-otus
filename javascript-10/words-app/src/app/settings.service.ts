import { ApplicationRef, Injectable } from '@angular/core';

import { localStorageAppPrefix } from './constants';

export interface Settings {
  fromLang: string;
  toLang: string;
  gameDuration: number;
  gameWordsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings = {};

  constructor(private app: ApplicationRef) {
    this.settings = this.getSettings();
  }

  public save(newSettings: Settings) {
    this.settings = newSettings;
    localStorage.setItem(`${localStorageAppPrefix}.settings`, JSON.stringify(newSettings));
    this.app.tick();
  }

  public getSettings(): Settings {
    const settingsJson = localStorage.getItem(`${localStorageAppPrefix}.settings`);

    if (!settingsJson) {
      return { fromLang: 'en', toLang: 'ru', gameDuration: 120, gameWordsCount: 20 };
    }

    return JSON.parse(settingsJson);
  }
}
