import { Component, input, Resource } from '@angular/core';
import { User } from '../user.service';

type RouterResource<T> = Resource<T> & { reload(): boolean };

@Component({
  template: `
    @let res = userResource();
    <button (click)="res.reload()" [disabled]="res.isLoading()">Refresh</button>
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
export class NonBlockingUserProfile {
  readonly userResource = input.required<RouterResource<User | undefined>>();
}
