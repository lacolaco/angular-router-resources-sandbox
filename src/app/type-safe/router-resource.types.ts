import type { InputSignal, Resource } from '@angular/core';

export type RouteResource<T> = Resource<T> & { reload(): boolean };

export type ResourceInputs<
  Blocking extends { [K in keyof Blocking]: Resource<unknown> },
  NonBlocking extends { [K in keyof NonBlocking]: Resource<unknown> },
> = {
  readonly [K in keyof Blocking]: InputSignal<ReturnType<Blocking[K]['value']>>;
} & {
  readonly [K in keyof NonBlocking]: InputSignal<NonBlocking[K]>;
};
