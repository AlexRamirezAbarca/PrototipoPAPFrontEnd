import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MetaPnService } from '../../../../../app/home/pages/catalogs/services/meta-pn.service';
import { ObjetivoMetaService } from '../../../../../app/home/pages/catalogs/services/objetivo-meta.service';
import { MetaPn } from '../../../../../app/home/models/meta-pn.model';

@Component({
  selector: 'app-add-meta-to-objetivo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-meta-to-objetivo-modal.component.html'
})
export class AddMetaToObjetivoModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() objPnId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() relacionCreada = new EventEmitter<void>();

  metasDisponibles: MetaPn[] = [];
  metaSeleccionadaId: number | null = null;

  constructor(
    private metaService: MetaPnService,
    private objetivoMetaService: ObjetivoMetaService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true && this.objPnId) {
      this.cargarMetas();
    }
  }

  cargarMetas(): void {
    this.metaService.getPaginated(1, 100).subscribe({
      next: res => {
        this.metasDisponibles = res.data.data;
      },
      error: err => console.error('Error cargando metas', err)
    });
  }

  guardarRelacion(): void {
    if (!this.metaSeleccionadaId) return;

    const payload = {
      obj_pn_id: this.objPnId,
      meta_pn_id: this.metaSeleccionadaId
    };

    this.objetivoMetaService.crearRelacion(payload).subscribe({
      next: () => {
        this.relacionCreada.emit();
        this.cerrar();
      },
      error: err => console.error('Error al guardar relación', err)
    });
  }

  cerrar(): void {
    this.metaSeleccionadaId = null;
    this.closed.emit();
  }
}
