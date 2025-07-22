import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800"
      ></div>
    </div>
  `,
})
export class LoaderComponent {}
