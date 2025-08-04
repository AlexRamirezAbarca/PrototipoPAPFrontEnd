import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-add-meta-politica-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-meta-politica-modal.component.html'
})
export class AddMetaPoliticaModalComponent {
  @Input() visible = false;
  @Input() tipo: 'meta' | 'politica' = 'meta';
  @Input() objetivos: any[] = [];
  @Input() isEditing = false;
  @Input() datosEdicion: any = null;

  @Output() onClose = new EventEmitter();
  @Output() onGuardar = new EventEmitter();

  form = {
    objetivoId: null,
    nombre: '',
    descripcion: '',
  };

  ngOnChanges() {
    if (this.isEditing && this.datosEdicion) {
      this.form = {
        objetivoId: this.datosEdicion.objPnId,
        nombre: this.datosEdicion.nombre,
        descripcion: this.datosEdicion.descripcion,
      };
    }
  }

  cancelar() {
    this.onClose.emit();
  }

  guardar() {
    this.onGuardar.emit({ ...this.form, tipo: this.tipo });
  }
}
