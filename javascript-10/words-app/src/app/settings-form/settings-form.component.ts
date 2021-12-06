import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import type { Settings } from '../settings.service';
import { SettingsService } from '../settings.service';

interface Status {
  timer: number | null;
  text: string;
  type: string | null;
}

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  @ViewChild('settingsForm') settingsForm: NgForm;
  settings: Settings;
  status: Status;

  constructor(private settingsService: SettingsService) {
    this.settings = settingsService.getSettings();
    this.resetStatus();
  }

  ngOnInit(): void {
    console.log('form is', this);
  }

  ngAfterViewInit(): void {
    this.settingsForm.valueChanges.subscribe(newValue => {
      this.settings = {
        fromLang: (newValue.fromLang as string),
        gameDuration: Number(newValue.gameDuration),
        toLang: (newValue.toLang as string),
        gameWordsCount: Number(newValue.gameDuration),
      }
    });
  }

  public save(): void {
    if (this.settings.fromLang === this.settings.toLang) {
      this.setStatus('error', 'Исходный язык и язык перевода не могут быть одинаковыми!');

      return;
    }

    this.settingsService.save(this.settings).subscribe(
      () => {
        this.setStatus('success', 'Настройки сохранены!');
      },
      (e) => {
        console.error(e);
        this.setStatus('error', 'Ошибка сохранения!');
      }
    );
  }

  private setStatus(type: string, text: string): void {
    this.status.type = type;
    this.status.text = text;
    clearTimeout(this.status.timer);

    this.status.timer = window.setTimeout(this.resetStatus, 3000);
  }

  private resetStatus() {
    this.status = { text: '', timer: null, type: null };
  }
}
