import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  // 1. Estado del sidebar (cerrado en móvil por defecto)
  isSidebarOpen = false;

  // 2. Método para alternar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
