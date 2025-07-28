import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObjetivoService } from '../../../../../app/home/pages/catalogs/services/objetivo-pn.service';
import { MetaPnService } from '../../../../../app/home/pages/catalogs/services/meta-pn.service';


@Component({
  standalone: true,
  selector: 'app-add-objetivo-meta-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-objetivo-meta-modal.component.html'
})
export class AddObjetivoMetaModalComponent implements OnInit {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() relacionCreada = new EventEmitter<{ obj_pn_id: number; meta_pn_id: number }>();

  objetivos: { objPnId: number; nombre: string }[] = [];
  metas: { metaPnId: number; nombre: string }[] = [];

  objId: number | null = null;
  metaId: number | null = null;

  constructor(
    private objetivoService: ObjetivoService,
    private metaService: MetaPnService
  ) {}

  ngOnInit(): void {
    this.objetivoService.getPaginated(1, 100).subscribe(res => {
      this.objetivos = res.data.data;
    });

    this.metaService.getPaginated(1, 100).subscribe(res => {
      this.metas = res.data.data;
    });
  }

  cancelar(): void {
    this.objId = null;
    this.metaId = null;
    this.closed.emit();
  }

  crear(): void {
    if (this.objId && this.metaId) {
      this.relacionCreada.emit({
        obj_pn_id: this.objId,
        meta_pn_id: this.metaId
      });
      this.cancelar();
    }
  }
}
