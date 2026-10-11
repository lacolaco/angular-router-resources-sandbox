import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withRouterResources } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './http.routes';

describe('http', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [{ path: 'http', children: routes }],
          withComponentInputBinding(),
          withRouterResources(),
        ),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('/api/users/1 へリクエストし、Loading... の後に名前を表示する', async () => {
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/http/users/1');
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Loading...');

    http.expectOne('/api/users/1').flush({ id: '1', name: 'Alice' });
    await harness.fixture.whenStable();
    harness.detectChanges();
    const text = harness.routeNativeElement?.textContent;
    expect(text).not.toContain('Loading...');
    expect(text).toContain('Alice');
    expect(text).toContain('ID: 1');
  });

  it('/http/users/2 へ遷移すると /api/users/2 へ新しいリクエストを出す', async () => {
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/http/users/1');
    harness.detectChanges();
    http.expectOne('/api/users/1').flush({ id: '1', name: 'Alice' });
    await harness.fixture.whenStable();

    await harness.navigateByUrl('/http/users/2');
    harness.detectChanges();
    http.expectOne('/api/users/2').flush({ id: '2', name: 'Bob' });
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Bob');
  });
});
