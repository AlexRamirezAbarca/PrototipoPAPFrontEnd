import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoliticaPn } from '../../../../../app/home/models/politca-pn.models';
import { PoliticaPnService } from '../../../../../app/home/pages/catalogs/services/politica-pn.service';
import { ObjetivoPoliticaService } from '../../../../../app/home/pages/catalogs/services/objetivo-politica.service';


@Component({
  selector: 'app-add-politica-to-objetivo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-politica-to-objetivo-modal.component.html'
})
export class AddPoliticaToObjetivoModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() objPnId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() relacionCreada = new EventEmitter<void>();

  politicasDisponibles: PoliticaPn[] = [];
  politicaSeleccionadaId: number | null = null;

  constructor(
    private politicaService: PoliticaPnService,
    private objetivoPoliticaService: ObjetivoPoliticaService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true && this.objPnId) {
      this.cargarPoliticas();
    }
  }

  cargarPoliticas(): void {
  console.log('📥 Cargando políticas desde servicio...');
  this.politicaService.getPaginated(1, 100).subscribe({
    next: res => {
      console.log('✅ Políticas cargadas:', res);
      this.politicasDisponibles = res.data.data;
    },
    error: err => console.error('Error cargando políticas', err)
  });
}

  guardarRelacion(): void {
    if (!this.politicaSeleccionadaId) return;

    const payload = {
      ObjPnId: this.objPnId,
      PoliticaPnId: this.politicaSeleccionadaId
    };

    this.objetivoPoliticaService.crearRelacion(payload).subscribe({
      next: () => {
        this.relacionCreada.emit();
        this.cerrar();
      },
      error: err => console.error('Error al guardar relación', err)
    });
  }

  cerrar(): void {
    this.politicaSeleccionadaId = null;
    this.closed.emit();
  }
}
