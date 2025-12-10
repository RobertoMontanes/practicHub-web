import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating-stars-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars-shared.html',
  styleUrl: './rating-stars-shared.css',
})
export class RatingStarsShared {
  @Input() max = 5;
  @Input() value = 0;
  @Input() readonly = false;
  @Input() showLabel = true;

  @Output() valueChange = new EventEmitter<number>();

  get stars(): number[] {
    return Array.from({ length: this.max }, (_, index) => index + 1);
  }

  setValue(value: number): void {
    if (this.readonly) {
      return;
    }

    this.value = value;
    this.valueChange.emit(this.value);
  }
}
