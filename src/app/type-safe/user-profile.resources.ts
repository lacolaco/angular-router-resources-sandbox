import { inject, resource } from '@angular/core';
import { nonBlocking } from '@angular/router';
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

type UserProfileResources = UserProfileBlockingResources & UserProfileNonBlockingResources;

export type UserProfileResourceInputs = ResourceInputs<
  UserProfileBlockingResources,
  UserProfileNonBlockingResources
>;

const userResource = (ctx: ResourceContext) => {
  const userService = inject(UserService);
  return resource({
    params: () => ctx.params()['id'] as string,
    loader: ({ params: id }) => userService.getUser(id),
  });
};

export const userProfileResources = (ctx: ResourceContext) =>
  ({
    user: userResource(ctx),
    userResource: nonBlocking(userResource(ctx)),
  }) satisfies UserProfileResources;
