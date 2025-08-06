import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../../../../shared/components/loader/pages/loader.component';
import { ConfirmModalComponent } from '../../../../../../shared/components/modals/pages/confirm-modal/confirm-modal.component';
import { CreateMetaPnRequest, MetaPn } from '../../../../models/meta-pn.model';
import { MetaPnService } from '../../services/meta-pn.service';
import { ObjetivoMetaService } from '../../services/objetivo-meta.service';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // LoaderComponent,
    // ConfirmModalComponent,
  ],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css',
})
export class MetasComponent implements OnInit {
  metas: MetaPn[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  newMeta: CreateMetaPnRequest = {
    nombre: '',
    descripcion: '',
  };

  showModal = false;
  isEditing = false;
  selectedMetaId: number | null = null;

  // loading = false;
  showConfirmModal = false;
  metaToDelete: MetaPn | null = null;

  ejeNombre: string = '';
  objetivoNombre: string = '';
  objetivoId: number = 0;

  nuevaMeta = { nombre: '', descripcion: '' };
  listaMetas: { id?: number; nombre: string; descripcion: string }[] = [];

  loading = false;

  constructor(
    private metaService: MetaPnService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private objetivoMeta : ObjetivoMetaService
  ) {}

  ngOnInit(): void {
    this.loadMetas();
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));

  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state || history.state;

  this.ejeNombre = state?.['ejeNombre'] || '';
  this.objetivoNombre = state?.['objetivoNombre'] || '';

  console.log('Objetivo:', this.objetivoNombre);
  console.log('Eje:', this.ejeNombre);
  }

  goBack(): void {
    this.router.navigate(['/metas-politicas']);
  }

  // Agregar meta a la lista temporal
  agregarMeta(): void {
    if (!this.nuevaMeta.nombre.trim()) return;

    const nueva = {
      id: this.listaMetas.length + 1,
      nombre: this.nuevaMeta.nombre.trim(),
      descripcion: this.nuevaMeta.descripcion.trim()
    };

    this.listaMetas.push(nueva);
    this.nuevaMeta = { nombre: '', descripcion: '' };
  }

  // Editar meta en lista
  editarMeta(meta: any): void {
    console.log('Editar:', meta);
    // Aquí podrías implementar un modo edición similar al de políticas
  }

  // Eliminar meta de lista
  eliminarMeta(meta: any): void {
    this.listaMetas = this.listaMetas.filter(m => m !== meta);
  }

  // Guardar lote con relación
  guardarTodo(): void {
    if (this.listaMetas.length === 0) {
      alert('Debe agregar al menos una meta antes de guardar.');
      return;
    }

    const payload = {
      objetivoId: this.objetivoId,
      metas: this.listaMetas.map(m => ({
        nombre: m.nombre,
        descripcion: m.descripcion
      }))
    };

    this.loading = true;
    this.cdr.detectChanges();

    this.objetivoMeta.crearMetasConRelacion(payload).subscribe({
      next: (response) => {
        alert('Metas y relaciones guardadas correctamente.');
        this.listaMetas = [];
        this.router.navigate(['/metas-politicas']);
      },
      error: (err) => {
        console.error('Error al guardar metas:', err);
        alert('Ocurrió un error al guardar las metas.');
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  loadMetas(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.metaService.getPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const data = response.data;
        this.metas = data.data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Error al obtener metas paginadas', err);
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
      this.loadMetas();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMetas();
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.selectedMetaId = null;
    this.newMeta = { nombre: '', descripcion: '' };
  }

  // editarMeta(meta: MetaPn): void {
  //   this.selectedMetaId = meta.metaPnId;
  //   this.newMeta = {
  //     nombre: meta.nombre,
  //     descripcion: meta.descripcion,
  //   };
  //   this.isEditing = true;
  //   this.showModal = true;
  // }

  // eliminarMeta(meta: MetaPn): void {
  //   this.metaToDelete = meta;
  //   this.showConfirmModal = true;
  // }

  confirmDelete(): void {
    if (!this.metaToDelete) return;

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    setTimeout(() => {
      this.metaService.delete(this.metaToDelete!.metaPnId).subscribe({
        next: () => {
          this.loadMetas();
        },
        error: (err) => {
          console.error('Error al eliminar meta', err);
        },
        complete: () => {
          const elapsed = Date.now() - start;
          const delay = Math.max(1000 - elapsed, 0);

          setTimeout(() => {
            this.loading = false;
            this.metaToDelete = null;
            this.showConfirmModal = false;
            this.cdr.detectChanges();
          }, delay);
        },
      });
    }, 0);
  }

  cancelDelete(): void {
    this.metaToDelete = null;
    this.showConfirmModal = false;
  }

  createOrUpdateMeta(): void {
    if (!this.newMeta.nombre || !this.newMeta.descripcion) {
      alert('Debe ingresar nombre y descripción');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    const obs =
      this.isEditing && this.selectedMetaId !== null
        ? this.metaService.update(this.selectedMetaId, this.newMeta)
        : this.metaService.create(this.newMeta);

    obs.subscribe({
      next: (response) => {
        alert(response.message);
        this.loadMetas();
      },
      error: (err) => {
        console.error('Error al guardar meta', err);
        alert('Ocurrió un error al guardar la meta.');
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
