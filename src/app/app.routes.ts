import { Routes } from '@angular/router';
import { LoginPages } from './pages/login-pages/login-pages';
import { SingUpPages } from './pages/sing-up-pages/sing-up-pages';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPages },
  { path: 'registro', component: SingUpPages },
  { path: '**', redirectTo: '/login' }
  
];