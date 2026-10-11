import { computed, inject, resource } from '@angular/core';
import { nonBlocking, ResourceContext, Routes } from '@angular/router';
import { UserSearch } from './user-search';
import { UserService } from '../user.service';

const usersResource = (ctx: ResourceContext) => {
  const userService = inject(UserService);
  const q = computed(() => (ctx.queryParams()['q'] as string | undefined) ?? '');
  return resource({
    params: () => q(),
    loader: ({ params: query }) => userService.searchUsers(query),
  });
};

export const routes: Routes = [
  {
    path: 'users',
    component: UserSearch,
    resources: (ctx) => ({ usersResource: nonBlocking(usersResource(ctx)) }),
  },
];
