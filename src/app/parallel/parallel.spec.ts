import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './parallel.routes';

describe('parallel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'parallel', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('親子のリソースが並列に解決され、300ms で遷移が完了する', async () => {
    const harness = await RouterTestingHarness.create();
    let done = false;
    const navigation = harness.navigateByUrl('/parallel/users/1').then(() => (done = true));

    await vi.advanceTimersByTimeAsync(299);
    expect(done).toBe(false);

    await vi.advanceTimersByTimeAsync(2);
    await navigation;
    expect(done).toBe(true);

    harness.detectChanges();
    const element = harness.routeNativeElement as HTMLElement;
    expect(element.textContent).toContain('Alice');
    const posts = Array.from(element.querySelectorAll('li')).map((li) => li.textContent);
    expect(posts).toEqual(['Hello Router Resources', 'Signals and the Router']);
  });
});
