import type { Routes } from '@angular/router';
import { UserProfile } from './user-profile';
import { userProfileResources } from './user-profile.resources';

export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserProfile,
    resources: userProfileResources,
  },
];
