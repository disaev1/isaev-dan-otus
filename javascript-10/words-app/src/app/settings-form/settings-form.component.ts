import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  @ViewChild('settingsForm') settingsForm: NgForm;
  fromLang = 'en';
  gameDuration = 120;

  constructor(private settings: SettingsService) {

  }

  ngOnInit(): void {
    console.log('form is', this);
  }

  ngAfterViewInit(): void {
    this.settingsForm.valueChanges.subscribe(newValue => {
      this.fromLang = newValue.fromLang;
      this.gameDuration = Number(newValue.gameDuration);
    });
  }

  public save() {
    // TODO Deal with those stubs...
    this.settings.save(
      { fromLang: this.fromLang, gameDuration: this.gameDuration, toLang: 'ru', gameWordsCount: 0 }
    );
  }
}
