import { Routes } from '@angular/router';
import { LoginPages } from './pages/login-pages/login-pages';
import { SingUpPages } from './pages/sing-up-pages/sing-up-pages';
import { DashboardPages } from './pages/dashboard-pages/dashboard-pages';
import { EmpresasPages } from './pages/empresas-pages/empresas-pages';
import { AlumnosPages } from './pages/alumnos-pages/alumnos-pages';
import { ProfesoresPages } from './pages/profesores-pages/profesores-pages';
import { InformesPages } from './pages/informes-pages/informes-pages';
import { PracticasPages } from './pages/practicas-pages/practicas-pages';
import { ValoracionesPages } from './pages/valoraciones-pages/valoraciones-pages';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPages },
  { path: 'registro', component: SingUpPages },
  { path: 'dashboard', component: DashboardPages, canActivate: [authGuard] },
  { path: 'empresas', component: EmpresasPages, canActivate: [authGuard] },
  { path: 'alumnos', component: AlumnosPages, canActivate: [authGuard] },
  { path: 'profesores', component: ProfesoresPages, canActivate: [authGuard] },
  { path: 'informes', component: InformesPages, canActivate: [authGuard] },
  { path: 'seguimiento-historico', component: PracticasPages, canActivate: [authGuard] },
  { path: 'valoraciones', component: ValoracionesPages, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
