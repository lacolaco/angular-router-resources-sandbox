import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './routes';
import { API_DELAY_MS } from './user-api';

describe('01-basic routes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withRouterResources(), withComponentInputBinding())],
    });
  });

  afterEach(() => vi.useRealTimers());

  function heading(harness: RouterTestingHarness): string | null | undefined {
    return harness.routeNativeElement?.querySelector('h1')?.textContent;
  }

  async function navigateAndFinishLoading(harness: RouterTestingHarness, url: string) {
    const navigation = harness.navigateByUrl(url);
    await vi.runAllTimersAsync();
    await navigation;
  }

  it('keeps showing the list until the user is loaded', async () => {
    const harness = await RouterTestingHarness.create('/users');
    expect(heading(harness)).toBe('ユーザー一覧');

    const navigation = harness.navigateByUrl('/users/1');
    await vi.advanceTimersByTimeAsync(API_DELAY_MS - 1);
    expect(heading(harness)).toBe('ユーザー一覧');

    await vi.runAllTimersAsync();
    await navigation;
    expect(heading(harness)).toBe('Ada Lovelace');
  });

  it('switches to another user after waiting for its data', async () => {
    const harness = await RouterTestingHarness.create();
    await navigateAndFinishLoading(harness, '/users/1');
    expect(heading(harness)).toBe('Ada Lovelace');

    const navigation = harness.navigateByUrl('/users/2');
    await vi.advanceTimersByTimeAsync(API_DELAY_MS - 1);
    expect(heading(harness)).toBe('Ada Lovelace');

    await vi.runAllTimersAsync();
    await navigation;
    expect(heading(harness)).toBe('Grace Hopper');
  });
});
