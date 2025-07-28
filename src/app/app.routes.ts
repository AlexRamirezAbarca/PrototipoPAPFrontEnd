import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/pages/loginPage/login.component';
import { LayoutComponent } from '../shared/components/layout/pages/layout.component';
import { CatalogsComponent } from './home/pages/catalogs/pages/catalogs.component';
import { EjesComponent } from './home/pages/catalogs/planNacional/ejes/ejes.component';
import { WelcomeComponent } from './home/pages/welcome/pages/welcome.component';
import { ObjetivosComponent } from './home/pages/catalogs/planNacional/objetivos/objetivos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: WelcomeComponent },
      { path: 'catalogos', component: CatalogsComponent },
      { path: 'ejes', component: EjesComponent },
      { path: 'objetivos', component: ObjetivosComponent },
    ],
  },
];
