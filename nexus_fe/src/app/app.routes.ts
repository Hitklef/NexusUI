import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent)
      },
      {
        path: 'api',
        loadComponent: () => import('./features/api/api-playground-page.component').then((m) => m.ApiPlaygroundPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
