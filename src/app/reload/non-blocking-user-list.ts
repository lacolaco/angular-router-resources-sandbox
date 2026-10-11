import { Component, inject, input, Resource } from '@angular/core';
import { User, UserService } from '../user.service';

type RouteResource<T> = Resource<T> & { reload(): boolean };

@Component({
  template: `
    @let res = usersResource();
    @if (res.isLoading()) {
      <p>Loading...</p>
    } @else if (res.error()) {
      <p>Failed to load users.</p>
    } @else if (res.value(); as users) {
      @for (user of users; track user.id) {
        <input #name [value]="user.name" />
        <button (click)="saveUser(user, name.value)">Save</button>
      }
    }
  `,
})
export class NonBlockingUserList {
  readonly usersResource = input.required<RouteResource<User[] | undefined>>();
  private readonly userService = inject(UserService);

  async saveUser(user: User, name: string) {
    await this.userService.saveUser({ ...user, name });
    this.usersResource().reload();
  }
}
