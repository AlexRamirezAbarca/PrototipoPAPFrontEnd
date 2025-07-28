import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css'],
})
export class CatalogsComponent {
  catalogos = [
    { nombre: 'Ejes Plan Nacional Desarrollo', enlace: '/ejes', imagen: 'assets/banner.png' },
    { nombre: 'Objetivos Plan Nacional Desarrollo', enlace: '/objetivos', imagen: 'assets/banner.png' },
    { nombre: 'Políticas Plan Nacional Desarrollo', enlace: '/politicas', imagen: 'assets/banner.png' },
    { nombre: 'Metas Plan Nacional Desarrollo', enlace: '/metas', imagen: 'assets/banner.png' },
    { nombre: 'Relaciones Plan Nacional de Desarrollo', enlace: '/mantenedores', imagen: 'assets/banner.png' }
  ];
}
