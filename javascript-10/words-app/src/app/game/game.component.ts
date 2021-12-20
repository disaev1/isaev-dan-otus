import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DictStorageService } from '../dict-storage.service';
import type { Dict, TranslationRecord } from '../dict-storage.service';

import { SettingsService } from '../settings.service';
import type { Settings } from '../settings.service';
import _ from 'lodash';

interface DisplayedResults {
  firstLine: string;
  secondLine: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  dict: Dict;
  wordsList: TranslationRecord[];
  settings: Settings;
  remainingSeconds: number | null = null;
  timer: number | null;
  curEntry: TranslationRecord | null = null;
  right: number = 0;
  wrong: number = 0;
  enteredTranslation: FormControl;
  currentWordsList: TranslationRecord[];
  displayedResults: DisplayedResults | null;

  constructor(private dictStorageService: DictStorageService, private settingsService: SettingsService) {
    this.settings = this.settingsService.getSettings();
    const dict: Dict = this.dictStorageService.getDict();
    this.wordsList = dict[this.settings.fromLang] || [];
    this.enteredTranslation = new FormControl('');
  }

  ngOnInit(): void {
  }

  private setRemainingSeconds(milliseconds: number | null) {
    if (milliseconds === null) {
      this.remainingSeconds = null;
      
      return;
    }

    this.remainingSeconds = Math.floor(milliseconds / 1000)
  }

  public start() {
    this.currentWordsList = this.wordsList.slice();
    let prevNow: number = performance.now();
    let curTime: number = this.settings.gameDuration * 1000;
    this.setRemainingSeconds(curTime);
    this.right = 0;
    this.wrong = 0;
    this.enteredTranslation.setValue('');

    this.timer = window.setInterval(() => {
      let currentNow: number = performance.now();
      const dt = currentNow - prevNow;
      prevNow = currentNow;
      curTime -= dt;
      this.setRemainingSeconds(curTime);

      if (curTime < 0) {
        this.stop();
      }
    }, 100);

    this.nextEntry();
  }

  public stop() {
    const firstLine: string = `Правильно: ${this.right}, неправильно: ${this.wrong}`;
    let secondLine: string;

    if (this.right === 0 && this.wrong === 0) {
      secondLine = 'Кажется, вы заснули и не ввели ни единого перевода. Соберитесь!';
    } else if (this.right === 0) {
      secondLine = 'Вы не ввели ни одного правильного ответа...';
    } else {
      const percentage = Math.round(this.right / (this.right + this.wrong) * 100);

      secondLine = `Вы дали ${percentage}% правильных ответов.`;
      if (percentage >= 90) {
         secondLine += ' Так держать!';
      } else if (percentage >= 70) {
         secondLine += ' Неплохо!';
      } else if (percentage >= 50) {
         secondLine += ' Вы идете к успеху, но все еще вам надо много поработать!';
      } else if (percentage >= 30) {
         secondLine += ' Ну давайте, вы же можете больше...';
      } else {
         secondLine += ' К сожалению, ваши знания недостаточны. Вам нужно много поработать!';
      }
    }

    this.displayedResults = { firstLine, secondLine };

    window.clearInterval(this.timer);
    this.setRemainingSeconds(null);
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

      this.enteredTranslation.setValue('');
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
