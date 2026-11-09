import { Component, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppLang, LanguageService } from '../../core/services/language.service';
import { NarrationService } from '../../core/services/narration.service';
import { NarrationControlsComponent } from '../../components/narration-controls/narration-controls.component';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { COURSES_DATA, Course, CaseStudy } from '../../core/data/courses.data';
import { COURSES_EN } from '../../core/data/courses.en';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent, 
    NarrationControlsComponent, 
    CommonModule, 
    FooterNavComponent,
    IonContent
  ]
})
export class ModulesPage implements OnInit, OnDestroy {
  courses = COURSES_DATA;

  // Listas divididas por niveles para el HTML
  fundamentoCourses: Course[] = [];
  intermedioCourses: Course[] = [];
  avanzadoCourses: Course[] = [];
  
  selectedCourse: Course | null = null;
  currentCaseIndex: number = 0;
  currentCase?: CaseStudy;
  selectedOption: any = null;
  isAnswered: boolean = false;
  isCorrectAnswer: boolean = false;
  feedbackMessage: string = '';

  score: number = 0;
  isCompleted: boolean = false;

  get currentLanguage(): 'es' | 'en' { return this.lang.current; }

  private destroyRef = inject(DestroyRef);
  contentLang: AppLang = 'es';
  private optionOrder: number[][] = [];

  constructor(
    private translate: TranslateService, 
    private lang: LanguageService, 
    private route: ActivatedRoute, 
    private narration: NarrationService
  ) {
    this.lang.changes$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onLanguageChanged());
    
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = Number(params.get('course'));
      const course = id ? this.courses.find(c => c.id === id) : undefined;
      if (course) {
        if (this.isUnlocked(course.id)) {
          this.openCourse(course);
          if (params.has('case')) { this.goToCase(Number(params.get('case'))); }
        } else {
          this.backToList();
        }
      } else if (this.selectedCourse) {
        this.backToList();
      }
    });
  }

  ngOnInit() {
    this.selectedCourse = null;
    this.isCompleted = false;
    this.categorizeCourses();
  }

  /// Organiza los cursos limpiamente por su nivel oficial y los ordena de menor a mayor (1, 2, 3...)
  private categorizeCourses() {
    this.fundamentoCourses = this.courses
      .filter(c => c.level?.toLowerCase() === 'beginner' || c.level?.toLowerCase() === 'fundamentos')
      .sort((a, b) => a.id - b.id);

    this.intermedioCourses = this.courses
      .filter(c => c.level?.toLowerCase() === 'intermediate' || c.level?.toLowerCase() === 'intermedio')
      .sort((a, b) => a.id - b.id);

    this.avanzadoCourses = this.courses
      .filter(c => c.level?.toLowerCase() === 'advanced' || c.level?.toLowerCase() === 'avanzado')
      .sort((a, b) => a.id - b.id);
  }

  // Lógica de desbloqueo secuencial estricto: el módulo 1 siempre está abierto; los demás requieren que el anterior esté completado
  isUnlocked(courseId: number): boolean {
    if (courseId === 1) return true;
    const completedIds: number[] = JSON.parse(localStorage.getItem('completed_course_ids') || '[]');
    // Para desbloquear el curso N, el curso N-1 debe estar en la lista de completados
    return completedIds.includes(courseId - 1);
  }

  private goToCase(index: number) {
    const cases = this.selectedCourse?.cases;
    if (!cases || !Number.isInteger(index) || index < 0 || index >= cases.length) return;
    this.currentCaseIndex = index;
    this.currentCase = cases[index];
    this.selectedOption = null;
    this.isAnswered = false;
    this.autoNarrateCase();
  }

  ngOnDestroy() {
    this.narration.stop();
  }

  getCurrentLang(): string {
    return this.lang.current;
  }

  getTr(key: string): string {
    const lang = this.getCurrentLang();
    switch(key) {
      case 'HEADER': return lang === 'en' ? 'Course Modules' : 'Módulos de Cursos';
      case 'CAT_TITLE': return lang === 'en' ? 'Security Catalog' : 'Catálogo de Seguridad';
      case 'CAT_DESC': return lang === 'en' ? 'Select an unlocked course to start your interactive case studies.' : 'Selecciona un curso desbloqueado para iniciar tus casos de estudio interactivos.';
      case 'BACK': return lang === 'en' ? '← Back' : '← Volver';
      case 'KEY_CONCEPT': return lang === 'en' ? '💡 Advanced Core Concept' : '💡 Concepto Clave Avanzado';
      case 'EXPERT_TIP': return lang === 'en' ? 'Expert Strategy:' : 'Estrategia Experta:';
      case 'AUDIO': return lang === 'en' ? '🔊 Play Audio' : '🔊 Reproducir Audio';
      case 'NEXT_CASE': return lang === 'en' ? 'Next Case ➔' : 'Siguiente Caso ➔';
      case 'COMPLETE': return lang === 'en' ? 'View Final Score 🏆' : 'Ver Puntaje Final 🏆';
      case 'CONGRATS': return lang === 'en' ? 'Course Completed Successfully!' : '¡Curso Completado con Éxito!';
      case 'FINAL_SCORE': return lang === 'en' ? 'Your Final Score:' : 'Tu Puntaje Final:';
      case 'RESTART': return lang === 'en' ? 'Back to Catalog' : 'Volver al Catálogo';
      default: return key;
    }
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getLocalizedCourse(course: Course) {
    const lang = this.getCurrentLang();
    if (lang === 'en') {
      const translations: { [key: number]: any } = COURSES_EN;
      const translated = translations[course.id];
      if (translated) {
        return {
          ...course,
          title: translated.title,
          description: translated.description,
          concept: translated.concept,
          expertTip: translated.expertTip,
          cases: translated.cases
        };
      }
    }
    return course;
  }

  getBadgeColor(level: string): string {
    switch (level?.toLowerCase()) {
      case 'beginner': case 'fundamentos': return '#e1f5fe';
      case 'intermediate': case 'intermedio': return '#fff3e0';
      case 'advanced': case 'avanzado': return '#ffebee';
      default: return '#f1f1f1';
    }
  }

  private buildSelected(course: Course): Course {
    const localized: any = this.getLocalizedCourse(course);
    this.contentLang = this.lang.current === 'en' && COURSES_EN[course.id] ? 'en' : 'es';

    const cases: any[] = localized.cases || [];
    if (this.optionOrder.length !== cases.length) {
      this.optionOrder = cases.map((c: any) => this.shuffleArray<number>(c.options.map((_: any, i: number) => i)));
    }

    return {
      ...localized,
      cases: cases.map((c: any, ci: number) => {
        const order = this.optionOrder[ci];
        const options = order && order.length === c.options.length ? order.map(i => c.options[i]) : c.options;
        return { ...c, options };
      })
    };
  }

  openCourse(course: Course) {
    if (!this.isUnlocked(course.id)) return;
    
    this.narration.stop();
    this.optionOrder = [];
    this.selectedCourse = this.buildSelected(course);

    this.currentCaseIndex = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.score = 0;
    this.isCompleted = false;

    this.currentCase = this.selectedCourse.cases && this.selectedCourse.cases.length > 0
      ? this.selectedCourse.cases[0]
      : undefined;
    this.autoNarrateCase();
  }

  private onLanguageChanged() {
    if (!this.selectedCourse) return;
    const original = this.courses.find(c => c.id === this.selectedCourse!.id);
    if (!original) return;

    const prevOptions: any[] = this.currentCase ? (this.currentCase as any)['options'] : [];
    const selectedIdx = this.selectedOption ? prevOptions.indexOf(this.selectedOption) : -1;

    this.selectedCourse = this.buildSelected(original);
    this.currentCase = this.selectedCourse.cases?.[this.currentCaseIndex];

    if (this.isAnswered && this.currentCase && selectedIdx >= 0) {
      const opt = (this.currentCase as any)['options'][selectedIdx];
      this.selectedOption = opt;
      this.isCorrectAnswer = !!opt?.['isCorrect'];
      this.feedbackMessage = opt?.['feedback'] ?? '';
    } else {
      this.selectedOption = null;
    }
  }

  backToList() {
    this.narration.stop();
    this.selectedCourse = null;
    this.currentCase = undefined;
    this.isCompleted = false;
  }

  selectOption(option: any) {
    this.narration.stop();
    this.selectedOption = option;
    this.isAnswered = true;
    this.isCorrectAnswer = option['isCorrect'];
    this.feedbackMessage = option['feedback'];

    if (this.isCorrectAnswer) {
      this.score += 10;
    }

    const L = this.narrationLabels;
    this.narration.autoplay(
      `${this.isCorrectAnswer ? L.correct : L.incorrect} ${this.feedbackMessage}`,
      this.contentLang,
      'feedback-' + this.caseKey
    );
  }

  nextCase() {
    if (this.selectedCourse && this.selectedCourse.cases) {
      if (this.currentCaseIndex < this.selectedCourse.cases.length - 1) {
        this.currentCaseIndex++;
        this.currentCase = this.selectedCourse.cases[this.currentCaseIndex];
        this.selectedOption = null;
        this.isAnswered = false;
        this.autoNarrateCase();
      } else {
        this.narration.stop();
        this.isCompleted = true;

        // 🎯 REGISTRAR CURSO COMPLETADO PARA EL PROGRESO DEL CICLO Y DESBLOQUEO SECUENCIAL
        if (this.selectedCourse) {
          const courseId = this.selectedCourse.id;
          
          let completedIds: number[] = JSON.parse(localStorage.getItem('completed_course_ids') || '[]');
          
          if (!completedIds.includes(courseId)) {
            completedIds.push(courseId);
            localStorage.setItem('completed_course_ids', JSON.stringify(completedIds));
          }

          localStorage.setItem('completed_modules_count', completedIds.length.toString());
        }
      }
    }
  }

  private get narrationLabels() {
    return this.contentLang === 'en'
      ? { question: 'Question', options: 'Options', option: 'Option', correct: 'Correct.', incorrect: 'Incorrect.', tip: 'Expert strategy', concept: 'Advanced core concept' }
      : { question: 'Pregunta', options: 'Opciones', option: 'Opción', correct: 'Correcto.', incorrect: 'Incorrecto.', tip: 'Estrategia experta', concept: 'Concepto clave avanzado' };
  }

  get caseKey(): string { return `case-${this.selectedCourse?.id}-${this.currentCaseIndex}`; }
  get conceptKey(): string { return `concept-${this.selectedCourse?.id}`; }

  get caseNarrationText(): string {
    const c: any = this.currentCase;
    if (!c) return '';
    const L = this.narrationLabels;
    const opts = (c.options || []).map((o: any, i: number) => `${L.option} ${i + 1}: ${o.text}.`).join(' ');
    return `${c.title}. ${c.narrative} ${L.question}: ${c.question} ${L.options}: ${opts}`;
  }

  get conceptNarrationText(): string {
    const s: any = this.selectedCourse;
    if (!s) return '';
    const L = this.narrationLabels;
    let text = `${L.concept}. ${s.concept} ${L.tip}: ${s.expertTip}.`;
    if (s.extendedOverview) text += ` Análisis extendido: ${s.extendedOverview}.`;
    if (s.architectureOrFlow && s.architectureOrFlow.length > 0) text += ` Arquitectura y flujo de ataque: ${s.architectureOrFlow.join('. ')}.`;
    if (s.defenseStrategies && s.defenseStrategies.length > 0) text += ` Estrategias de defensa: ${s.defenseStrategies.join('. ')}.`;
    return text;
  }

  get showLangNote(): boolean {
    return !!this.selectedCourse && this.contentLang !== this.currentLanguage;
  }

  private autoNarrateCase() {
    if (this.currentCase) {
      this.narration.autoplay(this.caseNarrationText, this.contentLang, this.caseKey);
    }
  }
}