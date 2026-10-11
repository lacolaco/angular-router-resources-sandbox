import { inject, resource } from '@angular/core';
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile';
import { UserService } from '../user.service';

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        user: resource({
          params: () => ctx.params()['id'] as string,
          loader: ({ params: id }) => userService.getUser(id),
        }),
      };
    },
  },
];
