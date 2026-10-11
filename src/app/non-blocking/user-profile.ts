import { Component, input, Resource } from '@angular/core';
import { User } from '../user.service';

@Component({
  template: `
    @let res = userResource();
    @if (res.isLoading()) {
      <p>Loading...</p>
    } @else if (res.error()) {
      <p>Failed to load user.</p>
    } @else if (res.value(); as user) {
      <h2>{{ user.name }}</h2>
      <p>ID: {{ user.id }}</p>
    }
  `,
})
export class UserProfile {
  readonly userResource = input.required<Resource<User | undefined>>();
}
