import { Routes } from '@angular/router';

import { Desing } from './desing/desing';
import { Website } from './website/website';
import { Discover } from './discover/discover';
import { Elora } from './elora/elora';
import { Restoran } from './restoran/restoran';
import { Fix } from './fix/fix';
import { About } from './about/about';

export const routes: Routes = [
  {
    path: '',
    component: Desing,
  },


  {
    path: 'about',
    component: About,
  },

  {
    path: 'desing',
    component: Website,
    children: [
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },

      {
        path: 'discover',
        component: Discover,
      },

      {
        path: 'elora',
        component: Elora,
      },

      {
        path: 'restoran',
        component: Restoran,
      },

      {
        path: 'fix',
        component: Fix,
      },
    ],
  },
];