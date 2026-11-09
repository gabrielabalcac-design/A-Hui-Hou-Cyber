import { Injectable } from '@angular/core';
import { COURSES_DATA } from '../core/data/courses.data';
import { COURSES_EN } from '../core/data/courses.en';
import { GAMES_LIST } from '../core/data/games.data';
import { PODCASTS_LIST, PODCAST_SOURCES } from '../core/data/podcasts.data';
import { AppLang } from '../core/services/language.service';

export type SearchKind = 'course' | 'case' | 'game' | 'podcast' | 'source';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  queryParams: Record<string, string | number>;
}

interface IndexItem {
  id: string;
  kind: SearchKind;
  icon: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  route: string;
  queryParams: Record<string, string | number>;
  /** Texto de título (normalizado, ES + EN) */
  titleHay: string;
  /** Texto completo (normalizado, ES + EN) */
  hay: string;
}

export const KIND_LABELS: Record<SearchKind, { es: string; en: string }> = {
  course: { es: 'Curso', en: 'Course' },
  case: { es: 'Caso', en: 'Case' },
  game: { es: 'Juego', en: 'Game' },
  podcast: { es: 'Podcast', en: 'Podcast' },
  source: { es: 'Fuente', en: 'Source' }
};

/** Prioridad al empatar puntaje (menor = primero) */
const KIND_ORDER: Record<SearchKind, number> = { course: 0, game: 1, case: 2, podcast: 3, source: 4 };

/**
 * Buscador global.
 * - Indexa los datos reales de la app (cursos, casos, juegos, podcasts y fuentes).
 * - Busca en español e inglés a la vez, sin distinguir tildes ni mayúsculas.
 * - Cada resultado lleva ruta + parámetros para abrir directamente el elemento.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private index: IndexItem[] = this.buildIndex();

  search(query: string, lang: AppLang, limit = 8): SearchResult[] {
    const tokens = this.norm(query).split(/\s+/).filter(t => t.length > 0);
    if (tokens.length === 0) return [];

    const scored: { item: IndexItem; score: number }[] = [];

    for (const item of this.index) {
      let score = 0;
      let allMatch = true;

      for (const t of tokens) {
        if (!item.hay.includes(t)) {
          allMatch = false;
          break;
        }
        score += 1;
        if (item.titleHay.includes(t)) score += 5;
        if (item.titleHay.startsWith(t) || item.titleHay.includes(' ' + t)) score += 3;
      }

      if (allMatch) scored.push({ item, score });
    }

    scored.sort((a, b) => b.score - a.score || KIND_ORDER[a.item.kind] - KIND_ORDER[b.item.kind]);

    return scored.slice(0, limit).map(({ item }) => ({
      id: item.id,
      kind: item.kind,
      icon: item.icon,
      title: item.title[lang],
      subtitle: item.subtitle[lang],
      route: item.route,
      queryParams: item.queryParams
    }));
  }

  // ------------------------------------------------------------------

  private norm(t: string): string {
    return (t || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  private make(
    base: Omit<IndexItem, 'titleHay' | 'hay'>,
    extraText: string[] = []
  ): IndexItem {
    const titleHay = this.norm(`${base.title.es} ${base.title.en}`);
    const hay = this.norm(
      [base.title.es, base.title.en, base.subtitle.es, base.subtitle.en, ...extraText].join(' ')
    );
    return { ...base, titleHay, hay };
  }

  private buildIndex(): IndexItem[] {
    const items: IndexItem[] = [];

    // ---- Cursos y sus casos ----
    for (const course of COURSES_DATA) {
      const en = COURSES_EN[course.id];

      items.push(
        this.make(
          {
            id: `course-${course.id}`,
            kind: 'course',
            icon: '📚',
            title: { es: course.title, en: en?.title ?? course.title },
            subtitle: {
              es: `${KIND_LABELS.course.es} · ${course.level} · ${course.duration}`,
              en: `${KIND_LABELS.course.en} · ${course.level} · ${course.duration}`
            },
            route: '/modules',
            queryParams: { course: course.id }
          },
          [
            course.description,
            en?.description ?? '',
            course.concept,
            course.expertTip,
            en?.concept ?? '',
            en?.expertTip ?? ''
          ]
        )
      );

      course.cases.forEach((c, idx) => {
        const enCase = en?.cases?.[idx];
        items.push(
          this.make(
            {
              id: `course-${course.id}-case-${idx}`,
              kind: 'case',
              icon: '🔎',
              title: { es: c.title, en: enCase?.title ?? c.title },
              subtitle: {
                es: `${KIND_LABELS.case.es} · ${course.title}`,
                en: `${KIND_LABELS.case.en} · ${en?.title ?? course.title}`
              },
              route: '/modules',
              queryParams: { course: course.id, case: idx }
            },
            [c.narrative, enCase?.narrative ?? '']
          )
        );
      });
    }

    // ---- Juegos y casos forenses ----
    for (const g of GAMES_LIST) {
      const isCase = g.type === 'forensic';
      const kind: SearchKind = isCase ? 'case' : 'game';
      items.push(
        this.make({
          id: `game-${g.id}`,
          kind,
          icon: g.icon,
          title: { es: g.titleEs, en: g.titleEn },
          subtitle: {
            es: `${KIND_LABELS[kind].es} · ${g.descEs}`,
            en: `${KIND_LABELS[kind].en} · ${g.descEn}`
          },
          route: '/games',
          queryParams: { open: g.id }
        })
      );
    }

    // ---- Episodios de podcast ----
    for (const p of PODCASTS_LIST) {
      const langName = p.lang === 'es' ? 'Español' : 'English';
      items.push(
        this.make(
          {
            id: `pod-${p.id}`,
            kind: 'podcast',
            icon: '🎧',
            title: { es: p.title, en: p.title },
            subtitle: {
              es: `Podcast · ${langName} · ${p.category} · ${p.duration}`,
              en: `Podcast · ${langName} · ${p.category} · ${p.duration}`
            },
            route: '/podcast',
            queryParams: { tab: p.lang, focus: p.id }
          },
          [p.category]
        )
      );
    }

    // ---- Fuentes externas del directorio ----
    for (const s of PODCAST_SOURCES) {
      const langName = s.lang === 'es' ? 'Español' : 'English';
      items.push(
        this.make(
          {
            id: `src-${s.name}`,
            kind: 'source',
            icon: '🌐',
            title: { es: s.name, en: s.name },
            subtitle: {
              es: `${KIND_LABELS.source.es} · ${langName} · ${s.type}`,
              en: `${KIND_LABELS.source.en} · ${langName} · ${s.type}`
            },
            route: '/podcast',
            queryParams: { tab: s.lang, q: s.name }
          },
          [s.description]
        )
      );
    }

    return items;
  }
}
