import { Routes } from '@angular/router';
import { LoginPages } from './pages/login-pages/login-pages';
import { SingUpPages } from './pages/sing-up-pages/sing-up-pages';
import { DashboardPages } from './pages/dashboard-pages/dashboard-pages';
import { EmpresasPages } from './pages/empresas-pages/empresas-pages';
import { AlumnosPages } from './pages/alumnos-pages/alumnos-pages';
import { FirmaDigitalPages } from './pages/firma-digital-pages/firma-digital-pages';
import { ProfesoresPages } from './pages/profesores-pages/profesores-pages';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPages },
  { path: 'registro', component: SingUpPages },
  { path: 'dashboard', component: DashboardPages },
  { path: 'empresas', component: EmpresasPages },
  { path: 'alumnos', component: AlumnosPages },
  {path: 'firma-digital', component: FirmaDigitalPages},
  { path: 'profesores', component: ProfesoresPages},
  { path: '**', redirectTo: '/login' }
];