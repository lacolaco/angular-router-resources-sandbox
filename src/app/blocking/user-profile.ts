import { Component, input } from '@angular/core';
import { User } from '../user.service';

@Component({
  selector: 'app-user-profile',
  template: ` <h2>{{ user().name }}</h2> `,
})
export class UserProfile {
  readonly user = input.required<User>();
}
