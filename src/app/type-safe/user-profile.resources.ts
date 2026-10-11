import { inject, resource } from '@angular/core';
import type { ResourceContext } from '@angular/router';
import type { ResourceInputs, RouterResource } from './router-resource.types';
import { UserService } from '../user.service';
import type { User } from '../user.service';

export type UserResource = RouterResource<User | undefined>;

interface UserProfileBlockingResources {
  user: UserResource;
}

interface UserProfileNonBlockingResources {
  userResource: UserResource;
}

export type UserProfileResources = UserProfileBlockingResources & UserProfileNonBlockingResources;

export type UserProfileResourceInputs = ResourceInputs<
  UserProfileBlockingResources,
  UserProfileNonBlockingResources
>;

export const userResource = (ctx: ResourceContext) => {
  const userService = inject(UserService);
  return resource({
    params: () => ctx.params()['id'] as string,
    loader: ({ params: id }) => userService.getUser(id),
  });
};
