import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/**
 * Botón "Volver" único para TODA la aplicación.
 * Mismo diseño, mismo tamaño y misma posición (esquina superior izquierda del contenido).
 * El texto se traduce solo según el idioma activo.
 *
 * Uso:
 *   <app-back-button (pressed)="goBack()"></app-back-button>
 *   <app-back-button label="Inicio" (pressed)="goHome()"></app-back-button>   (texto opcional)
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button type="button" class="app-back-btn" [attr.aria-label]="text" (click)="pressed.emit()">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span>{{ text }}</span>
    </button>
  `,
  styles: [`
    :host { display: inline-flex; flex: 0 0 auto; }
    .app-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 38px;              /* área táctil cómoda en móvil */
      padding: 0 16px 0 10px;
      background: #ffffff;           /* se ve bien sobre azul, beige y blanco */
      color: #2B587D;
      border: 1.5px solid #2B587D;
      border-radius: 999px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: background 0.2s, transform 0.1s;
    }
    .app-back-btn:hover { background: #eef2f5; }
    .app-back-btn:active { transform: scale(0.97); }
    .app-back-btn:focus-visible { outline: 3px solid #7AA77A; outline-offset: 2px; }
  `]
})
export class AppBackButtonComponent {
  /** Texto opcional. Si no se indica: "Volver" / "Back" según el idioma. */
  @Input() label?: string;
  @Output() pressed = new EventEmitter<void>();

  constructor(private lang: LanguageService) {}

  get text(): string {
    return this.label ?? (this.lang.isEnglish ? 'Back' : 'Volver');
  }
}
