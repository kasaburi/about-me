import { Routes } from '@angular/router';
import { Desing } from './desing/desing';
import { Website } from './website/website';

export const routes: Routes = [


  {
  path: '',
  component: Desing,
},
{
  path: 'desing',
  component: Website,
}

];
