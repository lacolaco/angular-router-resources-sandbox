import { Component, input } from '@angular/core';
import type { Routes } from '@angular/router';
import { userProfileResources } from './user-profile.resources';
import type { UserProfileResourceInputs, UserResource } from './user-profile.resources';
import type { User } from '../user.service';

// This file lists cases for type checking. The cases are not run.

// (a) satisfies reports an error when a resource declaration name is misspelled
// The declared type is not exported, so build a type of the same shape from the input type keys
type DeclaredResources = { [K in keyof UserProfileResourceInputs]: UserResource };

export const misspelledResources = (user: UserResource) =>
  ({
    user,
    // @ts-expect-error misspelled as `userResrouce` instead of `userResource`
    userResrouce: user,
  }) satisfies DeclaredResources;

// (b) implements reports an error when the component side does not match
@Component({ template: '' })
// @ts-expect-error `userResource` is not declared
export class MissingInput implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
}

@Component({ template: '' })
// @ts-expect-error `userResource` is declared under a different name
export class WrongName implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  readonly userRes = input.required<UserResource>();
}

@Component({ template: '' })
export class WrongType implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  // @ts-expect-error `userResource` has the wrong type (it receives a value, not a resource)
  readonly userResource = input.required<User | undefined>();
}

// (c) implements still passes when an alias is set (this cannot be detected)
@Component({ template: '' })
export class Aliased implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  readonly userResource = input.required<UserResource>({ alias: 'other' });
}

// (d) a different component on a route using userProfileResources still passes (this cannot be detected)
@Component({ template: '' })
export class Unrelated {}

export const mismatchedComponent: Routes = [
  {
    path: 'd',
    component: Unrelated,
    resources: userProfileResources,
  },
];

it('can load the type-check cases', () => {
  expect(misspelledResources).toBeDefined();
});
