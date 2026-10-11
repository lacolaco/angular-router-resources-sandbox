import { inject, resource } from '@angular/core';
import { nonBlocking, Routes } from '@angular/router';
import { BlockingUserList } from './blocking-user-list';
import { NonBlockingUserList } from './non-blocking-user-list';
import { UserService } from '../user.service';

const usersResource = () => {
  const userService = inject(UserService);
  return resource({
    loader: () => userService.getUsers(),
  });
};

export const routes: Routes = [
  {
    path: 'blocking/users',
    component: BlockingUserList,
    resources: () => ({ users: usersResource() }),
  },
  {
    path: 'non-blocking/users',
    component: NonBlockingUserList,
    resources: () => ({ usersResource: nonBlocking(usersResource()) }),
  },
];
