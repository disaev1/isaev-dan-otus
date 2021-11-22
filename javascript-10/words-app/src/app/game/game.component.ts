import { Component, OnInit } from '@angular/core';

import { DictStorageService } from '../dict-storage.service';
import type { Dict, TranslationRecord } from '../dict-storage.service';
import { SettingsService } from '../settings.service';
import type { Settings } from '../settings.service';
import _ from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  dict: Dict;
  wordsList: TranslationRecord[];
  settings: Settings;
  remaining: number | null = null;
  timer: number | null;
  curEntry: TranslationRecord | null = null;
  right: number = 0;
  wrong: number = 0;
  enteredTranslation: string = '';
  currentWordsList: TranslationRecord[];

  constructor(private dictStorageService: DictStorageService, private settingsService: SettingsService) {
    this.settings = this.settingsService.getSettings();
    const dict: Dict = this.dictStorageService.getDict();
    this.wordsList = dict[this.settings.fromLang] || [];
  }

  ngOnInit(): void {
  }

  public start() {
    this.currentWordsList = this.wordsList.slice();
    let prevNow: number = performance.now();
    let curTime: number = this.settings.gameDuration * 1000;
    this.remaining = Math.floor(curTime / 1000);
    this.right = 0;
    this.wrong = 0;
    this.enteredTranslation = '';

    this.timer = window.setInterval(() => {
      let currentNow: number = performance.now();
      const dt = currentNow - prevNow;
      prevNow = currentNow;
      curTime -= dt;
      this.remaining = Math.floor(curTime / 1000);

      if (curTime < 0) {
        window.clearInterval(this.timer);
        this.remaining = null;
      }
    }, 100);

    this.nextEntry();
    console.log('curWord', this.curEntry);
  }

  public stop() {
    console.log('Правильно:', this.right, ', неправильно:', this.wrong);
    window.clearInterval(this.timer);
    this.remaining = null;
  }

  public handleTranslationEnter(e: KeyboardEvent) {
    console.log('handleTranslationEnter', e);
    if (e.code === 'Enter') {
      const translation = (e.target as HTMLInputElement).value;
      
      if (translation === this.curEntry.translation) {
        this.right++;
      } else {
        this.wrong++;
      }

      this.enteredTranslation = '';
      this.nextEntry();
    }
  }

  private nextEntry() {
    this.curEntry = this.currentWordsList.splice(_.random(this.currentWordsList.length - 1), 1)[0];
    
    if (!this.curEntry) {
      this.stop();
    }
  }

}
