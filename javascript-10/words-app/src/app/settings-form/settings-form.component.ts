import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  @ViewChild('settingsForm') settingsForm: NgForm;
  fromLang = 'en';
  gameDuration = 120;

  constructor() { }

  ngOnInit(): void {
    console.log('form is', this);
  }

  ngAfterViewInit(): void {
    this.settingsForm.valueChanges.subscribe(newValue => {
      console.log('new value', newValue);
    });
  }

}
