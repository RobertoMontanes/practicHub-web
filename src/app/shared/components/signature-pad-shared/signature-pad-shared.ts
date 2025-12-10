import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-signature-pad-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signature-pad-shared.html',
  styleUrl: './signature-pad-shared.css',
})
export class SignaturePadShared implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() saved = new EventEmitter<string>();

  private ctx?: CanvasRenderingContext2D | null;
  private drawing = false;
  private lastPoint: { x: number; y: number } | null = null;

  ngAfterViewInit(): void {
    this.configureCanvas();
  }

  @HostListener('window:resize')
  configureCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ratio = window.devicePixelRatio || 1;
    const { width } = canvas.getBoundingClientRect();
    canvas.width = width * ratio;
    canvas.height = 220 * ratio;
    canvas.style.height = '220px';
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      this.ctx.scale(ratio, ratio);
      this.ctx.lineWidth = 2.4;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = '#111827';
    }
  }

  pointerDown(event: PointerEvent): void {
    this.drawing = true;
    this.lastPoint = this.relativePoint(event);
  }

  pointerMove(event: PointerEvent): void {
    if (!this.drawing || !this.ctx) {
      return;
    }

    const current = this.relativePoint(event);

    if (this.lastPoint) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(current.x, current.y);
      this.ctx.stroke();
    }

    this.lastPoint = current;
  }

  pointerUp(): void {
    this.drawing = false;
    this.lastPoint = null;
  }

  clear(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  save(): void {
    const canvas = this.canvasRef.nativeElement;
    this.saved.emit(canvas.toDataURL('image/png'));
  }

  private relativePoint(event: PointerEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
