import { Routes } from '@angular/router';
import { routes as blockingRoutes } from './blocking/blocking.routes';
import { routes as httpRoutes } from './http/http.routes';
import { routes as nonBlockingRoutes } from './non-blocking/non-blocking.routes';
import { routes as parallelRoutes } from './parallel/parallel.routes';
import { routes as reloadRoutes } from './reload/reload.routes';
import { routes as searchRoutes } from './search/search.routes';
import { routes as typeSafeRoutes } from './type-safe/type-safe.routes';

export const routes: Routes = [
  { path: 'blocking', children: blockingRoutes },
  { path: 'non-blocking', children: nonBlockingRoutes },
  { path: 'http', children: httpRoutes },
  { path: 'parallel', children: parallelRoutes },
  { path: 'reload', children: reloadRoutes },
  { path: 'search', children: searchRoutes },
  { path: 'type-safe', children: typeSafeRoutes },
];
