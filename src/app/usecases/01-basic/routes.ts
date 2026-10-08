import { resource } from '@angular/core';
import { Routes } from '@angular/router';
import { fetchUser } from './user-api';
import { UserDetail } from './user-detail';
import { UserList } from './user-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', component: UserList },
  {
    path: 'users/:id',
    component: UserDetail,
    resources: (ctx) => ({
      user: resource({
        params: () => ctx.params()['id'] as string,
        loader: ({ params: id }) => fetchUser(id),
      }),
    }),
  },
];
