import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import type { User } from '../user.service';
import type { UserResource } from './user-profile.resources';
import { routes } from './type-safe.routes';

@Component({ template: '' })
class Aliased {
  readonly user = input.required<User | undefined>();
  readonly userResource = input.required<UserResource>({ alias: 'other' });
}

@Component({ template: 'unrelated' })
class Unrelated {}

describe('type-safe', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function setup(routes: Parameters<typeof provideRouter>[0]) {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
    });
  }

  it('(e) does not navigate until the blocking user fetch completes, then shows both the user ID and the userResource name', async () => {
    setup([{ path: 'type-safe', children: routes }]);
    const harness = await RouterTestingHarness.create();
    let navigated = false;
    const navigation = harness.navigateByUrl('/type-safe/users/1').then(() => (navigated = true));

    await vi.advanceTimersByTimeAsync(100);
    expect(navigated).toBe(false);

    await vi.advanceTimersByTimeAsync(101);
    await navigation;
    harness.detectChanges();
    const text = harness.routeNativeElement?.textContent;
    expect(text).toContain('ID: 1');
    // Both resources load in parallel and finish at the same 200ms, so Loading... is never observed
    expect(text).not.toContain('Loading...');
    expect(text).toContain('Alice');
  });

  it('(c) an input with an alias receives no resource at runtime, even though the type check passes', async () => {
    setup([
      {
        path: 'aliased/:id',
        component: Aliased,
        resources: routes[0].resources,
      },
    ]);
    const harness = await RouterTestingHarness.create();
    const navigation = harness.navigateByUrl('/aliased/1', Aliased);
    await vi.advanceTimersByTimeAsync(201);
    const component = await navigation;
    // No data matches the alias 'other', so undefined is passed to userResource
    expect(component.userResource()).toBeUndefined();
    // The user input without an alias receives its value
    expect(component.user()).toEqual({ id: '1', name: 'Alice' });
  });

  it('(d) runtime behavior when an unrelated component is specified', async () => {
    setup([{ ...routes[0], component: Unrelated, path: 'mismatch/:id' }]);
    const harness = await RouterTestingHarness.create();
    const navigation = harness.navigateByUrl('/mismatch/1').then(
      () => 'resolved',
      (e: unknown) => `rejected: ${e}`,
    );
    await vi.advanceTimersByTimeAsync(201);
    // Navigation succeeds without error, and the other component is shown without using the resource
    expect(await navigation).toBe('resolved');
    expect(harness.routeNativeElement?.textContent).toBe('unrelated');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(Unrelated);
  });
});
