import { TestBed } from '@angular/core/testing';
import {
  NavigationStart,
  provideRouter,
  Router,
  withComponentInputBinding,
  withRouterResources,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UserService } from '../user.service';
import { routes } from './reload.routes';

describe('reload', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'reload', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function refreshButton(harness: RouterTestingHarness): HTMLButtonElement {
    return (harness.routeNativeElement as HTMLElement).querySelector('button')!;
  }

  it('blocking: Refresh は NavigationStart を起こさず getUser を再実行し、表示を維持する', async () => {
    const getUser = vi.spyOn(TestBed.inject(UserService), 'getUser');
    const harness = await RouterTestingHarness.create();
    const navigation = harness.navigateByUrl('/reload/blocking/users/1');
    await vi.advanceTimersByTimeAsync(201);
    await navigation;
    harness.detectChanges();
    expect(getUser).toHaveBeenCalledTimes(1);

    const starts: unknown[] = [];
    TestBed.inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationStart) starts.push(e);
    });

    refreshButton(harness).click();
    await vi.advanceTimersByTimeAsync(0);
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(harness.routeNativeElement?.textContent).toContain('Alice');

    await vi.advanceTimersByTimeAsync(201);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Alice');
    expect(starts).toHaveLength(0);
  });

  it('non-blocking: Refresh は NavigationStart を起こさず getUser を再実行し、Loading... から戻る', async () => {
    const getUser = vi.spyOn(TestBed.inject(UserService), 'getUser');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/reload/non-blocking/users/1');
    await vi.advanceTimersByTimeAsync(201);
    harness.detectChanges();
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(harness.routeNativeElement?.textContent).toContain('Alice');

    const starts: unknown[] = [];
    TestBed.inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationStart) starts.push(e);
    });

    refreshButton(harness).click();
    await vi.advanceTimersByTimeAsync(0);
    harness.detectChanges();
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(harness.routeNativeElement?.textContent).toContain('Loading...');

    await vi.advanceTimersByTimeAsync(201);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).not.toContain('Loading...');
    expect(harness.routeNativeElement?.textContent).toContain('Alice');
    expect(starts).toHaveLength(0);
  });
});
