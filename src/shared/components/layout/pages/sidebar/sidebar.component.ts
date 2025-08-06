import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isSidebarOpen = false;
  isMantenimientosOpen = false;
  isPlanDesarrolloOpen = false;
  isEstructuraProgramaticaOpen = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMantenimientos() {
    this.isMantenimientosOpen = !this.isMantenimientosOpen;
    this.router.navigate(['/catalogos']);
  }

  togglePlanDesarrollo() {
    this.isPlanDesarrolloOpen = !this.isPlanDesarrolloOpen;
  }

  toggleEstructuraProgramatica() {
    this.isEstructuraProgramaticaOpen = !this.isEstructuraProgramaticaOpen;
  }
}
