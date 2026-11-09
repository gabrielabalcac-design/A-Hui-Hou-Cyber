import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type AppLang = 'es' | 'en';

export const SUPPORTED_LANGS: { code: AppLang; short: string; label: string }[] = [
  { code: 'es', short: 'ES', label: 'Español' },
  { code: 'en', short: 'EN', label: 'English' }
];

/**
 * Única fuente de verdad del idioma de la app.
 * - Se guarda en localStorage, así se conserva al recargar y al cambiar de página.
 * - Mantiene sincronizado ngx-translate.
 * - Mantiene el evento 'languageChanged' por compatibilidad con código antiguo.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'language';
  private readonly subject: BehaviorSubject<AppLang>;

  /** Observable para reaccionar a cambios de idioma. Emite el valor actual al suscribirse. */
  readonly changes$;

  constructor(private translate: TranslateService) {
    this.subject = new BehaviorSubject<AppLang>(this.readInitialLang());
    this.changes$ = this.subject.asObservable();

    this.translate.addLangs(['es', 'en']);
    this.translate.use(this.subject.value);
    document.documentElement.lang = this.subject.value;
  }

  get current(): AppLang {
    return this.subject.value;
  }

  get isEnglish(): boolean {
    return this.subject.value === 'en';
  }

  set(lang: AppLang): void {
    if (lang === this.subject.value) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
      localStorage.setItem('app_language', lang); // compatibilidad
    } catch {
      /* modo privado / sin storage: se ignora */
    }

    this.translate.use(lang);
    document.documentElement.lang = lang;
    this.subject.next(lang);
    window.dispatchEvent(new Event('languageChanged'));
  }

  private readInitialLang(): AppLang {
    try {
      const stored =
        localStorage.getItem(this.STORAGE_KEY) ||
        localStorage.getItem('currentLanguage') ||
        localStorage.getItem('app_language');
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      /* ignore */
    }
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
  }
}
