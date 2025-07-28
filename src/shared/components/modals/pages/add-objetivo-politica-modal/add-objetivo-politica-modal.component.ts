import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObjetivoService } from '../../../../../app/home/pages/catalogs/services/objetivo-pn.service';
import { PoliticaPnService } from '../../../../../app/home/pages/catalogs/services/politica-pn.service';


@Component({
  standalone: true,
  selector: 'app-add-objetivo-politica-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-objetivo-politica-modal.component.html'
})
export class AddObjetivoPoliticaModalComponent implements OnInit {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() relacionCreada = new EventEmitter<{ ObjPnId: number; PoliticaPnId: number }>();

  objetivos: { objPnId: number; nombre: string }[] = [];
  politicas: { politicaPnId: number; nombre: string }[] = [];

  objId: number | null = null;
  politicaId: number | null = null;

  constructor(
    private objetivoService: ObjetivoService,
    private politicaService: PoliticaPnService
  ) {}

  ngOnInit(): void {
    this.objetivoService.getPaginated(1, 100).subscribe(res => {
      this.objetivos = res.data.data;
    });

    this.politicaService.getPaginated(1, 100).subscribe(res => {
      this.politicas = res.data.data;
    });
  }

  cancelar(): void {
    this.objId = null;
    this.politicaId = null;
    this.closed.emit();
  }

  crear(): void {
    if (this.objId && this.politicaId) {
      this.relacionCreada.emit({
        ObjPnId: this.objId,
        PoliticaPnId: this.politicaId
      });
      this.cancelar();
    }
  }
}
