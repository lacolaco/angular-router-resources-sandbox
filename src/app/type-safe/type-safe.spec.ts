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

  it('(e) ブロッキングな user の取得完了までは遷移せず、完了時には user の ID と userResource の名前の両方が表示される', async () => {
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
    // 2 つのリソースは並行して読み込まれ、同じ 200ms で完了するため、Loading... は観測できない
    expect(text).not.toContain('Loading...');
    expect(text).toContain('Alice');
  });

  it('(c) alias を付けたインプットには、型検査は通っても実行時にリソースが渡らない', async () => {
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
    // alias 'other' に対応するデータがないため、userResource には undefined が渡る
    expect(component.userResource()).toBeUndefined();
    // alias を付けていない user は渡る
    expect(component.user()).toEqual({ id: '1', name: 'Alice' });
  });

  it('(d) 無関係なコンポーネントを指定した場合の実行時の挙動', async () => {
    setup([{ ...routes[0], component: Unrelated, path: 'mismatch/:id' }]);
    const harness = await RouterTestingHarness.create();
    const navigation = harness.navigateByUrl('/mismatch/1').then(
      () => 'resolved',
      (e: unknown) => `rejected: ${e}`,
    );
    await vi.advanceTimersByTimeAsync(201);
    // エラーにならず遷移し、リソースは使われないまま別のコンポーネントが表示される
    expect(await navigation).toBe('resolved');
    expect(harness.routeNativeElement?.textContent).toBe('unrelated');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(Unrelated);
  });
});
