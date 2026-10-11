import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './non-blocking.routes';

describe('non-blocking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'non-blocking', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('completes navigation immediately showing Loading..., then shows the user after 200ms', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/non-blocking/users/1');
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Loading...');
    expect(harness.routeNativeElement?.textContent).not.toContain('Alice');

    await vi.advanceTimersByTimeAsync(201);
    harness.detectChanges();
    const text = harness.routeNativeElement?.textContent;
    expect(text).not.toContain('Loading...');
    expect(text).toContain('Alice');
    expect(text).toContain('ID: 1');
  });
});
