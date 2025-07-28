import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateEjePnRequest, EjePn } from '../../../../models/eje-pn.model';
import { EjePnService } from '../../services/eje-pn.service';
import { LoaderComponent } from '../../../../../../shared/components/loader/pages/loader.component';
import { ConfirmModalComponent } from '../../../../../../shared/components/modals/pages/confirm-modal/confirm-modal.component';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-ejes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmModalComponent,
  ],
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

  constructor(
    private http: HttpClient,
    private ejePnService: EjePnService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEjes();
  }

  loadEjes(): void {
    this.loading = true;
    this.cdr.detectChanges();

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
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }, 300); // puedes dejar este en 300-500 ms para UX más suave
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

  goBack() {
    this.router.navigate(['/catalogos']);
  }

  eliminarEje(eje: EjePn): void {
    this.ejeToDelete = eje;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (!this.ejeToDelete) return;

    this.loading = true;
    this.cdr.detectChanges(); // 🔥 fuerza el render del loader

    const start = Date.now();

    setTimeout(() => {
      this.ejePnService.delete(this.ejeToDelete!.ejePnId).subscribe({
        next: () => {
          this.loadEjes();
        },
        error: (err) => {
          console.error('Error al eliminar eje', err);
        },
        complete: () => {
          const elapsed = Date.now() - start;
          const delay = Math.max(1000 - elapsed, 0);

          setTimeout(() => {
            this.loading = false;
            this.ejeToDelete = null;
            this.showConfirmModal = false;
            this.cdr.detectChanges();
          }, delay);
        },
      });
    }, 0);
  }

  cancelDelete(): void {
    this.ejeToDelete = null;
    this.showConfirmModal = false;
  }

  createOrUpdateEje(): void {
    if (!this.newEje.nombre || !this.newEje.descripcion) {
      alert('Debe ingresar nombre y descripción');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges(); // 🔥 renderiza el loader

    const start = Date.now();

    const obs =
      this.isEditing && this.selectedEjeId !== null
        ? this.ejePnService.update(this.selectedEjeId, this.newEje)
        : this.ejePnService.createEje(this.newEje);

    obs.subscribe({
      next: (response) => {
        alert(response.message);
        this.loadEjes();
      },
      error: (err) => {
        console.error('Error al guardar eje', err);
        alert('Ocurrió un error al guardar el eje.');
      },
      complete: () => {
        const elapsed = Date.now() - start;
        const delay = Math.max(1000 - elapsed, 0);

        setTimeout(() => {
          this.loading = false;
          this.closeModal();
          this.cdr.detectChanges(); // 🔄 actualiza la vista final
        }, delay);
      },
    });
  }
}
