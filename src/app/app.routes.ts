import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' }, // Redirect to splash
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'add-entry',
    loadComponent: () => import('./pages/add-entry/add-entry.page').then( m => m.AddEntryPage)
  },
  {
    path: 'entry-details',
    loadComponent: () => import('./pages/entry-details/entry-details.page').then( m => m.EntryDetailsPage)
  },
  {
    path: 'edit-entry',
    loadComponent: () => import('./pages/edit-entry/edit-entry.page').then( m => m.EditEntryPage)
  },
];
