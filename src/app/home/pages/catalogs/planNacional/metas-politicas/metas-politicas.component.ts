import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EjeObjetivoService } from '../../services/eje-objetivo.service';
import {
  Eje,
  EjeObjetivoRelacion,
  Meta,
  Politica,
} from '../../../../models/eje-objetivo.model';
import { AddMetaPoliticaModalComponent } from '../../../../../../shared/components/modals/pages/add-meta-politica-modal.component/add-meta-politica-modal.component';
import { MetaPnService } from '../../services/meta-pn.service';
import { PoliticaPnService } from '../../services/politica-pn.service';
import { ObjetivoMetaService } from '../../services/objetivo-meta.service';
import { ObjetivoPoliticaService } from '../../services/objetivo-politica.service';
// Ajusta el path si es necesario

interface ObjetivoExtendido {
  objPnId: number;
  nombre: string;
  descripcion: string;
  estado: string;
  metas: Meta[];
  politicas: Politica[];
}

interface EjeAgrupado {
  eje: Eje;
  objetivos: ObjetivoExtendido[];
}

@Component({
  selector: 'app-metas-politicas',
  standalone: true,
  imports: [CommonModule, RouterModule, AddMetaPoliticaModalComponent],
  templateUrl: './metas-politicas.component.html',
  styleUrls: ['./metas-politicas.component.css'],
})
export class MetasPoliticasComponent implements OnInit {
  relacionesAgrupadas: EjeAgrupado[] = [];
  loading = false;

  showModal = false;
  modalTipo: 'meta' | 'politica' = 'meta';
  selectedObjetivoId: number | null = null;

  // Para el formulario
  nombreRelacion = '';
  descripcionRelacion = '';

  objetivosList: ObjetivoExtendido[] = [];

  constructor(
    private relacionesService: EjeObjetivoService,
    private metaService : MetaPnService,
    private politcaService : PoliticaPnService,
    private objetivoMetaService : ObjetivoMetaService,
    private objetivoPoliticaService : ObjetivoPoliticaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRelaciones();
  }

   abrirModal(tipo: 'meta' | 'politica', objetivoId: number) {
    this.modalTipo = tipo;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }

  goBack() {
    this.router.navigate(['/catalogos']);
  }

  cargarRelaciones(): void {
    this.loading = true;

    this.relacionesService.getRelacionesPaginadas(1, 100).subscribe({
      next: (res) => {
        this.relacionesAgrupadas = this.agruparPorEje(res.data);
      },
      error: (err) => {
        console.error('Error al cargar relaciones:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  agruparPorEje(data: EjeObjetivoRelacion[]): EjeAgrupado[] {
    const agrupadoMap = new Map<number, EjeAgrupado>();

    for (const item of data) {
      const ejeId = item.eje.ejePnId;

      if (!agrupadoMap.has(ejeId)) {
        agrupadoMap.set(ejeId, {
          eje: item.eje,
          objetivos: [],
        });
      }

      const grupo = agrupadoMap.get(ejeId)!;
      grupo.objetivos.push({
        objPnId: item.objetivo.objPnId,
        nombre: item.objetivo.nombre,
        descripcion: item.objetivo.descripcion,
        estado: item.estado,
        metas: item.objetivo.metas,
        politicas: item.objetivo.politicas,
      });
    }

    return Array.from(agrupadoMap.values());
  }

  guardarRelacion(event: { tipo: 'meta' | 'politica'; nombre: string; descripcion: string; objetivoId: number }) {
    const { tipo, nombre, descripcion, objetivoId } = event;

    if (!objetivoId || !nombre.trim()) return;

    if (tipo === 'meta') {
      // Primero creamos la meta
      this.metaService.create({ nombre, descripcion }).subscribe({
        next: (nuevaMeta) => {
          // Luego creamos la relación
          this.objetivoMetaService.crearRelacion({ obj_pn_id: objetivoId, meta_pn_id: nuevaMeta.data.metaPnId }).subscribe({
            next: () => {
              this.cargarRelaciones();
              this.cerrarModal();
            },
            error: (err) => console.error('Error al relacionar meta:', err),
          });
        },
        error: (err) => console.error('Error al crear meta:', err),
      });
    } else {
      // Primero creamos la política
      this.politcaService.create({ nombre, descripcion }).subscribe({
        next: (nuevaPolitica) => {
          // Luego creamos la relación
          this.objetivoPoliticaService.crearRelacion({ ObjPnId: objetivoId, PoliticaPnId: nuevaPolitica.data.politicaPnId }).subscribe({
            next: () => {
              this.cargarRelaciones();
              this.cerrarModal();
            },
            error: (err) => console.error('Error al relacionar política:', err),
          });
        },
        error: (err) => console.error('Error al crear política:', err),
      });
    }
  }
}


