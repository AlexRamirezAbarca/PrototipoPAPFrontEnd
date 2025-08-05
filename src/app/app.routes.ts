import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/pages/loginPage/login.component';
import { LayoutComponent } from '../shared/components/layout/pages/layout.component';
import { CatalogsComponent } from './home/pages/catalogs/pages/catalogs.component';
import { EjesComponent } from './home/pages/catalogs/planNacional/ejes/ejes.component';
import { WelcomeComponent } from './home/pages/welcome/pages/welcome.component';
import { ObjetivosComponent } from './home/pages/catalogs/planNacional/objetivos/objetivos.component';
// import { PoliticasComponent } from './home/pages/catalogs/planNacional/politicas/politicas.component';
// import { MetasComponent } from './home/pages/catalogs/planNacional/metas/metas.component';
import { MantenedoresComponent } from './home/pages/catalogs/planNacional/mantenedores/mantenedores.component';
import { MetasPoliticasComponent } from './home/pages/catalogs/planNacional/metas-politicas/metas-politicas.component';
import { PlanNacionalComponent } from './home/pages/catalogs/planNacional/planNacional/planNacional.component';

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
      { path: 'plan-nacional', component: PlanNacionalComponent },
      // { path: 'metas', component: MetasComponent },
      { path: 'metas-politicas', component: MetasPoliticasComponent },
      {
        path: 'mantenedores',
        component: MantenedoresComponent,
      },
    ],
  },
];
