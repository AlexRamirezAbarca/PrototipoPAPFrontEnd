import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-programa-nacional',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './programa-nacional.component.html',
  styleUrl: './programa-nacional.component.css',
})
export class ProgramaNacionalComponent {
  mostrarModal = false;

  programas = [
    { id: 1, nombre: 'Paz, Justicia e Institucional sólidas' },
    { id: 2, nombre: 'Educación de Calidad' },
    { id: 3, nombre: 'Salud y Bienestar' },
    { id: 4, nombre: 'Energía Asequible y No Contaminante' },
    { id: 5, nombre: 'Ciudades y Comunidades Sostenibles' },
  ];

  nuevoPrograma = '';

  agregarPrograma() {
    const nombre = this.nuevoPrograma.trim();
    if (nombre) {
      const nuevo = {
        id: this.programas.length + 1,
        nombre,
      };
      this.programas.push(nuevo);
      this.nuevoPrograma = '';
    }
    this.cerrarModal();
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  eliminarPrograma(id: number) {
    this.programas = this.programas.filter((p) => p.id !== id);
  }

  regresar() {
    history.back();
  }
}
