import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./desing/desing').then(m => m.Desing),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then(m => m.About),
  },
  {
    path: 'desing',
    loadComponent: () => import('./website/website').then(m => m.Website),
    children: [
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },
      {
        path: 'discover',
        loadComponent: () => import('./discover/discover').then(m => m.Discover),
      },
      {
        path: 'elora',
        loadComponent: () => import('./elora/elora').then(m => m.Elora),
      },
      {
        path: 'restoran',
        loadComponent: () => import('./restoran/restoran').then(m => m.Restoran),
      },
      {
        path: 'fix',
        loadComponent: () => import('./fix/fix').then(m => m.Fix),
      },
    ],
  },
];
