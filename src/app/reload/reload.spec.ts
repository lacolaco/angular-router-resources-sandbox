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

  function inputs(harness: RouterTestingHarness): HTMLInputElement[] {
    return Array.from((harness.routeNativeElement as HTMLElement).querySelectorAll('input'));
  }

  function saveButton(harness: RouterTestingHarness): HTMLButtonElement {
    return (harness.routeNativeElement as HTMLElement).querySelector('button')!;
  }

  function rename(harness: RouterTestingHarness, name: string) {
    const input = inputs(harness)[0];
    input.value = name;
    saveButton(harness).click();
  }

  for (const variant of ['blocking', 'non-blocking']) {
    it(`${variant}: Save re-runs getUsers after saveUser completes and shows the latest server list without a NavigationStart`, async () => {
      const userService = TestBed.inject(UserService);
      const getUsers = vi.spyOn(userService, 'getUsers');
      const saveUser = vi.spyOn(userService, 'saveUser');
      const harness = await RouterTestingHarness.create();
      const navigation = harness.navigateByUrl(`/reload/${variant}/users`);
      await vi.advanceTimersByTimeAsync(201);
      await navigation;
      harness.detectChanges();
      expect(getUsers).toHaveBeenCalledTimes(1);
      expect(inputs(harness).map((i) => i.value)).toEqual(['Alice', 'Bob', 'Alicia']);

      // Separately from the displayed list, Bob's name is changed on the server
      const serverSideUpdate = userService.saveUser({ id: '2', name: 'Robert' });
      await vi.advanceTimersByTimeAsync(201);
      await serverSideUpdate;
      saveUser.mockClear();

      const starts: unknown[] = [];
      TestBed.inject(Router).events.subscribe((e) => {
        if (e instanceof NavigationStart) starts.push(e);
      });

      rename(harness, 'Alice Updated');
      await vi.advanceTimersByTimeAsync(0);
      expect(saveUser).toHaveBeenCalledWith({ id: '1', name: 'Alice Updated' });
      expect(getUsers).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(201);
      expect(getUsers).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(201);
      harness.detectChanges();
      expect(inputs(harness).map((i) => i.value)).toEqual(['Alice Updated', 'Robert', 'Alicia']);
      expect(starts).toHaveLength(0);
    });
  }
});
