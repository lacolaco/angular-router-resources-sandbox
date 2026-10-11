import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../user.service';

@Component({
  imports: [RouterOutlet],
  template: `
    <h2>{{ user().name }}</h2>
    <router-outlet />
  `,
})
export class UserPage {
  readonly user = input.required<User>();
}
