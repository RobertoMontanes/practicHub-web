import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
}

@Component({
  selector: 'app-table-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-shared.html',
  styleUrl: './table-shared.css',
})
export class TableShared {
  @Input() columns: TableColumn[] = [];
  @Input() rows: Record<string, unknown>[] = [];
  @Input() loading = false;
  @Input() emptyState = 'No hay registros disponibles.';

  @Output() rowSelected = new EventEmitter<Record<string, unknown>>();

  onRowClick(row: Record<string, unknown>): void {
    this.rowSelected.emit(row);
  }
}
