import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavIconName } from '../../core/nav-items';

/** Iconos de navegación en SVG: se ven igual en todos los sistemas (no dependen de fuentes de emoji). */
@Component({
  selector: 'app-nav-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.9"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    >
      <ng-container [ngSwitch]="name">
        <ng-container *ngSwitchCase="'home'">
          <path d="M3 11.5 12 4l9 7.5"></path>
          <path d="M5.5 10v10h4.5v-6h4v6h4.5V10"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'courses'">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"></path>
          <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"></path>
          <path d="M9 8h7"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'games'">
          <rect x="2" y="7" width="20" height="11" rx="5.5"></rect>
          <path d="M7 10.5v4M5 12.5h4"></path>
          <circle cx="16" cy="11.5" r="0.8" fill="currentColor"></circle>
          <circle cx="18.5" cy="14" r="0.8" fill="currentColor"></circle>
        </ng-container>
        <ng-container *ngSwitchCase="'podcast'">
          <rect x="9" y="3" width="6" height="11" rx="3"></rect>
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'news'">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
        <path d="M6 6h6v6H6z"></path>
        <path d="M14 6h4M14 10h4M6 16h12"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'profile'">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M4 21a8 8 0 0 1 16 0"></path>
        </ng-container>
      </ng-container>
    </svg>
  `,
  styles: [`:host { display: inline-flex; line-height: 0; }`]
})
export class NavIconComponent {
  @Input() name: NavIconName = 'home';
  @Input() size = 22;
}
