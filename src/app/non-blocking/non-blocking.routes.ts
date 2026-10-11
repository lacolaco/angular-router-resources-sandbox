import { inject, resource } from '@angular/core';
import { nonBlocking, Routes } from '@angular/router';
import { UserProfile } from './user-profile';
import { UserService } from '../user.service';

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        userResource: nonBlocking(
          resource({
            params: () => ctx.params()['id'] as string | undefined,
            loader: ({ params: id }) => userService.getUser(id),
          }),
        ),
      };
    },
  },
];
