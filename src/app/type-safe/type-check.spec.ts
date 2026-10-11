import { Component, input } from '@angular/core';
import { nonBlocking } from '@angular/router';
import type { Routes } from '@angular/router';
import { userResource } from './user-profile.resources';
import type {
  UserProfileResourceInputs,
  UserProfileResources,
  UserResource,
} from './user-profile.resources';
import type { User } from '../user.service';

// このファイルは型検査のためのケースを並べる。ケースは実行しない。

// (a) ルート側のリソース名を間違えると satisfies がエラーにする
export const wrongRouteName: Routes = [
  {
    path: 'a',
    resources: (ctx) =>
      ({
        user: userResource(ctx),
        // @ts-expect-error `userResource` ではなく `userResrouce` と綴りを間違えている
        userResrouce: nonBlocking(userResource(ctx)),
      }) satisfies UserProfileResources,
  },
];

// (b) コンポーネント側の不一致は implements がエラーにする
@Component({ template: '' })
// @ts-expect-error `userResource` を宣言し忘れている
export class MissingInput implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
}

@Component({ template: '' })
// @ts-expect-error `userResource` を別の名前にしている
export class WrongName implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  readonly userRes = input.required<UserResource>();
}

@Component({ template: '' })
export class WrongType implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  // @ts-expect-error `userResource` の型が違う (リソースではなく値を受け取っている)
  readonly userResource = input.required<User | undefined>();
}

// (c) alias を付けても implements は通る (検出できない)
@Component({ template: '' })
export class Aliased implements UserProfileResourceInputs {
  readonly user = input.required<User | undefined>();
  readonly userResource = input.required<UserResource>({ alias: 'other' });
}

// (d) satisfies UserProfileResources のルートに別のコンポーネントを指定しても通る (検出できない)
@Component({ template: '' })
export class Unrelated {}

export const mismatchedComponent: Routes = [
  {
    path: 'd',
    component: Unrelated,
    resources: (ctx) =>
      ({
        user: userResource(ctx),
        userResource: nonBlocking(userResource(ctx)),
      }) satisfies UserProfileResources,
  },
];

it('型検査のケースを読み込める', () => {
  expect(wrongRouteName).toBeDefined();
});
