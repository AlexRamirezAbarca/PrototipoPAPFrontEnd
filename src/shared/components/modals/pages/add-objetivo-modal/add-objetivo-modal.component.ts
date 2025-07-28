import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-objetivo-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" *ngIf="visible">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Añadir nuevo objetivo</h3>

        <label class="block mb-2 text-sm font-medium text-gray-700">Nombre del objetivo:</label>
        <input
          type="text"
          [(ngModel)]="nombreObjetivo"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          placeholder="Ej: Mejorar la educación básica"
        />

        <div class="flex justify-end mt-6 gap-3">
          <button (click)="cancelar()" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button (click)="crear()" [disabled]="!nombreObjetivo" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Crear
          </button>
        </div>
      </div>
    </div>
  `
})
export class AddObjetivoModalComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() objetivoCreado = new EventEmitter<string>();

  nombreObjetivo = '';

  cancelar() {
    this.nombreObjetivo = '';
    this.closed.emit();
  }

  crear() {
    if (this.nombreObjetivo.trim()) {
      this.objetivoCreado.emit(this.nombreObjetivo.trim());
      this.nombreObjetivo = '';
      this.closed.emit();
    }
  }
}
