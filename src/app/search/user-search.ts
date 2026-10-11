import { Component, input, linkedSignal, Resource } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { User } from '../user.service';

@Component({
  imports: [RouterLink, FormField],
  template: `
    <input type="search" [formField]="searchForm.q" />
    <button [routerLink]="[]" [queryParams]="{ q: searchForm.q().value() }">Search</button>

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
  readonly searchForm = form(linkedSignal(() => ({ q: this.q() ?? '' })));
  readonly usersResource = input.required<Resource<User[] | undefined>>();
}
