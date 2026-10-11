import { Component, input } from '@angular/core';
import type { UserProfileResourceInputs, UserResource } from './user-profile.resources';
import type { User } from '../user.service';

@Component({
  template: `
    @if (user(); as user) {
      <p>ID: {{ user.id }}</p>
    }
    @let res = userResource();
    @if (res.isLoading()) {
      <p>Loading...</p>
    } @else if (res.error()) {
      <p>Failed to load user.</p>
    } @else if (res.value(); as user) {
      <h2>{{ user.name }}</h2>
    }
  `,
})
export class UserProfile implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  readonly userResource = input.required<UserResource>();
}
