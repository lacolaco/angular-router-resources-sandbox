import { Routes } from '@angular/router';
import { Home } from './home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '01-basic',
    loadChildren: () => import('./usecases/01-basic/routes').then((m) => m.routes),
  },
];
