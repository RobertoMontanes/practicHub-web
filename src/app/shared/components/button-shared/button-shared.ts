import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-shared.html',
  styleUrl: './button-shared.css',
})
export class ButtonShared {
  @Input() label = 'Acción';
  @Input() icon?: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() fullWidth = false;
  @Input() disabled = false;

  @Output() pressed = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.pressed.emit(event);
  }

  get hostClasses(): string[] {
    return [
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-block' : '',
      this.icon && !this.label ? 'icon-only' : '',
    ].filter(Boolean);
  }
}
