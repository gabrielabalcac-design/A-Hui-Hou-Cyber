import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" style="background: #2B587D; border-top: 2px solid #2B7C59;">
        <ion-tab-button tab="home" style="--color: #D6C5B2; --color-selected: #7AA77A;">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 600;">Hogar</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="modules" style="--color: #D6C5B2; --color-selected: #7AA77A;">
          <ion-icon name="book-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 600;">Cursos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="games" style="--color: #D6C5B2; --color-selected: #7AA77A;">
          <ion-icon name="game-controller-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 600;">Juegos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" style="--color: #D6C5B2; --color-selected: #7AA77A;">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 600;">Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPage {}