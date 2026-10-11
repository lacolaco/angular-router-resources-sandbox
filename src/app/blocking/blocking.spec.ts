import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './blocking.routes';

describe('blocking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'blocking', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not complete navigation until the resource resolves, then shows the user name', async () => {
    const harness = await RouterTestingHarness.create();
    let done = false;
    const navigation = harness.navigateByUrl('/blocking/users/1').then(() => (done = true));

    await vi.advanceTimersByTimeAsync(199);
    expect(done).toBe(false);

    await vi.advanceTimersByTimeAsync(2);
    await navigation;
    expect(done).toBe(true);
    expect(harness.routeNativeElement?.textContent).toContain('Alice');
  });
});
