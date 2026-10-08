import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// ユースケースを追加するときは、この配列に 1 項目を足す。
const usecases: { path: string; title: string }[] = [
  { path: '/01-basic/users', title: '01 詳細ページをデータが揃ってから表示する' },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>Router Resources のデモ</h1>
    <h2>ユースケース</h2>
    <ul>
      @for (usecase of usecases; track usecase.path) {
        <li>
          <a [routerLink]="usecase.path">{{ usecase.title }}</a>
        </li>
      }
    </ul>
  `,
})
export class Home {
  protected readonly usecases = usecases;
}
