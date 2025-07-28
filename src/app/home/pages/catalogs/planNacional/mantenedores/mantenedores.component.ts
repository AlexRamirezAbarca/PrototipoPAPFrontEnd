import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AddObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-objetivo-modal/add-objetivo-modal.component';
import { AddMetaModalComponent } from '../../../../../../shared/components/modals/pages/add-meta-modal/add-meta-modal.component';
import { AddPoliticaModalComponent } from '../../../../../../shared/components/modals/pages/add-politicas-modal/add-politica-modal.component';
import { AddEjeObjetivoModalComponent } from '../../../../../../shared/components/modals/pages/add-eje-objetivo-modal/add-eje-objetivo-modal.component';

import { Eje, EjeObjetivoRelacion, Objetivo } from '../../../../models/eje-objetivo.model';
import { EjeObjetivoService } from '../../services/eje-objetivo.service';

@Component({
  selector: 'app-mantenedores',
  standalone: true,
  imports: [
    CommonModule,
    AddObjetivoModalComponent,
    AddMetaModalComponent,
    AddPoliticaModalComponent,
    AddEjeObjetivoModalComponent
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

  // ID seleccionados
  ejeSeleccionadoId: number | null = null;
  objetivoSeleccionadoId: number | null = null;

  constructor(
    private ejeObjetivoService: EjeObjetivoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recargarRelaciones();
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

  // Agrupamiento por eje
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

  // Modal: crear nueva relación Eje-Objetivo
  abrirModalRelacion(): void {
    this.modalRelacionVisible = true;
  }

  crearRelacionEjeObjetivo(rel: { ejePnId: number; objPnId: number }): void {
    this.ejeObjetivoService.createRelacionEjeObjetivo(rel).subscribe({
      next: () => this.recargarRelaciones(),
      error: err => console.error('Error al crear relación:', err)
    });
  }

  // Modal: añadir objetivo (dummy aún)
  abrirModal(ejeId: number): void {
    this.ejeSeleccionadoId = ejeId;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.ejeSeleccionadoId = null;
  }

  agregarObjetivo(nombre: string): void {
    // En futuras versiones podrás usar este para crear objetivos directamente
    console.log('Agregar objetivo (no implementado)', nombre);
  }

  abrirMetaModal(objId: number): void {
    this.objetivoSeleccionadoId = objId;
    this.metaModalVisible = true;
  }

  abrirPoliticaModal(objId: number): void {
    this.objetivoSeleccionadoId = objId;
    this.politicaModalVisible = true;
  }

  agregarMeta(nombre: string): void {
    // Futura lógica de POST objetivo-meta
    console.log('Agregar meta (no implementado)', nombre);
  }

  agregarPolitica(nombre: string): void {
    // Futura lógica de POST objetivo-política
    console.log('Agregar política (no implementado)', nombre);
  }

  goBack(): void {
    this.router.navigate(['/catalogos']);
  }
}
