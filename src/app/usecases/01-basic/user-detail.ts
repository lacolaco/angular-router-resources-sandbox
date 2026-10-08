import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from './user-api';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().role }}</p>
    <a routerLink="/01-basic/users">一覧に戻る</a>
  `,
})
export class UserDetail {
  // resources が返した Resource の値が、読み込み完了後に束縛される。
  readonly user = input.required<User>();
}
