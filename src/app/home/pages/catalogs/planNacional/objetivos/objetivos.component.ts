import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ObjetivoService } from '../../services/objetivo-pn.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../../../../shared/components/loader/pages/loader.component';
import { ConfirmModalComponent } from '../../../../../../shared/components/modals/pages/confirm-modal/confirm-modal.component';
import {
  CreateObjetivoPnRequest,
  Objetivo,
} from '../../../../models/objetivo-pn.model';

@Component({
  selector: 'app-objetivos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css',
})
export class ObjetivosComponent implements OnInit {
  objetivos: Objetivo[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  newObjetivo: CreateObjetivoPnRequest = {
    nombre: '',
    descripcion: '',
  };

  showModal = false;
  isEditing = false;
  selectedObjetivoId: number | null = null;

  loading = false;
  showConfirmModal = false;
  objetivoToDelete: Objetivo | null = null;

  constructor(
    private objetivoService: ObjetivoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadObjetivos();
  }

  goBack() {
    this.router.navigate(['/catalogos']);
  }

  loadObjetivos(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.objetivoService
      .getPaginated(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.objetivos = data.data;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Error al obtener objetivos paginados', err);
        },
        complete: () => {
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
          }, 300);
        },
      });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadObjetivos();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadObjetivos();
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.selectedObjetivoId = null;
    this.newObjetivo = { nombre: '', descripcion: '' };
  }

  editarObjetivo(objetivo: Objetivo): void {
    this.selectedObjetivoId = objetivo.objPnId;
    this.newObjetivo = {
      nombre: objetivo.nombre,
      descripcion: objetivo.descripcion,
    };
    this.isEditing = true;
    this.showModal = true;
  }

  eliminarObjetivo(objetivo: Objetivo): void {
    this.objetivoToDelete = objetivo;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (!this.objetivoToDelete) return;

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    setTimeout(() => {
      this.objetivoService.delete(this.objetivoToDelete!.objPnId).subscribe({
        next: () => {
          this.loadObjetivos();
        },
        error: (err) => {
          console.error('Error al eliminar objetivo', err);
        },
        complete: () => {
          const elapsed = Date.now() - start;
          const delay = Math.max(1000 - elapsed, 0);

          setTimeout(() => {
            this.loading = false;
            this.objetivoToDelete = null;
            this.showConfirmModal = false;
            this.cdr.detectChanges();
          }, delay);
        },
      });
    }, 0);
  }

  cancelDelete(): void {
    this.objetivoToDelete = null;
    this.showConfirmModal = false;
  }

  createOrUpdateObjetivo(): void {
    if (!this.newObjetivo.nombre || !this.newObjetivo.descripcion) {
      alert('Debe ingresar nombre y descripción');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    const obs =
      this.isEditing && this.selectedObjetivoId !== null
        ? this.objetivoService.update(this.selectedObjetivoId, this.newObjetivo)
        : this.objetivoService.create(this.newObjetivo);

    obs.subscribe({
      next: (response) => {
        alert(response.message);
        this.loadObjetivos();
      },
      error: (err) => {
        console.error('Error al guardar objetivo', err);
        alert('Ocurrió un error al guardar el objetivo.');
      },
      complete: () => {
        const elapsed = Date.now() - start;
        const delay = Math.max(1000 - elapsed, 0);

        setTimeout(() => {
          this.loading = false;
          this.closeModal();
          this.cdr.detectChanges();
        }, delay);
      },
    });
  }
}
