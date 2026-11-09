import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { LanguageService } from '../../core/services/language.service';
import { NAV_ITEMS, NavItem } from '../../core/nav-items';
import { NavIconComponent } from '../nav-icon/nav-icon.component';

/** Barra de navegación inferior (móvil y escritorio). */
@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule, NavIconComponent],
  template: `
    <nav class="bar" [attr.aria-label]="isEnglish ? 'Main navigation' : 'Navegación principal'">
      <div class="bar-inner">
      <a
        *ngFor="let item of items"
        class="tab"
        [class.active]="isActive(item)"
        [attr.href]="item.path"
        [attr.aria-current]="isActive(item) ? 'page' : null"
        (click)="navigateTo($event, item.path)"
      >
        <app-nav-icon [name]="item.icon" [size]="22"></app-nav-icon>
        <span>{{ isEnglish ? item.en : item.es }}</span>
      </a>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .bar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: #2B587D;
      border-top: 2px solid #2B7C59;
      z-index: 1000;
      box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
    }
    .bar-inner {
      height: 100%;
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      color: #D6C5B2;
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      min-width: 56px;
    }
    .tab.active { color: #7AA77A; }
  `]
})
export class FooterNavComponent {
  /** 'home' | 'modules' (o 'courses') | 'games' | 'podcast' | 'profile' */
  @Input() activeTab: string = 'home';

  items: NavItem[] = NAV_ITEMS;

  constructor(private navCtrl: NavController, private lang: LanguageService) {}

  get isEnglish(): boolean {
    return this.lang.isEnglish;
  }

  isActive(item: NavItem): boolean {
    // Algunas páginas pasan 'courses' para la pestaña de Cursos
    const tab = this.activeTab === 'courses' ? 'modules' : this.activeTab;
    return tab === item.id;
  }

  navigateTo(ev: Event, path: string) {
    ev.preventDefault();
    this.navCtrl.navigateRoot(path);
  }
}
