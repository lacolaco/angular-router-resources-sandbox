import { inject, resource } from '@angular/core';
import { nonBlocking, ResourceContext, Routes } from '@angular/router';
import { BlockingUserProfile } from './blocking-user-profile';
import { NonBlockingUserProfile } from './non-blocking-user-profile';
import { UserService } from '../user.service';

const userResource = (ctx: ResourceContext) => {
  const userService = inject(UserService);
  return resource({
    params: () => ctx.params()['id'] as string,
    loader: ({ params: id }) => userService.getUser(id),
  });
};

export const routes: Routes = [
  {
    path: 'blocking/users/:id',
    component: BlockingUserProfile,
    resources: (ctx) => ({ user: userResource(ctx) }),
  },
  {
    path: 'non-blocking/users/:id',
    component: NonBlockingUserProfile,
    resources: (ctx) => ({ userResource: nonBlocking(userResource(ctx)) }),
  },
];
