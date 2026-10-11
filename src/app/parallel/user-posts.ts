import { Component, input } from '@angular/core';
import { Post } from '../post.service';

@Component({
  template: `
    <ul>
      @for (post of posts(); track post.id) {
        <li>{{ post.title }}</li>
      }
    </ul>
  `,
})
export class UserPosts {
  readonly posts = input.required<Post[]>();
}
