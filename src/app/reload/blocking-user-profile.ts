import { Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user.service';

@Component({
  template: `
    <h2>{{ user().name }}</h2>
    <button (click)="refreshUser()">Refresh</button>
  `,
})
export class BlockingUserProfile {
  readonly user = input.required<User>();
  private readonly userResource = inject(ActivatedRoute).resources?.['user']!;

  refreshUser() {
    this.userResource.reload();
  }
}
