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
import { EjeObjetivoService } from '../../services/eje-objetivo.service';
import { EjePnService } from '../../services/eje-pn.service';

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

  ejesAgrupados: { eje: any; objetivos: any[] }[] = [];

  ejesId: { ejePnId: number; nombre: string }[] = [];
  selectedEjeId: number | null = null;

  constructor(
    private objetivoService: ObjetivoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ejeObjetivo: EjeObjetivoService,
    private ejeService: EjePnService
  ) {}

  ngOnInit(): void {
    this.loadObjetivos();
    this.ejeService.getPaginated(1, 100).subscribe((res) => {
      this.ejesId = res.data.data;
    });
  }

  goBack() {
    this.router.navigate(['/plan-nacional']);
  }

  // loadObjetivos(): void {
  //   this.loading = true;
  //   this.cdr.detectChanges();

  //   this.objetivoService
  //     .getPaginated(this.currentPage, this.pageSize)
  //     .subscribe({
  //       next: (response) => {
  //         const data = response.data;
  //         this.objetivos = data.data;
  //         this.currentPage = data.currentPage;
  //         this.pageSize = data.pageSize;
  //         this.totalPages = data.totalPages;
  //       },
  //       error: (err) => {
  //         console.error('Error al obtener objetivos paginados', err);
  //       },
  //       complete: () => {
  //         setTimeout(() => {
  //           this.loading = false;
  //           this.cdr.detectChanges();
  //         }, 300);
  //       },
  //     });
  // }

  loadObjetivos(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.ejeObjetivo
      .getRelacionesPaginadas(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;

          const agrupados: { [key: number]: { eje: any; objetivos: any[] } } =
            {};
          for (const relacion of data.data) {
            const ejeId = relacion.eje.ejePnId;
            if (!agrupados[ejeId]) {
              agrupados[ejeId] = { eje: relacion.eje, objetivos: [] };
            }
            agrupados[ejeId].objetivos.push({
              ...relacion.objetivo,
              fechaCreacion: relacion.fechaCreacion,
              estado: relacion.estado,
            });
          }

          this.ejesAgrupados = Object.values(agrupados);
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
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
    if (
      !this.newObjetivo.nombre ||
      !this.newObjetivo.descripcion ||
      !this.selectedEjeId
    ) {
      alert('Debe completar todos los campos (incluyendo eje).');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    if (this.isEditing && this.selectedObjetivoId !== null) {
      // Modo edición normal
      this.objetivoService
        .update(this.selectedObjetivoId, this.newObjetivo)
        .subscribe({
          next: (response) => {
            alert(response.message);
            this.loadObjetivos();
          },
          error: (err) => {
            console.error('Error al actualizar objetivo', err);
            alert('Ocurrió un error al actualizar el objetivo.');
          },
          complete: () => {
            this.finalizarOperacion(start);
          },
        });
    } else {
      // Modo creación con relación
      this.objetivoService.create(this.newObjetivo).subscribe({
        next: (response) => {
          const objPnId = response.data.objPnId;

          // Crear relación eje ↔ objetivo
          this.ejeObjetivo
            .createRelacionEjeObjetivo({ ejePnId: this.selectedEjeId!, objPnId })
            .subscribe({
              next: () => {
                alert('Objetivo y relación creados correctamente.');
                this.loadObjetivos();
              },
              error: (err) => {
                console.error('Error al crear relación eje-objetivo', err);
                alert(
                  'El objetivo fue creado, pero ocurrió un error al relacionarlo con el eje.'
                );
              },
              complete: () => {
                this.finalizarOperacion(start);
              },
            });
        },
        error: (err) => {
          console.error('Error al crear objetivo', err);
          alert('Ocurrió un error al crear el objetivo.');
          this.finalizarOperacion(start);
        },
      });
    }
  }

  private finalizarOperacion(start: number) {
    const elapsed = Date.now() - start;
    const delay = Math.max(1000 - elapsed, 0);

    setTimeout(() => {
      this.loading = false;
      this.closeModal();
      this.cdr.detectChanges();
    }, delay);
  }
}
