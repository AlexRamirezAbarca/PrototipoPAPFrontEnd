import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AddObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-objetivo-modal/add-objetivo-modal.component';
import { AddEjeObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-eje-objetivo-modal/add-eje-objetivo-modal.component';

import { Eje, EjeObjetivoRelacion, Objetivo } from '../../../../models/eje-objetivo.model';
import { EjeObjetivoService } from '../../services/eje-objetivo.service';
import { AddObjetivoMetaModalComponent } from '../../../../../../shared/components/modals/pages/add-objetivo-meta-modal/add-objetivo-meta-modal.component';
import { ObjetivoMetaService } from '../../services/objetivo-meta.service';
import { ObjetivoPoliticaService } from '../../services/objetivo-politica.service';
import { AddObjetivoPoliticaModalComponent } from '../../../../../../shared/components/modals/pages/add-objetivo-politica-modal/add-objetivo-politica-modal.component';
import { AddMetaToObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-meta-to-objetivo-modal/add-meta-to-objetivo-modal.component';
import { AddPoliticaToObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-politica-to-objetivo-modal/add-politica-to-objetivo-modal.component';

@Component({
  selector: 'app-mantenedores',
  standalone: true,
  imports: [
    CommonModule,
    AddObjetivoModalComponent,
    AddEjeObjetivoModalComponent,
    AddObjetivoMetaModalComponent,
    AddObjetivoPoliticaModalComponent,
    AddMetaToObjetivoModalComponent,
    AddPoliticaToObjetivoModalComponent,
  ],
  templateUrl: './mantenedores.component.html',
  styleUrl: './mantenedores.component.css'
})
export class MantenedoresComponent implements OnInit {
  relaciones: EjeObjetivoRelacion[] = [];
  ejesAgrupados: { eje: Eje; objetivos: Objetivo[] }[] = [];

  // Modal flags
  modalVisible = false;
  metaModalVisible = false;
  politicaModalVisible = false;
  modalRelacionVisible = false;
  modalObjetivoMetaVisible = false;
  modalObjetivoPoliticaVisible = false;

  // ID seleccionados
  ejeSeleccionadoId: number | null = null;
  objetivoSeleccionadoId: number | null = null;

  // 🔥 Nuevos para modales contextuales
  selectedObjPnId: number | null = null;
  modalMetaVisible = false;
  modalPoliticaVisible = false;

  constructor(
    private ejeObjetivoService: EjeObjetivoService,
    private router: Router,
    private objetivoMetaService: ObjetivoMetaService,
    private objetivoPoliticaService: ObjetivoPoliticaService
  ) {}

  ngOnInit(): void {
    this.recargarRelaciones();
  }

  // Relación global (padre)
  abrirModalRelacion(): void {
    this.modalRelacionVisible = true;
  }

  crearRelacionEjeObjetivo(rel: { ejePnId: number; objPnId: number }): void {
    this.ejeObjetivoService.createRelacionEjeObjetivo(rel).subscribe({
      next: () => this.recargarRelaciones(),
      error: err => console.error('Error al crear relación:', err)
    });
  }

  abrirModal(ejeId: number): void {
    this.ejeSeleccionadoId = ejeId;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.ejeSeleccionadoId = null;
  }

  agregarObjetivo(nombre: string): void {
    console.log('Agregar objetivo (no implementado)', nombre);
  }

  // 🔁 Recarga desde backend
  recargarRelaciones(): void {
    this.ejeObjetivoService.getRelacionesPaginadas(1, 100).subscribe({
      next: res => {
        this.relaciones = res.data;
        this.agruparPorEje();
      },
      error: err => console.error('Error al cargar relaciones', err)
    });
  }

  agruparPorEje(): void {
    const map = new Map<number, { eje: Eje; objetivos: Objetivo[] }>();

    for (const rel of this.relaciones) {
      if (!map.has(rel.eje.ejePnId)) {
        map.set(rel.eje.ejePnId, {
          eje: rel.eje,
          objetivos: []
        });
      }

      const grupo = map.get(rel.eje.ejePnId)!;
      if (!grupo.objetivos.find(o => o.objPnId === rel.objetivo.objPnId)) {
        grupo.objetivos.push(rel.objetivo);
      }
    }

    this.ejesAgrupados = Array.from(map.values());
  }

  eliminarRelacionEjeObjetivo(objId: number, ejeId: number): void {
    const relacion = this.relaciones.find(
      r => r.eje.ejePnId === ejeId && r.objetivo.objPnId === objId
    );

    if (!relacion) {
      console.warn('Relación no encontrada para eliminar');
      return;
    }

    if (confirm('¿Estás seguro de eliminar esta relación Eje - Objetivo?')) {
      this.ejeObjetivoService.deleteRelacion(relacion.ejeObjetivoPnId).subscribe({
        next: () => this.recargarRelaciones(),
        error: err => console.error('Error al eliminar relación:', err)
      });
    }
  }

  // -----------------------------
  // 🔥 NUEVA LÓGICA CONTEXTUAL
  // -----------------------------
  abrirModalRelacionMeta(objPnId: number): void {
    this.selectedObjPnId = objPnId;
    this.modalMetaVisible = true;
  }

  abrirModalRelacionPolitica(objPnId: number): void {
    this.selectedObjPnId = objPnId;
    this.modalPoliticaVisible = true;
  }

  actualizarRelaciones(): void {
    this.recargarRelaciones();
  }

  // -----------------------------
  // Otros modales globales (no contextualizados)
  // -----------------------------
  abrirModalObjetivoMeta(): void {
    this.modalObjetivoMetaVisible = true;
  }

  crearRelacionObjetivoMeta(rel: { obj_pn_id: number; meta_pn_id: number }): void {
    this.objetivoMetaService.crearRelacion(rel).subscribe({
      next: () => this.recargarRelaciones(),
      error: err => console.error('Error al crear relación meta', err)
    });
  }

  abrirModalObjetivoPolitica(): void {
    this.modalObjetivoPoliticaVisible = true;
  }

  crearRelacionObjetivoPolitica(rel: { ObjPnId: number; PoliticaPnId: number }): void {
    this.objetivoPoliticaService.crearRelacion(rel).subscribe({
      next: () => this.recargarRelaciones(),
      error: err => console.error('Error al crear relación política', err)
    });
  }

  // Navegación
  goBack(): void {
    this.router.navigate(['/catalogos']);
  }
}
