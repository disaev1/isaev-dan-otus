import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LastAddedWordsComponent } from './last-added-words/last-added-words.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';

const routes: Routes = [
  {
    path: 'words',
    component: LastAddedWordsComponent,
  },
  {
    path: 'game',
    component: GameComponent,
  },
  {
    path: 'settings',
    component: SettingsFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
