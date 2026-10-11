import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UserService } from '../user.service';
import { routes } from './search.routes';

describe('search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'search', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function settle(harness: RouterTestingHarness) {
    await vi.advanceTimersByTimeAsync(201);
    harness.detectChanges();
  }

  it('q が変わると searchUsers が再び呼ばれる', async () => {
    const searchUsers = vi.spyOn(TestBed.inject(UserService), 'searchUsers');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/search/users?q=ali');
    await settle(harness);
    expect(searchUsers).toHaveBeenCalledTimes(1);
    expect(searchUsers).toHaveBeenLastCalledWith('ali');

    await harness.navigateByUrl('/search/users?q=bob');
    await settle(harness);
    expect(searchUsers).toHaveBeenCalledTimes(2);
    expect(searchUsers).toHaveBeenLastCalledWith('bob');
    expect(harness.routeNativeElement?.textContent).toContain('Bob');
  });

  it('q を保ったまま view だけが変わっても searchUsers は呼ばれない', async () => {
    const searchUsers = vi.spyOn(TestBed.inject(UserService), 'searchUsers');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/search/users?q=ali');
    await settle(harness);
    expect(searchUsers).toHaveBeenCalledTimes(1);

    await harness.navigateByUrl('/search/users?q=ali&view=grid');
    await settle(harness);
    expect(searchUsers).toHaveBeenCalledTimes(1);
  });
});
