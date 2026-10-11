import { httpResource } from '@angular/common/http';
import { computed } from '@angular/core';
import { nonBlocking, ResourceContext, Routes } from '@angular/router';
import { UserProfile } from './user-profile';
import { User } from '../user.service';

const userResource = (ctx: ResourceContext) => {
  const id = computed(() => ctx.params()['id'] as string);
  return httpResource<User>(() => `/api/users/${encodeURIComponent(id())}`);
};

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserProfile,
    resources: (ctx) => ({ userResource: nonBlocking(userResource(ctx)) }),
  },
];
