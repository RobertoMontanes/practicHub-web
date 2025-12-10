import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonShared } from '../button-shared/button-shared';

@Component({
  selector: 'app-modal-shared',
  standalone: true,
  imports: [CommonModule, ButtonShared],
  templateUrl: './modal-shared.html',
  styleUrl: './modal-shared.css',
})
export class ModalShared {
  @Input() open = false;
  @Input() title = 'Título del modal';
  @Input() description?: string;
  @Input() primaryLabel = 'Guardar';
  @Input() secondaryLabel = 'Cancelar';
  @Input() hideSecondary = false;
  @Input() disableBackdropClose = false;

  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();
  @Output() backdrop = new EventEmitter<void>();

  onPrimary(): void {
    this.primary.emit();
  }

  onSecondary(): void {
    this.secondary.emit();
  }

  onBackdropClick(): void {
    this.backdrop.emit();
    if (!this.disableBackdropClose) {
      this.onSecondary();
    }
  }
}
