import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-plan-nacional',
  imports: [CommonModule, RouterModule],
  templateUrl: './planNacional.component.html',
  styleUrl: './planNacional.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanNacionalComponent {

  constructor( private router : Router){}

  seccionesPlanNacional = [
    { nombre: 'Ejes', enlace: '/ejes', imagen: 'assets/banner.png' },
    { nombre: 'Objetivos', enlace: '/objetivos', imagen: 'assets/banner.png' },
    { nombre: 'Metas y Políticas', enlace: '/metas-politicas', imagen: 'assets/banner.png' }
  ];

   goBack() {
    this.router.navigate(['/catalogos']);
  }
}
