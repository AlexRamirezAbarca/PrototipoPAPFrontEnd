import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../../../../shared/components/loader/pages/loader.component';
import { ConfirmModalComponent } from '../../../../../../shared/components/modals/pages/confirm-modal/confirm-modal.component';
import {
  CreatePoliticaPnRequest,
  PoliticaPn,
} from '../../../../models/politca-pn.models';
import { PoliticaPnService } from '../../services/politica-pn.service';

@Component({
  selector: 'app-politicas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // LoaderComponent,
    // ConfirmModalComponent,
  ],
  templateUrl: './politicas.component.html',
  styleUrl: './politicas.component.css',
})
export class PoliticasComponent implements OnInit {
  politicas: PoliticaPn[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  newPolitica: CreatePoliticaPnRequest = {
    nombre: '',
    descripcion: '',
  };

  showModal = false;
  isEditing = false;
  selectedPoliticaId: number | null = null;

  loading = false;
  showConfirmModal = false;
  politicaToDelete: PoliticaPn | null = null;

  ejeNombre: string = '';
  objetivoNombre: string = '';
  objetivoId: number = 0;

  nuevaPolitica = {
  nombre: '',
  descripcion: ''
};

listaPoliticas: { id?: number, nombre: string, descripcion: string }[] = [];

  constructor(
    private politicaService: PoliticaPnService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPoliticas();
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));

  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state || history.state;

  this.ejeNombre = state?.['ejeNombre'] || '';
  this.objetivoNombre = state?.['objetivoNombre'] || '';

  console.log('Objetivo:', this.objetivoNombre);
  console.log('Eje:', this.ejeNombre);
  }

  agregarPolitica(): void {
  if (!this.nuevaPolitica.nombre.trim()) return;

  const nueva = {
    id: this.listaPoliticas.length + 1,
    nombre: this.nuevaPolitica.nombre.trim(),
    descripcion: this.nuevaPolitica.descripcion.trim()
  };

  this.listaPoliticas.push(nueva);
  this.nuevaPolitica = { nombre: '', descripcion: '' };
}

editarPolitica(politica: any): void {
  console.log('Editar:', politica);
  // Aquí puedes implementar un modo edición o navegar a una vista de edición si lo deseas.
}

eliminarPolitica(politica: any): void {
  this.listaPoliticas = this.listaPoliticas.filter(p => p !== politica);
}

guardarTodo(): void {
  console.log('Guardar políticas:', this.listaPoliticas);
  // Aquí irá tu lógica real de guardado, probablemente llamando a un servicio.
}

  goBack(): void {
    this.router.navigate(['/metas-politicas']);
  }

  loadPoliticas(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.politicaService
      .getPaginated(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.politicas = data.data;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Error al obtener políticas paginadas', err);
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
      this.loadPoliticas();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPoliticas();
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.selectedPoliticaId = null;
    this.newPolitica = { nombre: '', descripcion: '' };
  }

  // editarPolitica(politica: PoliticaPn): void {
  //   this.selectedPoliticaId = politica.politicaPnId;
  //   this.newPolitica = {
  //     nombre: politica.nombre,
  //     descripcion: politica.descripcion,
  //   };
  //   this.isEditing = true;
  //   this.showModal = true;
  // }

  // eliminarPolitica(politica: PoliticaPn): void {
  //   this.politicaToDelete = politica;
  //   this.showConfirmModal = true;
  // }

  confirmDelete(): void {
    if (!this.politicaToDelete) return;

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    setTimeout(() => {
      this.politicaService
        .delete(this.politicaToDelete!.politicaPnId)
        .subscribe({
          next: () => {
            this.loadPoliticas();
          },
          error: (err) => {
            console.error('Error al eliminar política', err);
          },
          complete: () => {
            const elapsed = Date.now() - start;
            const delay = Math.max(1000 - elapsed, 0);

            setTimeout(() => {
              this.loading = false;
              this.politicaToDelete = null;
              this.showConfirmModal = false;
              this.cdr.detectChanges();
            }, delay);
          },
        });
    }, 0);
  }

  cancelDelete(): void {
    this.politicaToDelete = null;
    this.showConfirmModal = false;
  }

  createOrUpdatePolitica(): void {
    if (!this.newPolitica.nombre || !this.newPolitica.descripcion) {
      alert('Debe ingresar nombre y descripción');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const start = Date.now();

    const obs =
      this.isEditing && this.selectedPoliticaId !== null
        ? this.politicaService.update(this.selectedPoliticaId, this.newPolitica)
        : this.politicaService.create(this.newPolitica);

    obs.subscribe({
      next: (response) => {
        alert(response.message);
        this.loadPoliticas();
        setTimeout(() => this.cdr.detectChanges(), 100);
      },
      error: (err) => {
        console.error('Error al guardar política', err);
        alert('Ocurrió un error al guardar la política.');
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
