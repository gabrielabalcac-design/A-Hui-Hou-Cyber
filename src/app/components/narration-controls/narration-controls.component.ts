import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLang, LanguageService } from '../../core/services/language.service';
import { NarrationService } from '../../core/services/narration.service';

/**
 * Controles de narración reutilizables.
 *
 *   <app-narration-controls [text]="texto" [key]="'caso-1-2'" [lang]="'es'" [showAuto]="true"></app-narration-controls>
 *
 * - key:  identificador único del contenido (así cada botón sabe si es el que está sonando).
 * - lang: idioma del TEXTO a leer (puede diferir del idioma de la interfaz).
 * - compact: solo iconos (para cabeceras estrechas).
 */
@Component({
  selector: 'app-narration-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nc" *ngIf="narration.supported" [class.compact]="compact">
      <div class="nc-row">
        <button type="button" class="nc-main" (click)="onMain()" [attr.aria-label]="mainText">
          <svg *ngIf="!isPlaying(); else pauseIcon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M7 4.5v15l12-7.5z" fill="currentColor"></path>
          </svg>
          <ng-template #pauseIcon>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"></path>
            </svg>
          </ng-template>
          <span class="nc-label" *ngIf="!compact">{{ mainText }}</span>
        </button>

        <button *ngIf="isActive()" type="button" class="nc-icon" (click)="stop()" [attr.aria-label]="isEn ? 'Stop' : 'Detener'">
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor"></rect></svg>
        </button>

        <button type="button" class="nc-rate" (click)="narration.cycleRate()"
                [attr.aria-label]="(isEn ? 'Speed ' : 'Velocidad ') + rateLabel()"
                [title]="isEn ? 'Reading speed' : 'Velocidad de lectura'">
          {{ rateLabel() }}
        </button>

        <label *ngIf="showAuto && !compact" class="nc-auto" [title]="isEn ? 'Read each case aloud automatically' : 'Narrar cada caso automáticamente'">
          <input type="checkbox" [checked]="narration.auto()" (change)="narration.setAuto($any($event.target).checked)" />
          <span>Auto</span>
        </label>
      </div>

      <div class="nc-progress" *ngIf="isActive()" role="progressbar" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="progressPct()">
        <div class="nc-bar" [style.width.%]="progressPct()"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
    .nc { display: flex; flex-direction: column; gap: 6px; }
    .nc-row { display: flex; align-items: center; gap: 6px; }

    .nc-main {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #2B587D;
      color: #fff;
      border: none;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(43, 88, 125, 0.3);
      transition: background .2s;
    }
    .nc-main:hover { background: #1f4263; }
    .compact .nc-main { padding: 7px 10px; }

    .nc-icon, .nc-rate {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 30px;
      height: 28px;
      padding: 0 8px;
      background: #eef3f8;
      color: #2B587D;
      border: 1px solid #d3dfeb;
      border-radius: 14px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }
    .nc-icon:hover, .nc-rate:hover { background: #e0eaf3; }
    .nc-main:focus-visible, .nc-icon:focus-visible, .nc-rate:focus-visible { outline: 2px solid #7AA77A; outline-offset: 2px; }

    .nc-auto {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      user-select: none;
    }
    .nc-auto input { accent-color: #2B7C59; margin: 0; cursor: pointer; }

    .compact .nc-progress { display: none; }
    .nc-progress { height: 4px; border-radius: 2px; background: #e3e8ee; overflow: hidden; }
    .nc-bar { height: 100%; background: #7AA77A; transition: width .3s ease; }
  `]
})
export class NarrationControlsComponent {
  @Input({ required: true }) text = '';
  @Input({ required: true }) key = '';
  /** Idioma del texto a leer; por defecto el de la interfaz. */
  @Input() lang?: AppLang;
  @Input() compact = false;
  @Input() showAuto = false;

  narration = inject(NarrationService);
  private language = inject(LanguageService);

  /** El idioma de la interfaz también pone las etiquetas de los botones. */
  get isEn(): boolean { return this.language.isEnglish; }

  rateLabel = computed(() => `${this.narration.rate()}×`);
  progressPct = computed(() => Math.round(this.narration.progress() * 100));

  isActive(): boolean { return this.narration.isActive(this.key); }
  isPlaying(): boolean { return this.narration.isPlaying(this.key); }

  get mainText(): string {
    const en = this.isEn;
    if (this.isPlaying()) return en ? 'Pause' : 'Pausar';
    if (this.isActive()) return en ? 'Resume' : 'Continuar';
    return en ? 'Listen' : 'Escuchar';
  }

  onMain() {
    this.narration.toggle(this.text, this.lang ?? this.language.current, this.key);
  }

  stop() {
    this.narration.stop();
  }
}
