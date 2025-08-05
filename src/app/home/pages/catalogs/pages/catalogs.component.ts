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
// catalogs.component.ts → se mantendrá su selector pero lo renombras a Mantenimiento visualmente
export class CatalogsComponent {
  seccionesPrincipales = [
    { nombre: 'Plan Nacional de Desarrollo', enlace: '/plan-nacional', imagen: 'assets/banner.png' },
    { nombre: 'Estructura Programática', enlace: '/estructura-programatica', imagen: 'assets/banner.png' },
    { nombre: 'PEDI', enlace: '/pedi', imagen: 'assets/banner.png' }
  ];
}


