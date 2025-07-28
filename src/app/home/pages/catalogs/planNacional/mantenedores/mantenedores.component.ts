import { Component, OnInit } from '@angular/core';
import { PLAN_ARBOL_MOCK } from '../../../../models/plan-arbol.mock';

import { CommonModule } from '@angular/common';
import { AddObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-objetivo-modal/add-objetivo-modal.component';
import { AddMetaModalComponent } from '../../../../../../shared/components/modals/pages/add-meta-modal/add-meta-modal.component';
import { AddPoliticaModalComponent } from '../../../../../../shared/components/modals/pages/add-politicas-modal/add-politica-modal.component';
import { Eje, EjeObjetivoRelacion, Objetivo } from '../../../../models/eje-objetivo.model';
import { EjeObjetivoService } from '../../services/eje-objetivo.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mantenedores',
  imports: [CommonModule, AddObjetivoModalComponent, AddMetaModalComponent, AddPoliticaModalComponent],
  templateUrl: './mantenedores.component.html',
  styleUrl: './mantenedores.component.css'
})
export class MantenedoresComponent implements OnInit{
  relaciones: EjeObjetivoRelacion[] = [];
  modalVisible = false;
  metaModalVisible = false;
  politicaModalVisible = false;
  ejeSeleccionadoId: number | null = null;
  objetivoSeleccionadoId: number | null = null;

  ejesAgrupados: { eje: Eje, objetivos: Objetivo[] }[] = [];


  constructor(private ejeObjetivoService: EjeObjetivoService, private router : Router){}

  ngOnInit(): void {
  this.ejeObjetivoService.getRelacionesPaginadas(1, 100).subscribe({
    next: res => {
      this.relaciones = res.data;

      // Agrupar por eje
      const map = new Map<number, { eje: Eje; objetivos: Objetivo[] }>();

      for (const rel of this.relaciones) {
        if (!map.has(rel.eje.ejePnId)) {
          map.set(rel.eje.ejePnId, {
            eje: rel.eje,
            objetivos: []
          });
        }

        // Evita duplicados de objetivos
        const grupo = map.get(rel.eje.ejePnId)!;
        if (!grupo.objetivos.find(o => o.objPnId === rel.objetivo.objPnId)) {
          grupo.objetivos.push(rel.objetivo);
        }
      }

      this.ejesAgrupados = Array.from(map.values());
    },
    error: err => {
      console.error('Error al cargar relaciones', err);
    }
  });
}

  abrirModal(ejeId: number) {
    this.ejeSeleccionadoId = ejeId;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.ejeSeleccionadoId = null;
  }

  agregarObjetivo(nombre: string) {
    const eje = this.ejesAgrupados.find(e => e.eje.ejePnId === this.ejeSeleccionadoId);
const objetivo = this.ejesAgrupados.flatMap(e => e.objetivos).find(o => o.objPnId === this.objetivoSeleccionadoId);

  }

  abrirMetaModal(objId: number) {
  this.objetivoSeleccionadoId = objId;
  this.metaModalVisible = true;
}

abrirPoliticaModal(objId: number) {
  this.objetivoSeleccionadoId = objId;
  this.politicaModalVisible = true;
}

agregarMeta(nombre: string) {
 const eje = this.ejesAgrupados.find(e => e.eje.ejePnId === this.ejeSeleccionadoId);
const objetivo = this.ejesAgrupados.flatMap(e => e.objetivos).find(o => o.objPnId === this.objetivoSeleccionadoId);
}

agregarPolitica(nombre: string) {
  const eje = this.ejesAgrupados.find(e => e.eje.ejePnId === this.ejeSeleccionadoId);
const objetivo = this.ejesAgrupados.flatMap(e => e.objetivos).find(o => o.objPnId === this.objetivoSeleccionadoId);
}

 goBack() {
    this.router.navigate(['/catalogos']);
  }

}
