import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { userSummaries } from './user-api';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  template: `
    <h1>ユーザー一覧</h1>
    <ul>
      @for (user of users; track user.id) {
        <li>
          <a [routerLink]="['/01-basic/users', user.id]">{{ user.name }}</a>
        </li>
      }
    </ul>
  `,
})
export class UserList {
  protected readonly users = userSummaries;
}
