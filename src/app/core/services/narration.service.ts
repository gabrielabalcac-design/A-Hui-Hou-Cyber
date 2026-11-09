import { Injectable, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, skip } from 'rxjs';
import { AppLang, LanguageService } from './language.service';

export type NarrationState = 'idle' | 'playing' | 'paused';

/** Velocidades disponibles (se recorren con un solo botón). */
export const NARRATION_RATES = [0.75, 1, 1.25, 1.5];

/**
 * Narración por voz (Web Speech API) compartida por cursos y juegos.
 *
 * Mejoras frente a la versión anterior:
 * - Pausar / continuar / detener (pausa propia: funciona igual en Chrome, Edge, Safari y Android).
 * - Velocidad ajustable y recordada.
 * - Elige la mejor voz disponible por idioma (prefiere voces "Natural"/"Google" y variantes latinoamericanas).
 * - Divide textos largos en frases: evita el corte de Chrome en lecturas largas y permite mostrar progreso.
 * - Limpia emojis, flechas y marcas como [cite: 1] antes de leer.
 * - Se detiene sola al cambiar de idioma o de página.
 * - Usa signals, así la interfaz se actualiza sola con los eventos de voz (la app es zoneless).
 */
@Injectable({ providedIn: 'root' })
export class NarrationService {
  readonly supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  /** Estado global de la narración. */
  readonly state = signal<NarrationState>('idle');
  /** Identificador del contenido que se está narrando (para que cada botón sepa si es el suyo). */
  readonly activeKey = signal<string | null>(null);
  /** Progreso 0..1 del texto actual. */
  readonly progress = signal(0);
  /** Velocidad actual. */
  readonly rate = signal(1);
  /** Si está activo, los cursos narran solos al abrir cada caso. */
  readonly auto = signal(true);

  private synth: SpeechSynthesis | null = this.supported ? window.speechSynthesis : null;
  private voices: SpeechSynthesisVoice[] = [];
  private chunks: string[] = [];
  private index = 0;
  private lang: AppLang = 'es';
  /** Cada reproducción/pausa/reanudación invalida los callbacks de la anterior. */
  private session = 0;

  constructor(languageService: LanguageService, router: Router) {
    this.restorePrefs();

    if (this.synth) {
      this.loadVoices();
      this.synth.addEventListener?.('voiceschanged', () => this.loadVoices());
    }

    // El texto narrado es de otro idioma: se detiene.
    languageService.changes$.pipe(skip(1)).subscribe(() => this.stop());
    // Al navegar a otra pantalla no debe seguir hablando.
    router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => this.stop());
  }

  // ------------------------------------------------------------------ API pública

  isActive(key: string): boolean {
    return this.activeKey() === key && this.state() !== 'idle';
  }

  isPlaying(key: string): boolean {
    return this.activeKey() === key && this.state() === 'playing';
  }

  /** Reproduce, pausa o continúa según el estado actual de ese contenido. */
  toggle(text: string, lang: AppLang, key: string) {
    if (this.activeKey() === key) {
      if (this.state() === 'playing') return this.pause();
      if (this.state() === 'paused') return this.resume();
    }
    this.play(text, lang, key);
  }

  /** Lee el texto desde el principio. */
  play(text: string, lang: AppLang, key: string) {
    if (!this.synth) return;
    const chunks = this.split(text);
    if (chunks.length === 0) return;

    this.session++;
    this.synth.cancel();

    this.chunks = chunks;
    this.index = 0;
    this.lang = lang;
    this.activeKey.set(key);
    this.progress.set(0);
    this.state.set('playing');
    this.scheduleSpeak();
  }

  /** Igual que play(), pero solo si la narración automática está activada. */
  autoplay(text: string, lang: AppLang, key: string) {
    if (this.auto()) this.play(text, lang, key);
  }

  pause() {
    if (!this.synth || this.state() !== 'playing') return;
    this.session++; // invalida el callback de la frase en curso
    this.synth.cancel();
    this.state.set('paused');
  }

  resume() {
    if (!this.synth || this.state() !== 'paused') return;
    this.state.set('playing');
    this.scheduleSpeak(); // retoma desde el inicio de la frase en la que quedó
  }

  stop() {
    if (!this.synth) return;
    this.session++;
    this.synth.cancel();
    this.reset();
  }

  setRate(rate: number) {
    this.rate.set(rate);
    this.savePref('narration_rate', String(rate));
    // Si está hablando, se aplica de inmediato reiniciando la frase actual
    if (this.synth && this.state() === 'playing') {
      this.session++;
      this.synth.cancel();
      this.scheduleSpeak();
    }
  }

  cycleRate() {
    const i = NARRATION_RATES.indexOf(this.rate());
    this.setRate(NARRATION_RATES[(i + 1) % NARRATION_RATES.length]);
  }

  setAuto(value: boolean) {
    this.auto.set(value);
    this.savePref('narration_auto', value ? '1' : '0');
  }

  // ------------------------------------------------------------------ interno

  private reset() {
    this.state.set('idle');
    this.activeKey.set(null);
    this.progress.set(0);
    this.chunks = [];
    this.index = 0;
  }

  /** Pequeña espera tras cancel(): sin ella Chrome a veces ignora el siguiente speak(). */
  private scheduleSpeak() {
    const session = ++this.session;
    setTimeout(() => this.speakCurrent(session), 80);
  }

  private speakCurrent(session: number) {
    if (!this.synth || session !== this.session || this.state() !== 'playing') return;

    if (this.index >= this.chunks.length) {
      this.reset();
      return;
    }

    const u = new SpeechSynthesisUtterance(this.chunks[this.index]);
    const voice = this.pickVoice(this.lang);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = this.lang === 'en' ? 'en-US' : 'es-ES';
    }
    u.rate = this.rate();

    u.onend = () => {
      if (session !== this.session || this.state() !== 'playing') return;
      this.index++;
      this.progress.set(Math.min(1, this.index / this.chunks.length));
      this.speakCurrent(session);
    };
    u.onerror = (e: SpeechSynthesisErrorEvent) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      if (session === this.session) this.reset();
    };

    this.synth.speak(u);
  }

  private loadVoices() {
    this.voices = this.synth?.getVoices() ?? [];
  }

  /** Elige la mejor voz disponible para el idioma. */
  private pickVoice(lang: AppLang): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) this.loadVoices();
    const candidates = this.voices.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
    if (candidates.length === 0) return null;

    // Preferencia por variante regional (Latinoamérica primero en español)
    const regions = lang === 'es' ? ['es-co', 'es-mx', 'es-419', 'es-us', 'es-ar', 'es-es'] : ['en-us', 'en-gb'];

    const score = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      const code = v.lang.toLowerCase().replace('_', '-');
      let s = 0;
      if (name.includes('natural') || name.includes('neural')) s += 10; // voces neuronales de Edge
      if (name.includes('google')) s += 5; // voces de Chrome
      if (!v.localService) s += 1;
      const r = regions.indexOf(code);
      if (r >= 0) s += regions.length - r;
      return s;
    };

    return [...candidates].sort((a, b) => score(b) - score(a))[0];
  }

  /** Limpia el texto y lo divide en fragmentos cortos (frases agrupadas, ≤ ~200 caracteres). */
  private split(text: string): string[] {
    const clean = (text || '')
      .replace(/\[cite:\s*[\d,\s]+\]/gi, ' ')
      .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, ' ')
      .replace(/[\u2190-\u21FF\u2700-\u27BF\u2900-\u297F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return [];

    const sentences = clean.match(/[^.!?…:;]+[.!?…:;]*\s*/g) ?? [clean];
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      if ((current + s).length > 200 && current) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    // Una "frase" sin puntuación muy larga se parte por comas / espacios
    return chunks.flatMap(c => (c.length > 260 ? this.hardSplit(c) : [c]));
  }

  private hardSplit(text: string): string[] {
    const parts = text.split(/(?<=,)\s+/);
    const out: string[] = [];
    let cur = '';
    for (const p of parts) {
      if ((cur + ' ' + p).length > 200 && cur) {
        out.push(cur.trim());
        cur = p;
      } else {
        cur = cur ? cur + ' ' + p : p;
      }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  private restorePrefs() {
    try {
      const r = Number(localStorage.getItem('narration_rate'));
      if (NARRATION_RATES.includes(r)) this.rate.set(r);
      const a = localStorage.getItem('narration_auto');
      if (a !== null) this.auto.set(a === '1');
    } catch {
      /* sin almacenamiento: se usan los valores por defecto */
    }
  }

  private savePref(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }
}
