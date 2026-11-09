import { Component, DestroyRef, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { AppLang, LanguageService, SUPPORTED_LANGS } from '../../core/services/language.service';
import { KIND_LABELS, SearchResult, SearchService } from '../../services/search.service';

/**
 * Cabecera única para todas las páginas.
 * - Menú desplegable de idioma.
 * - Buscador global (barra en pantallas grandes, lupa que se expande en móvil).
 *
 * Uso:
 *   <app-header heading="Perfil del Operador"></app-header>
 *   <app-header [showLogo]="true"></app-header>      (Home)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header" [class.search-open]="mobileOpen">
      <div class="brand-container">
        <ng-container *ngIf="showLogo; else textTitle">
          <img src="assets/A Hui Hou Cyber...jpg" alt="Logo" class="header-logo transparent-bg" />
          <div class="header-title-wrapper">
            <img src="assets/A Hui Hou Cyber;.jpg" alt="A Hui Hou Cyber" class="header-title-img transparent-bg" />
          </div>
        </ng-container>
        <ng-template #textTitle>
          <h2>{{ heading }}</h2>
        </ng-template>
      </div>

      <!-- ============ BUSCADOR GLOBAL ============ -->
      <div class="search-wrap" #searchWrap role="search">
        <div class="search-field">
          <svg class="icon-search" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"></circle>
            <path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          </svg>

          <input
            #searchInput
            type="text"
            class="search-input"
            role="combobox"
            autocomplete="off"
            spellcheck="false"
            aria-controls="global-search-results"
            [attr.aria-expanded]="panelOpen"
            [attr.aria-activedescendant]="active >= 0 ? 'sr-' + active : null"
            [attr.aria-label]="placeholder"
            [placeholder]="placeholder"
            [value]="query"
            (input)="onInput($any($event.target).value)"
            (focus)="onFocus()"
            (keydown)="onKeydown($event)"
          />

          <button *ngIf="query" type="button" class="btn-clear" (click)="clear()" [attr.aria-label]="lang.isEnglish ? 'Clear' : 'Limpiar'">✕</button>
          <kbd *ngIf="!query" class="kbd-hint" aria-hidden="true">/</kbd>

          <button type="button" class="btn-close-mobile" (click)="closeMobile()" [attr.aria-label]="lang.isEnglish ? 'Close search' : 'Cerrar búsqueda'">
            {{ lang.isEnglish ? 'Cancel' : 'Cancelar' }}
          </button>
        </div>

        <ul *ngIf="panelOpen" id="global-search-results" class="results" role="listbox">
          <li
            *ngFor="let r of results; let i = index"
            [id]="'sr-' + i"
            role="option"
            class="result-item"
            [class.active]="i === active"
            [attr.aria-selected]="i === active"
            (mouseenter)="active = i"
            (click)="select(r)"
          >
            <span class="result-icon" aria-hidden="true">{{ r.icon }}</span>
            <span class="result-text">
              <span class="result-title">{{ r.title }}</span>
              <span class="result-sub">{{ r.subtitle }}</span>
            </span>
            <span class="result-kind" [attr.data-kind]="r.kind">{{ kindLabel(r) }}</span>
          </li>

          <li *ngIf="results.length === 0" class="result-empty">
            {{ lang.isEnglish ? 'No results for' : 'Sin resultados para' }} «{{ query }}»
          </li>
        </ul>
      </div>

      <div class="actions">
        <!-- Lupa: solo en pantallas pequeñas -->
        <button type="button" class="icon-btn search-btn" (click)="openMobile()" [attr.aria-label]="lang.isEnglish ? 'Search' : 'Buscar'">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"></circle>
            <path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        </button>

        <!-- Menú desplegable de idioma -->
        <div class="lang-menu" #langMenu>
          <button
            type="button"
            class="lang-trigger"
            aria-haspopup="listbox"
            [attr.aria-expanded]="open"
            [attr.aria-label]="lang.isEnglish ? 'Change language' : 'Cambiar idioma'"
            (click)="toggle($event)"
          >
            <span class="lang-code">{{ currentShort }}</span>
            <span class="lang-caret" [class.up]="open" aria-hidden="true">▾</span>
          </button>

          <ul *ngIf="open" class="lang-list" role="listbox">
            <li
              *ngFor="let l of langs"
              role="option"
              [attr.aria-selected]="l.code === lang.current"
              [class.selected]="l.code === lang.current"
              (click)="selectLang(l.code)"
            >
              <span class="opt-code">{{ l.short }}</span>
              <span class="opt-label">{{ l.label }}</span>
              <span class="opt-check" *ngIf="l.code === lang.current">✓</span>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .app-header {
      position: relative;
      background-color: #2B587D;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .brand-container {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex: 0 1 auto;
    }
    .brand-container h2 {
      font-size: 14px;
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-logo { width: 62px; height: 62px; object-fit: contain; background: transparent; }
    .header-title-wrapper { height: 40px; display: flex; align-items: center; }
    .header-title-img { height: 34px; object-fit: contain; }
    .transparent-bg { mix-blend-mode: multiply; }

    .actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

    /* ---------- Botones redondeados (lupa) ---------- */
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 34px;
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 8px;
      cursor: pointer;
    }
    .icon-btn:hover { background: rgba(255,255,255,0.2); }
    .icon-btn:focus-visible,
    .lang-trigger:focus-visible { outline: 2px solid #7AA77A; outline-offset: 2px; }

    /* ---------- Buscador ---------- */
    /* MÓVIL: oculto; al pulsar la lupa se superpone sobre toda la cabecera */
    .search-wrap { display: none; }
    .app-header.search-open .search-wrap {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 5;
      background: #2B587D;
      padding: 10px 12px;
    }
    .search-field {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 100%;
      min-height: 38px;
      background: #ffffff;
      color: #2B3A4A;
      border-radius: 10px;
      padding: 0 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    }
    .icon-search { flex-shrink: 0; color: #2B587D; }
    .search-input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: none;
      background: transparent;
      color: #2B3A4A;
      font-size: 14px;
      height: 100%;
      padding: 8px 0;
    }
    .search-input::placeholder { color: #7a8794; }
    .btn-clear {
      border: 0;
      background: #e3e8ee;
      color: #2B587D;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 11px;
      line-height: 1;
      cursor: pointer;
      flex-shrink: 0;
    }
    .kbd-hint {
      display: none;
      font-family: inherit;
      font-size: 11px;
      color: #7a8794;
      border: 1px solid #cdd5dd;
      border-radius: 5px;
      padding: 1px 6px;
      flex-shrink: 0;
    }
    .btn-close-mobile {
      border: 0;
      background: transparent;
      color: #2B587D;
      font-weight: 700;
      font-size: 13px;
      padding: 6px 4px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .results {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      margin: 0;
      padding: 6px;
      list-style: none;
      background: #ffffff;
      color: #2B3A4A;
      border-radius: 12px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.28);
      max-height: min(60vh, 460px);
      overflow-y: auto;
      z-index: 100;
    }
    .app-header.search-open .results { left: 8px; right: 8px; top: calc(100% + 4px); }
    .result-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 9px;
      cursor: pointer;
    }
    .result-item.active { background: #e8f0f7; }
    .result-icon { font-size: 18px; width: 26px; text-align: center; flex-shrink: 0; }
    .result-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .result-title {
      font-size: 13px;
      font-weight: 700;
      color: #2B587D;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .result-sub {
      font-size: 11px;
      color: #6b7782;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .result-kind {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .4px;
      color: #fff;
      background: #6b7782;
      padding: 3px 7px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .result-kind[data-kind="course"]  { background: #2B587D; }
    .result-kind[data-kind="game"]    { background: #9E5D3B; }
    .result-kind[data-kind="case"]    { background: #2B7C59; }
    .result-kind[data-kind="podcast"] { background: #C18F6B; }
    .result-kind[data-kind="source"]  { background: #6b7782; }
    .result-empty { padding: 14px 12px; font-size: 13px; color: #6b7782; }

    /* DESKTOP / TABLET GRANDE: barra siempre visible */
    @media (min-width: 768px) {
      .search-btn { display: none; }
      .btn-close-mobile { display: none; }
      .kbd-hint { display: inline-block; }
      .search-wrap,
      .app-header.search-open .search-wrap {
        display: block;
        position: relative;
        inset: auto;
        padding: 0;
        background: transparent;
        flex: 1 1 auto;
        max-width: 560px;
        margin: 0 auto;
      }
      .search-field { height: 38px; }
      .app-header.search-open .results { left: 0; right: 0; top: calc(100% + 6px); }
    }

    /* ---------- Menú de idioma ---------- */
    .lang-menu { position: relative; flex-shrink: 0; }
    .lang-trigger {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 34px;
    }
    .lang-trigger:hover { background: rgba(255,255,255,0.2); }
    .lang-caret { font-size: 12px; transition: transform .15s ease; }
    .lang-caret.up { transform: rotate(180deg); }

    .lang-list {
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      min-width: 150px;
      margin: 0;
      padding: 4px;
      list-style: none;
      background: #ffffff;
      color: #2B587D;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 100;
    }
    .lang-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    .lang-list li:hover { background: #eef3f8; }
    .lang-list li.selected { background: #e3edf5; font-weight: 700; }
    .opt-code { font-weight: 700; width: 24px; }
    .opt-label { flex: 1; }
    .opt-check { color: #2B7C59; font-weight: 700; }
  `]
})
export class AppHeaderComponent {
  @Input() heading = '';
  @Input() showLogo = false;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('searchWrap') searchWrap?: ElementRef<HTMLElement>;
  @ViewChild('langMenu') langMenu?: ElementRef<HTMLElement>;

  langs = SUPPORTED_LANGS;
  open = false; // menú de idioma

  // Buscador
  query = '';
  results: SearchResult[] = [];
  active = -1;
  showPanel = false;
  mobileOpen = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    public lang: LanguageService,
    private searchService: SearchService,
    private navCtrl: NavController
  ) {
    // Si cambia el idioma, se vuelven a traducir los resultados visibles
    this.lang.changes$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.runSearch());
  }

  // ---------------- Idioma ----------------
  get currentShort(): string {
    return this.langs.find(l => l.code === this.lang.current)?.short ?? 'ES';
  }

  toggle(ev: Event) {
    ev.stopPropagation();
    this.open = !this.open;
  }

  selectLang(code: AppLang) {
    this.lang.set(code);
    this.open = false;
  }

  // ---------------- Buscador ----------------
  get placeholder(): string {
    return this.lang.isEnglish
      ? 'Search courses, games, cases or podcasts…'
      : 'Buscar cursos, juegos, casos o podcasts…';
  }

  get panelOpen(): boolean {
    return this.showPanel && this.query.trim().length > 0;
  }

  kindLabel(r: SearchResult): string {
    return KIND_LABELS[r.kind][this.lang.current];
  }

  onInput(value: string) {
    this.query = value;
    this.showPanel = true;
    this.runSearch();
  }

  onFocus() {
    if (this.query.trim()) this.showPanel = true;
  }

  private runSearch() {
    this.results = this.searchService.search(this.query, this.lang.current);
    this.active = this.results.length ? 0 : -1;
  }

  onKeydown(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'ArrowDown':
        ev.preventDefault();
        this.showPanel = true;
        if (this.results.length) this.moveActive(1);
        break;
      case 'ArrowUp':
        ev.preventDefault();
        if (this.results.length) this.moveActive(-1);
        break;
      case 'Enter':
        if (this.panelOpen && this.active >= 0 && this.results[this.active]) {
          ev.preventDefault();
          this.select(this.results[this.active]);
        }
        break;
      case 'Escape':
        if (this.showPanel) {
          this.showPanel = false;
        } else {
          this.closeMobile();
        }
        break;
    }
  }

  private moveActive(delta: number) {
    const n = this.results.length;
    this.active = (this.active + delta + n) % n;
    setTimeout(() => document.getElementById('sr-' + this.active)?.scrollIntoView({ block: 'nearest' }));
  }

  select(r: SearchResult) {
    this.showPanel = false;
    this.query = '';
    this.results = [];
    this.active = -1;
    this.mobileOpen = false;
    // 't' fuerza una navegación nueva aunque se elija dos veces el mismo resultado
    this.navCtrl.navigateRoot(r.route, { queryParams: { ...r.queryParams, t: Date.now() } });
  }

  clear() {
    this.query = '';
    this.results = [];
    this.active = -1;
    this.searchInput?.nativeElement.focus();
  }

  openMobile() {
    this.mobileOpen = true;
    setTimeout(() => this.searchInput?.nativeElement.focus());
  }

  closeMobile() {
    this.mobileOpen = false;
    this.showPanel = false;
    this.query = '';
    this.results = [];
    this.active = -1;
  }

  // ---------------- Eventos globales ----------------
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: Event) {
    const target = ev.target as Node;
    if (this.open && !this.langMenu?.nativeElement.contains(target)) {
      this.open = false;
    }
    if (this.showPanel && !this.searchWrap?.nativeElement.contains(target)) {
      this.showPanel = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.open = false;
      return;
    }
    // Atajo: "/" o Ctrl/Cmd + K enfocan el buscador
    const tag = (ev.target as HTMLElement)?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (ev.target as HTMLElement)?.isContentEditable;
    if ((ev.key === '/' && !typing) || ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k')) {
      ev.preventDefault();
      if (window.innerWidth < 768) {
        this.openMobile();
      } else {
        this.searchInput?.nativeElement.focus();
      }
    }
  }
}
