import { nonBlocking } from '@angular/router';
import type { Routes } from '@angular/router';
import { UserProfile } from './user-profile';
import { userResource } from './user-profile.resources';
import type { UserProfileResources } from './user-profile.resources';

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserProfile,
    resources: (ctx) =>
      ({
        user: userResource(ctx),
        userResource: nonBlocking(userResource(ctx)),
      }) satisfies UserProfileResources,
  },
];
