import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjePnService } from '../../../../../app/home/pages/catalogs/services/eje-pn.service';
import { ObjetivoService } from '../../../../../app/home/pages/catalogs/services/objetivo-pn.service';


@Component({
  standalone: true,
  selector: 'app-add-eje-objetivo-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-eje-objetivo-modal.component.html'
})
export class AddEjeObjetivoModalComponent implements OnInit {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() relacionCreada = new EventEmitter<{ ejePnId: number; objPnId: number }>();

  ejes: { ejePnId: number; nombre: string }[] = [];
  objetivos: { objPnId: number; nombre: string }[] = [];

  ejeId: number | null = null;
  objetivoId: number | null = null;

  constructor(
    private ejeService: EjePnService,
    private objetivoService: ObjetivoService
  ) {}

  ngOnInit(): void {
    this.ejeService.getPaginated(1, 100).subscribe(res => {
      this.ejes = res.data.data;
    });

    this.objetivoService.getPaginated(1, 100).subscribe(res => {
      this.objetivos = res.data.data;
    });
  }

  cancelar() {
    this.ejeId = null;
    this.objetivoId = null;
    this.closed.emit();
  }

  crear() {
    if (this.ejeId && this.objetivoId) {
      this.relacionCreada.emit({ ejePnId: this.ejeId, objPnId: this.objetivoId });
      this.cancelar();
    }
  }
}
