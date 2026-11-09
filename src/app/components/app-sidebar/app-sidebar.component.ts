import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LanguageService } from '../../core/services/language.service';
import { NAV_ITEMS, NavItem } from '../../core/nav-items';
import { NavIconComponent } from '../nav-icon/nav-icon.component';

/**
 * Menú lateral para pantallas grandes (≥ 900px).
 * En pantallas pequeñas queda oculto y se usa la barra inferior (app-footer-nav).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NavIconComponent],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <img src="assets/A Hui Hou Cyber...jpg" alt="Logo" class="brand-logo" />
        <img src="assets/A Hui Hou Cyber;.jpg" alt="A Hui Hou Cyber" class="brand-name" />
      </div>

      <nav class="nav" [attr.aria-label]="lang.isEnglish ? 'Main navigation' : 'Navegación principal'">
        <a
          *ngFor="let item of items"
          class="nav-item"
          [class.active]="isActive(item)"
          [attr.href]="item.path"
          [attr.aria-current]="isActive(item) ? 'page' : null"
          (click)="go($event, item)"
        >
          <app-nav-icon [name]="item.icon" [size]="22"></app-nav-icon>
          <span class="label">{{ lang.isEnglish ? item.en : item.es }}</span>
        </a>
      </nav>

      <div class="foot">{{ lang.isEnglish ? 'Cybersecurity training' : 'Entrenamiento en ciberseguridad' }}</div>
    </aside>
  `,
  styles: [`
    :host {
      display: none;
      flex: 0 0 236px;
      width: 236px;
      height: 100%;
    }
    @media (min-width: 900px) {
      :host { display: block; }
    }
    .sidebar {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: #2B587D;
      border-right: 3px solid #2B7C59;
      padding: 18px 14px;
      color: #D6C5B2;
      overflow-y: auto;
    }
    .brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 6px 0 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .brand-logo { width: 96px; height: 96px; object-fit: contain; mix-blend-mode: multiply; }
    .brand-name { width: 170px; max-width: 100%; height: auto; object-fit: contain; mix-blend-mode: multiply; }

    .nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 10px;
      color: #D6C5B2;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border-left: 4px solid transparent;
      transition: background .15s ease, color .15s ease;
    }
    .nav-item:hover { background: rgba(255,255,255,0.10); color: #ffffff; }
    .nav-item:focus-visible { outline: 2px solid #7AA77A; outline-offset: 2px; }
    .nav-item.active {
      background: rgba(122,167,122,0.20);
      color: #7AA77A;
      border-left-color: #7AA77A;
    }
    .foot {
      margin-top: auto;
      padding-top: 16px;
      font-size: 11px;
      text-align: center;
      color: rgba(214,197,178,0.7);
    }
  `]
})
export class AppSidebarComponent {
  items: NavItem[] = NAV_ITEMS;
  private url = '';
  private destroyRef = inject(DestroyRef);

  constructor(public lang: LanguageService, private router: Router, private navCtrl: NavController) {
    this.url = this.router.url;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(e => (this.url = e.urlAfterRedirects));
  }

  isActive(item: NavItem): boolean {
    const path = this.url.split('?')[0];
    return path === item.path || path.startsWith(item.path + '/');
  }

  go(ev: Event, item: NavItem) {
    ev.preventDefault();
    this.navCtrl.navigateRoot(item.path);
  }
}
