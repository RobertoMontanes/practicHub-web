import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';

@Component({
  selector: 'app-dashboard-pages',
  standalone: true,  
  imports: [CommonModule, AdminShell],  
  templateUrl: './dashboard-pages.html',
  styleUrl: './dashboard-pages.css',
})
export class DashboardPages {

}
