import { Component, input, Resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../user.service';

@Component({
  imports: [RouterLink],
  template: `
    <input #query type="search" [value]="q() ?? ''" (input)="(0)" />
    <button [routerLink]="[]" [queryParams]="{ q: query.value }">Search</button>

    @let res = usersResource();
    @if (res.isLoading()) {
      <p>Loading...</p>
    } @else if (res.error()) {
      <p>Failed to load users.</p>
    } @else if (res.value(); as users) {
      @for (user of users; track user.id) {
        <p>{{ user.name }}</p>
      }
    }
  `,
})
export class UserSearch {
  readonly q = input<string>();
  readonly usersResource = input.required<Resource<User[] | undefined>>();
}
