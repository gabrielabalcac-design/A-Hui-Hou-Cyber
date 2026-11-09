import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { PODCASTS_LIST, PODCAST_SOURCES, PodcastEpisode, PodcastSource } from '../../core/data/podcasts.data';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-podcast',
  template: `
    <app-header [heading]="'🎙️ ' + (currentLanguage === 'es' ? 'Ciberseguridad Avanzada & Podcasts' : 'Advanced Cybersecurity & Podcasts')"></app-header>

    <main class="app-content">
      <div class="podcast-container">
        
        <!-- Buscador de Tendencias / Episodios -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            [placeholder]="currentLanguage === 'es' ? 'Buscar episodios, amenazas o fuentes...' : 'Search episodes, threats or sources...'" 
            class="podcast-search-input"
          />
        </div>

        <!-- Botones de Pestañas Personalizados (Español / Inglés) -->
        <div class="custom-tabs-container">
          <button 
            class="custom-tab-btn" 
            [class.active]="podcastTab === 'es'" 
            (click)="podcastTab = 'es'">
            Español <span class="tab-count">{{ countFor('es') }}</span>
          </button>
          <button 
            class="custom-tab-btn" 
            [class.active]="podcastTab === 'en'" 
            (click)="podcastTab = 'en'">
            English <span class="tab-count">{{ countFor('en') }}</span>
          </button>
        </div>

        <!-- SECCIÓN 1: Episodios Locales Interactivos (Filtrados por Idioma y Búsqueda) -->
        <div class="intro-section" *ngIf="filteredPodcasts.length > 0">
          <h3>{{ currentLanguage === 'es' ? 'Episodios Locales Seleccionados' : 'Selected Local Episodes' }}</h3>
          <p>{{ currentLanguage === 'es' ? 'Reproduce las transmisiones y análisis tácticos en alta fidelidad.' : 'Play high-fidelity tactical broadcasts and analysis.' }}</p>
        </div>

        <div class="podcast-list" *ngIf="filteredPodcasts.length > 0">
          <div *ngFor="let pod of filteredPodcasts" class="podcast-card" [id]="'pod-' + pod.id" [class.highlight]="highlightId === pod.id">
            <div class="pod-header-info">
              <div class="pod-icon">🎧</div>
              <div class="pod-info">
                <h4>{{ pod.title }}</h4>
                <div class="pod-meta">
                  <span class="badge-category">{{ pod.category }}</span>
                  <span class="pod-duration">⏱️ {{ pod.duration }}</span>
                </div>
              </div>
            </div>
            
            <!-- Reproductor de Audio HTML5 Profesional -->
            <div class="audio-player-container">
              <audio controls preload="none" [src]="pod.audioUrl" class="custom-audio-player"></audio>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: Directorio Global de Ciberseguridad (Dinámico según la pestaña activa) -->
        <div class="global-directory-section">
          <div class="directory-header">
            <h3>🌐 {{ podcastTab === 'es' ? 'Directorio Global de Fuentes (Español)' : 'Global Sources Directory (English)' }}</h3>
            <p>{{ podcastTab === 'es' ? 'Explora plataformas especializadas de habla hispana recomendadas por expertos.' : 'Explore specialized international security platforms recommended by experts.' }}</p>
          </div>

          <div class="directory-grid">
            <div *ngFor="let source of filteredGlobalSources" class="source-card">
              <div class="source-info">
                <span class="source-type">{{ source.type }}</span>
                <h4>{{ source.name }}</h4>
                <p>{{ source.description }}</p>
              </div>
              <button class="btn-external" (click)="openExternalLink(source.url)">
                {{ currentLanguage === 'es' ? 'Visitar' : 'Visit' }} ↗
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay resultados generales -->
        <div *ngIf="filteredPodcasts.length === 0 && filteredGlobalSources.length === 0" class="no-results">
          <p>{{ currentLanguage === 'es' ? 'No se encontraron episodios ni fuentes con ese criterio de búsqueda.' : 'No episodes or sources found matching your search criteria.' }}</p>
          <button *ngIf="countFor(otherTab) > 0" class="btn-external" (click)="podcastTab = otherTab">
            {{ currentLanguage === 'es'
                ? 'Ver ' + countFor(otherTab) + ' resultado(s) en ' + (otherTab === 'en' ? 'English' : 'Español')
                : 'See ' + countFor(otherTab) + ' result(s) in ' + (otherTab === 'en' ? 'English' : 'Español') }}
          </button>
        </div>
      </div>
    </main>

    <app-footer-nav activeTab="podcast"></app-footer-nav>
  `,
  styles: [`
  /* ==========================================================
     ESTILOS TÁCTICOS SOC - PODCASTS Y DIRECTORIO GLOBAL
     ========================================================== */

  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: #D6C5B2;
    overflow: hidden;
  }

  /* Header Superior SOC */
  .app-header {
    background: linear-gradient(135deg, #041422 0%, #2B587D 100%);
    color: #ffffff;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 15px rgba(6, 36, 61, 0.25);
    border-bottom: 2px solid rgba(16, 185, 129, 0.3);
    z-index: 10;
  }

  .brand-container h2 {
    font-size: 15px;
    font-weight: 800;
    margin: 0;
    letter-spacing: 0.4px;
    color: #ffffff;
  }

  .app-content {
    flex: 1;
    overflow-y: auto;
    background-color: #D6C5B2;
  }

  .podcast-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 24px 16px 110px 16px;
  }

  /* ================= BUSCADOR TÁCTICO ================= */
  .search-box {
    position: relative;
    margin-bottom: 16px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
  }

  .podcast-search-input {
    width: 100%;
    padding: 13px 16px 13px 44px;
    border-radius: 14px;
    border: 1.5px solid #e2e8f0;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    background: #ffffff;
    color: #0f172a;
    caret-color: #2B587D;
    box-shadow: 0 4px 15px rgba(6, 36, 61, 0.04);
    transition: all 0.2s;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      border-color: #2B587D;
      background: #fff;
      box-shadow: 0 4px 20px rgba(43, 88, 125, 0.1);
    }
  }

  /* ================= PESTAÑAS DE IDIOMA ================= */
  .custom-tabs-container {
    display: flex;
    background: #c2b19d;
    border-radius: 14px;
    padding: 5px;
    gap: 6px;
    margin-bottom: 20px;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.08);
  }

  .custom-tab-btn {
    flex: 1;
    padding: 11px;
    border: none;
    background: transparent;
    color: #3b2e21;
    font-size: 12.5px;
    font-weight: 800;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .podcast-card.highlight {
    outline: 3px solid #10b981;
    box-shadow: 0 0 0 6px rgba(16,185,129,0.2);
    transition: box-shadow .3s ease;
  }

  .tab-count {
    display: inline-block;
    margin-left: 6px;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 11px;
    background: rgba(0,0,0,0.12);
  }

  .custom-tab-btn.active {
    background: linear-gradient(135deg, #041422 0%, #2B587D 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(6, 36, 61, 0.25);
  }

  /* ================= SECCIÓN DE INTRO ================= */
  .intro-section {
    margin-bottom: 14px;
    padding: 0 4px;

    h3 {
      font-size: 15px;
      font-weight: 900;
      color: #06243D;
      margin: 0 0 2px 0;
    }

    p {
      font-size: 12px;
      color: #475569;
      margin: 0;
    }
  }

  /* ================= TARJETAS DE PODCAST ================= */
  .podcast-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 30px;
  }

  .podcast-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 6px 20px rgba(6, 36, 61, 0.06);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    border-left: 6px solid #2B587D;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative; /* Clave para contener los elementos internos */
    overflow: hidden;   /* Evita cualquier desbordamiento visual */
    box-sizing: border-box;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(43, 88, 125, 0.12);
    }
  }

  .pod-header-info {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .pod-icon {
    font-size: 22px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 10px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .pod-info {
    flex: 1;

    h4 {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      line-height: 1.4;
    }
  }

  .pod-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge-category {
    font-size: 9.5px;
    background: #f0fdf4;
    color: #059669;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 800;
    border: 1px solid #bbf7d0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pod-duration {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }

  .audio-player-container {
    width: 100%;
    background: #f8fafc;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    box-sizing: border-box; /* Asegura que el padding no expanda el ancho */
  }

  .custom-audio-player {
    width: 100%;
    max-width: 100%; /* Limita estrictamente el ancho al contenedor */
    height: 38px;
    outline: none;
    accent-color: #2B587D;
    display: block;
  }
    
  /* ================= DIRECTORIO GLOBAL DE FUENTES ================= */
  .global-directory-section {
    margin-top: 24px;
    border-top: 2px dashed #b5a491;
    padding-top: 22px;
  }

  .directory-header {
    margin-bottom: 14px;

    h3 {
      font-size: 16px;
      font-weight: 900;
      color: #06243D;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 12px;
      color: #475569;
      margin: 0;
    }
  }

  .directory-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .source-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 6px 20px rgba(6, 36, 61, 0.05);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    border-left: 6px solid #059669;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(5, 150, 105, 0.12);
    }
  }

  .source-info {
    flex: 1;

    .source-type {
      font-size: 9px;
      background: #f0fdf4;
      color: #059669;
      padding: 2px 7px;
      border-radius: 5px;
      font-weight: 800;
      text-transform: uppercase;
      border: 1px solid #bbf7d0;
      letter-spacing: 0.5px;
    }

    h4 {
      font-size: 13.5px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 2px 0;
    }

    p {
      font-size: 11.5px;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }
  }

  .btn-external {
    background: linear-gradient(135deg, #041422 0%, #2B587D 100%);
    color: white;
    border: none;
    padding: 7px 14px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(6, 36, 61, 0.2);
    transition: all 0.2s;

    &:hover {
      background: linear-gradient(135deg, #06243D 0%, #1f405c 100%);
      transform: translateY(-1px);
    }
  }

  .no-results {
    text-align: center;
    padding: 36px 20px;
    color: #475569;
    font-size: 13px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(6, 36, 61, 0.05);
    border: 1px solid #e2e8f0;

    .btn-external {
      margin-top: 14px;
      display: inline-block;
    }
  }

  /* ================= ESCRITORIO (≥ 900px) ================= */
  @media (min-width: 900px) {
    .podcast-container {
      max-width: 1120px;
      padding: 32px 28px 110px 28px;
    }

    .search-box { max-width: 580px; }
    .custom-tabs-container { max-width: 440px; }

    .podcast-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .directory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 14px;
    }
  }
`],
  standalone: true,
  imports: [AppHeaderComponent, CommonModule, FormsModule, FooterNavComponent]
})
export class PodcastPage {
  searchTerm: string = '';
  get currentLanguage(): 'es' | 'en' { return this.lang.current; }
  podcastTab: 'es' | 'en' = 'es';
  highlightId: number | null = null;

  constructor(private lang: LanguageService, private route: ActivatedRoute) {
    this.podcastTab = this.lang.current;
    this.lang.changes$.pipe(skip(1), takeUntilDestroyed()).subscribe(l => (this.podcastTab = l));

    // Enlaces profundos desde el buscador global: /podcast?tab=en&focus=3  o  /podcast?tab=es&q=Tierra
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'es' || tab === 'en') { this.podcastTab = tab; }

      if (params.has('q')) { this.searchTerm = params.get('q') || ''; }
      else if (params.has('focus')) { this.searchTerm = ''; }

      const focus = Number(params.get('focus'));
      if (focus) {
        this.highlightId = focus;
        setTimeout(() => document.getElementById('pod-' + focus)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
        setTimeout(() => { if (this.highlightId === focus) this.highlightId = null; }, 3500);
      }
    });
  }

  podcastsList: PodcastEpisode[] = PODCASTS_LIST;

  // Directorio global dividido explícitamente por idioma ('es' / 'en')
  globalSources: PodcastSource[] = PODCAST_SOURCES;

  private norm(t: string): string {
    return (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private podcastsFor(lang: 'es' | 'en') {
    const term = this.norm(this.searchTerm);
    return this.podcastsList.filter(p =>
      p.lang === lang &&
      (!term || this.norm(p.title).includes(term) || this.norm(p.category).includes(term))
    );
  }

  private sourcesFor(lang: 'es' | 'en') {
    const term = this.norm(this.searchTerm);
    return this.globalSources.filter(s =>
      s.lang === lang &&
      (!term || this.norm(s.name).includes(term) || this.norm(s.description).includes(term) || this.norm(s.type).includes(term))
    );
  }

  get otherTab(): 'es' | 'en' {
    return this.podcastTab === 'es' ? 'en' : 'es';
  }

  /** Cantidad de episodios + fuentes que coinciden con la búsqueda actual en un idioma */
  countFor(lang: 'es' | 'en'): number {
    return this.podcastsFor(lang).length + this.sourcesFor(lang).length;
  }

  get filteredPodcasts() {
    return this.podcastsFor(this.podcastTab);
  }

  get filteredGlobalSources() {
    return this.sourcesFor(this.podcastTab);
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }
}