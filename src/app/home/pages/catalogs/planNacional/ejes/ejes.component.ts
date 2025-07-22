import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateEjePnRequest, EjePn } from '../../../../models/eje-pn.model';
import { EjePnService } from '../../services/eje-pn.service';
import { LoaderComponent } from '../../../../../../shared/components/loader/pages/loader.component';
import { ConfirmModalComponent } from '../../../../../../shared/components/modals/pages/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-ejes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,  LoaderComponent, ConfirmModalComponent],
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

  showModal = false;

  isEditing = false;
  selectedEjeId: number | null = null;

  loading = false;
  showConfirmModal = false;
  ejeToDelete: EjePn | null = null;


  constructor(private http: HttpClient, private ejePnService: EjePnService) {}

  ngOnInit(): void {
    this.loadEjes();
  }

  loadEjes(): void {
    this.loading = true;
    this.ejePnService.getPaginated(this.currentPage, this.pageSize).subscribe({
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
      complete: () => {
        this.loading = false;
      }
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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.selectedEjeId = null;
    this.newEje = { nombre: '', descripcion: '' };
  }

  editarEje(eje: EjePn): void {
    this.selectedEjeId = eje.ejePnId;
    this.newEje = {
      nombre: eje.nombre,
      descripcion: eje.descripcion,
    };
    this.isEditing = true;
    this.showModal = true;
  }

  eliminarEje(eje: EjePn): void {
    this.ejeToDelete = eje;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
  if (!this.ejeToDelete) return;

  this.loading = true;

  const start = Date.now();

  this.ejePnService.delete(this.ejeToDelete.ejePnId).subscribe({
    next: () => {
      this.loadEjes();
    },
    error: (err) => {
      console.error('Error al eliminar eje', err);
    },
    complete: () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(1000 - elapsed, 0); // espera mínimo 1 segundo

      setTimeout(() => {
        this.loading = false;
        this.ejeToDelete = null;
        this.showConfirmModal = false;
      }, delay);
    }
  });
}

  cancelDelete(): void {
    this.ejeToDelete = null;
    this.showConfirmModal = false;
  }

  createOrUpdateEje(): void {
    if (!this.newEje.nombre || !this.newEje.descripcion) return;

    this.loading = true;
    const request$ = this.isEditing && this.selectedEjeId !== null
      ? this.ejePnService.update(this.selectedEjeId, this.newEje)
      : this.ejePnService.createEje(this.newEje);

    request$.subscribe({
      next: (response) => {
        this.loadEjes();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al guardar eje', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
