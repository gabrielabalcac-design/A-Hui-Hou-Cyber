import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() { }

  // Rastrear cambios de página automáticamente
  trackPageView(pageTitle: string, pagePath: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath
      });
    }
  }

  // Rastrear acciones clave (ej. registros, inicios de sesión, módulos)
  trackEvent(eventName: string, eventCategory: string, eventLabel?: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel
      });
    }
  }
  // En tu AnalyticsService
trackModuleStart(moduleId: string, moduleTitle: string) {
  this.trackEvent('module_start', 'Cybersecurity Module', `${moduleId}: ${moduleTitle}`);
}

trackModuleComplete(moduleId: string, moduleTitle: string, score?: number) {
  this.trackEvent('module_complete', 'Cybersecurity Module', `${moduleId}: ${moduleTitle} | Puntaje: ${score ?? 100}`);
}

trackPhishingSimulation(scenarioId: string, result: 'success' | 'failed') {
  this.trackEvent('phishing_sim_result', 'Simulation Engine', `Escenario: ${scenarioId} | Resultado: ${result}`);
}
}