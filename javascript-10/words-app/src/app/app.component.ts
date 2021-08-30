import { Component } from '@angular/core';
import { DictStorageService } from './dict-storage.service';
import { WordsProcessorService } from './words-processor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'words-app';
  words = '';
  status = '';

  constructor(private wordsProcessor: WordsProcessorService, public dictStorage: DictStorageService) {
  }

  async translate() {
    this.status = 'Переводим...';

    this.wordsProcessor.process(this.words).subscribe(
      () => {},
      () => { this.status = 'Ошибка!'; },
      () => {
        this.status = '';
        this.words = '';
      },
    );
  }

  handleInput(e: Event): void {
    this.words = (e.target as HTMLInputElement).value;
  }
}
