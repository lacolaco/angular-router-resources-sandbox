import { Component, input } from '@angular/core';
import type { Routes } from '@angular/router';
import { userProfileResources } from './user-profile.resources';
import type { UserProfileResourceInputs, UserResource } from './user-profile.resources';
import type { User } from '../user.service';

// このファイルは型検査のためのケースを並べる。ケースは実行しない。

// (a) リソース宣言の名前を間違えると satisfies がエラーにする
// 宣言型は export されていないので、インプット型のキーから同じ形の型を組み立てる
type DeclaredResources = { [K in keyof UserProfileResourceInputs]: UserResource };

export const misspelledResources = (user: UserResource) =>
  ({
    user,
    // @ts-expect-error `userResource` ではなく `userResrouce` と綴りを間違えている
    userResrouce: user,
  }) satisfies DeclaredResources;

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

// (d) userProfileResources を使うルートに別のコンポーネントを指定しても通る (検出できない)
@Component({ template: '' })
export class Unrelated {}

export const mismatchedComponent: Routes = [
  {
    path: 'd',
    component: Unrelated,
    resources: userProfileResources,
  },
];

it('型検査のケースを読み込める', () => {
  expect(misspelledResources).toBeDefined();
});
