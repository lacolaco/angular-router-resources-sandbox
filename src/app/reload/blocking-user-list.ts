import { Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, UserService } from '../user.service';

@Component({
  template: `
    @for (user of users(); track user.id) {
      <input #name [value]="user.name" />
      <button (click)="saveUser(user, name.value)">Save</button>
    }
  `,
})
export class BlockingUserList {
  readonly users = input.required<User[]>();
  private readonly userService = inject(UserService);
  private readonly usersResource = inject(ActivatedRoute).resources?.['users']!;

  async saveUser(user: User, name: string) {
    await this.userService.saveUser({ ...user, name });
    this.usersResource.reload();
  }
}
