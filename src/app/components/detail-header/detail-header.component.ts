import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBackButtonComponent } from '../back-button/back-button.component';

/**
 * Barra superior para toda pantalla de "detalle" (curso, juego, lección...).
 * El botón Volver SIEMPRE queda en la misma zona: esquina superior izquierda de esta barra.
 *
 * Uso:
 *   <app-detail-header [title]="course.title" [badge]="course.level" (back)="goBack()"></app-detail-header>
 */
@Component({
  selector: 'app-detail-header',
  standalone: true,
  imports: [CommonModule, AppBackButtonComponent],
  template: `
    <header class="detail-bar">
      <app-back-button (pressed)="back.emit()"></app-back-button>
      <div class="detail-title">
        <span class="detail-badge" *ngIf="badge">{{ badge }}</span>
        <h2>{{ title }}</h2>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; position: sticky; top: 0; z-index: 20; flex: 0 0 auto; }
    .detail-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 64px;
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px;
      background: #2B587D;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .detail-title { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
    .detail-title h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .detail-badge {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #eef2f5;
      color: #2B587D;
      padding: 3px 8px;
      border-radius: 6px;
    }
  `]
})
export class AppDetailHeaderComponent {
  @Input() title = '';
  @Input() badge?: string;
  @Output() back = new EventEmitter<void>();
}
