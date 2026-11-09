import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { CYBER_NEWS_LIST, CyberNewsItem } from '../../core/data/news.data';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent, FooterNavComponent],
  template: `
    <app-header [heading]="lang.isEnglish ? 'Cybersecurity News & Intelligence' : 'Noticias e Inteligencia de Ciberseguridad'"></app-header>

    <main class="content-container">
      <div class="news-wrapper">
        
        <!-- BUSCADOR SUPERIOR (Estilo Podcast) -->
        <div class="search-box-container">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            [placeholder]="lang.isEnglish ? 'Search news, threats or sources...' : 'Buscar noticias, amenazas o fuentes...'" 
            class="news-search-input"
          />
          <button *ngIf="searchQuery" class="clear-search-btn" (click)="searchQuery = ''">✕</button>
        </div>

        <!-- PESTAÑAS DE IDIOMA CON CONTADOR (Estilo Podcast) -->
        <div class="lang-tabs-container">
          <button 
            class="lang-tab" 
            [class.active]="selectedTab === 'es'" 
            (click)="selectedTab = 'es'">
            Español <span class="badge">{{ getNewsCount('es') }}</span>
          </button>
          <button 
            class="lang-tab" 
            [class.active]="selectedTab === 'en'" 
            (click)="selectedTab = 'en'">
            English <span class="badge">{{ getNewsCount('en') }}</span>
          </button>
        </div>

        <!-- DESCRIPCIÓN DE SECCIÓN -->
        <div class="section-info">
          <h3>{{ selectedTab === 'en' ? 'Selected Local News' : 'Noticias Locales Seleccionadas' }}</h3>
          <p>{{ selectedTab === 'en' ? 'Explore real-time intelligence reports and global threat bulletins.' : 'Explora reportes de inteligencia en tiempo real y boletines de amenazas globales.' }}</p>
        </div>

        <!-- GRID ADAPTABLE A PC (2 Columnas en escritorio, 1 en móvil) -->
        <div class="news-grid">
          <div *ngFor="let item of filteredNews" class="news-card">
            
            <div class="news-card-header">
              <div class="icon-box">📰</div>
              <div class="meta-info">
                <h3 class="news-title">{{ item.title }}</h3>
                <div class="tags-row">
                  <span class="news-category">{{ item.category }}</span>
                  <span class="news-date">⏳ {{ item.readTime }}</span>
                </div>
              </div>
            </div>

            <p class="news-summary">{{ item.summary }}</p>

            <div class="news-footer">
              <span class="news-source">📡 {{ item.sourceName }} • {{ item.date }}</span>
              <a [href]="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                {{ selectedTab === 'en' ? 'Read Source →' : 'Ver Fuente →' }}
              </a>
            </div>

          </div>

          <!-- ESTADO VACÍO -->
          <div *ngIf="filteredNews.length === 0" class="empty-state">
            <p>{{ selectedTab === 'en' ? 'No news articles found matching your criteria.' : 'No se encontraron artículos que coincidan con tu búsqueda.' }}</p>
          </div>
        </div>

      </div>
    </main>

    <app-footer-nav activeTab="news"></app-footer-nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
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

    .content-container {
      flex: 1;
      overflow-y: auto;
      background-color: #D6C5B2;
      padding: 24px 20px 110px 20px;
    }

    .news-wrapper {
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    
    /* ================= BUSCADOR TÁCTICO ================= */
    .search-box-container {
      position: relative;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 20px rgba(6, 36, 61, 0.06);
      border: 1.5px solid #e2e8f0;
      padding: 4px 16px;
      transition: all 0.2s;

      &:focus-within {
        border-color: #2B587D;
        box-shadow: 0 6px 22px rgba(43, 88, 125, 0.12);
      }
    }

    .news-search-input {
      width: 100%;
      padding: 12px 10px;
      border: none;
      background: transparent;
      font-size: 13px;
      color: #0f172a;
      outline: none;

      &::placeholder {
        color: #94a3b8;
      }
    }

    .clear-search-btn {
      background: #f1f5f9;
      border: none;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      font-size: 11px;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: background 0.2s;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
    }

    /* ================= PESTAÑAS DE IDIOMA ================= */
    .lang-tabs-container {
      display: flex;
      gap: 6px;
      background: #c2b19d;
      padding: 5px;
      border-radius: 14px;
      width: fit-content;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.08);
    }

    .lang-tab {
      background: transparent;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 800;
      color: #3b2e21;
      cursor: pointer;
      transition: all 0.25s ease-in-out;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lang-tab.active {
      background: linear-gradient(135deg, #041422 0%, #2B587D 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(6, 36, 61, 0.25);
    }

    .badge {
      background: rgba(0, 0, 0, 0.12);
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 11px;
    }

    /* Info de sección */
    .section-info {
      padding: 0 4px;

      h3 {
        font-size: 16px;
        font-weight: 900;
        color: #06243D;
        margin: 0 0 2px 0;
      }

      p {
        font-size: 12.5px;
        color: #475569;
        margin: 0;
      }
    }

    /* GRID adaptable a PC (2 columnas) */
    .news-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 900px) {
      .news-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    /* Tarjetas de noticias de alta fidelidad */
    .news-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 6px 20px rgba(6, 36, 61, 0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
      border: 1.5px solid rgba(255, 255, 255, 0.9);
      border-left: 6px solid #2B587D;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(43, 88, 125, 0.12);
      }
    }

    .news-card-header {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    .icon-box {
      font-size: 22px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .meta-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .news-title {
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      line-height: 1.4;
    }

    .tags-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .news-category {
      background: #f0fdf4;
      color: #059669;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      border: 1px solid #bbf7d0;
      letter-spacing: 0.5px;
    }

    .news-date {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .news-summary {
      font-size: 13px;
      color: #334155;
      margin: 0;
      line-height: 1.55;
    }

    .news-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      margin-top: 4px;
    }

    .news-source {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .read-more-btn {
      font-size: 12px;
      font-weight: 800;
      color: #059669;
      text-decoration: none;
      transition: opacity 0.2s;

      &:hover {
        text-decoration: underline;
        opacity: 0.85;
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(6, 36, 61, 0.05);
      border: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
    }
  `]
})
export class NewsPage implements OnInit {
  searchQuery: string = '';
  selectedTab: 'es' | 'en' = 'es';
  allNews: CyberNewsItem[] = CYBER_NEWS_LIST;

  constructor(public lang: LanguageService) {}

  ngOnInit() {
    // Sincronizar pestaña inicial con el idioma global de la app
    this.selectedTab = this.lang.current;
  }

  getNewsCount(langCode: string): number {
    return this.allNews.filter(item => item.lang === langCode).length;
  }

  get filteredNews(): CyberNewsItem[] {
    return this.allNews.filter(item => {
      const matchesLang = item.lang === this.selectedTab;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        item.title.toLowerCase().includes(q) || 
        item.summary.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) || 
        item.sourceName.toLowerCase().includes(q);
      
      return matchesLang && matchesQuery;
    });
  }
}