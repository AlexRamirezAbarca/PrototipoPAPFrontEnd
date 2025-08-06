import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estructura-programatica',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estructura-programatica.component.html',
  styleUrl: './estructura-programatica.component.css'
})
export class EstructuraProgramaticaComponent {

constructor() {}

  secciones = [
    { nombre: 'Programa Nacional', enlace: '/programa-nacional', imagen: 'assets/banner.png' },
    { nombre: 'Programa Institucional', enlace: '/programa-institucional', imagen: 'assets/banner.png' }
  ];

}
