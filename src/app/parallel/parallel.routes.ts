import { inject, resource } from '@angular/core';
import { ResourceContext, Routes } from '@angular/router';
import { UserPage } from './user-page';
import { UserPosts } from './user-posts';
import { UserService } from '../user.service';
import { PostService } from '../post.service';

const userResource = (ctx: ResourceContext) => {
  const userService = inject(UserService);
  return resource({
    params: () => ctx.params()['id'] as string,
    loader: ({ params: id }) => userService.getUser(id),
  });
};

const postsResource = (ctx: ResourceContext) => {
  const postService = inject(PostService);
  return resource({
    params: () => ctx.params()['id'] as string,
    loader: ({ params: id }) => postService.getPosts(id),
  });
};

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserPage,
    resources: (ctx) => ({ user: userResource(ctx) }),
    children: [
      {
        path: '',
        component: UserPosts,
        resources: (ctx) => ({ posts: postsResource(ctx) }),
      },
    ],
  },
];
