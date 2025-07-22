import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-800 mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-2">
          <button class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" (click)="onCancel()">Cancelar</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" (click)="onConfirm()">Confirmar</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmación';
  @Input() message: string = '¿Estás seguro que deseas continuar?';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
