import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the home page at the root path', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const compiled = harness.routeNativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Router Resources のデモ');
    expect(compiled.querySelector('h2')?.textContent).toContain('ユースケース');
  });
});
