import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-meta-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" *ngIf="visible">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Añadir nueva meta</h3>

        <label class="block mb-2 text-sm font-medium text-gray-700">Nombre de la meta:</label>
        <input
          type="text"
          [(ngModel)]="nombreMeta"
          class="w-full px-3 py-2 border rounded-md"
          placeholder="Ej: Reducir analfabetismo"
        />

        <div class="flex justify-end mt-6 gap-3">
          <button (click)="cancelar()" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button (click)="crear()" [disabled]="!nombreMeta" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Crear
          </button>
        </div>
      </div>
    </div>
  `
})
export class AddMetaModalComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() metaCreada = new EventEmitter<string>();

  nombreMeta = '';

  cancelar() {
    this.nombreMeta = '';
    this.closed.emit();
  }

  crear() {
    if (this.nombreMeta.trim()) {
      this.metaCreada.emit(this.nombreMeta.trim());
      this.nombreMeta = '';
      this.closed.emit();
    }
  }
}
