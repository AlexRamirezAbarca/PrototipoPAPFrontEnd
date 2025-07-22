import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateEjePnRequest } from '../../../../models/eje-pn.model';
import { EjePnService } from '../../services/eje-pn.service';

@Component({
  selector: 'app-ejes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ejes.component.html',
  styleUrls: ['./ejes.component.css'],
})
export class EjesComponent implements OnInit {
  ejes: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  newEje: CreateEjePnRequest = {
    nombre: '',
    descripcion: '',
  };

  showModal = false; // Por si luego lo usas

  constructor(private http: HttpClient, private ejePnService: EjePnService) {}

  ngOnInit(): void {
    this.loadEjes();
  }

  createEje(): void {
  if (!this.newEje.nombre || !this.newEje.descripcion) {
    alert('Debe ingresar nombre y descripción');
    return;
  }

  this.ejePnService.createEje(this.newEje).subscribe({
    next: (response) => {
      console.log('Eje creado correctamente', response.data);
      this.loadEjes(); // Recarga la tabla
      this.newEje = { nombre: '', descripcion: '' }; // Limpia formulario
      this.showModal = false; // Cierra modal si aplica
    },
    error: (err) => {
      console.error('Error al crear eje', err);
      alert('Error al crear eje');
    }
  });
}


  loadEjes(): void {
    const params = new HttpParams()
      .set('page', this.currentPage)
      .set('pageSize', this.pageSize);

    this.http
      .get<any>('http://localhost:5034/api/ejes/paginated', { params })
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.ejes = data.data;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Error al obtener ejes paginados', err);
        },
      });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEjes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEjes();
    }
  }

  editarEje(eje: any): void {
    console.log('Editar:', eje);
    // Abre modal o navega a ruta de edición
  }

  eliminarEje(eje: any): void {
    console.log('Eliminar:', eje);
    // Confirmación y lógica de eliminación
  }

  openModal(): void {
  this.showModal = true;
}

closeModal(): void {
  this.showModal = false;
}

}
