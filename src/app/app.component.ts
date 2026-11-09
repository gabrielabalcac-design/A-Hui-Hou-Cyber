import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { LanguageService } from './core/services/language.service';
import { AnalyticsService } from './services/analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private languageService: LanguageService,
    private router: Router,
    private analytics: AnalyticsService
  ) {
    // Escucha cada cambio de ruta/pantalla para registrar la visita en Google Tag Manager
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.analytics.trackPageView(event.urlAfterRedirects, event.urlAfterRedirects);
    });
  }
}