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
import { MetasComponent } from './home/pages/catalogs/planNacional/metas/metas.component';
import { PoliticaPnService } from './home/pages/catalogs/services/politica-pn.service';
import { PoliticasComponent } from './home/pages/catalogs/planNacional/politicas/politicas.component';
import { EstructuraProgramaticaComponent } from './home/pages/catalogs/estructura-programatica/estructuraProgramatica/estructura-programatica.component';
import { ProgramaInstitucionalComponent } from './home/pages/catalogs/estructura-programatica/programaInstitucional/programa-institucional.component';
import { ProgramaNacionalComponent } from './home/pages/catalogs/estructura-programatica/programaNacional/programa-nacional.component';

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
      {
        path: 'metas/agregar/:id',
        component: MetasComponent,
      },
      {
        path: 'politicas/agregar/:id',
        component: PoliticasComponent,
      },
      { path: 'metas-politicas', component: MetasPoliticasComponent },
      {
        path: 'mantenedores',
        component: MantenedoresComponent,
      },
      {
        path: 'estructura-programatica',
        component: EstructuraProgramaticaComponent,
      },
      {
        path : "programa-institucional",
        component : ProgramaInstitucionalComponent
      },
      {
        path : "programa-nacional",
        component: ProgramaNacionalComponent
      }
    ],
  },
];
