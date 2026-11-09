import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as CoursesData from '../../core/data/courses.data';
import { Course, CaseStudy } from '../../core/data/courses.data';
import { IonContent } from '@ionic/angular';
import { AppDetailHeaderComponent } from '../../components/detail-header/detail-header.component';

const COURSES_DATA = Object.values(CoursesData).find(
  (value): value is Course[] => Array.isArray(value)
) ?? [];

@Component({
  selector: 'app-course-detail',
  template: `
    <!-- Forzamos un contenedor seguro con altura completa -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background: #D6C5B2; display: flex; flex-direction: column;">
      <app-detail-header [title]="course?.['title'] || 'Cargando curso...'" (back)="goBack()"></app-detail-header>
      <ion-content class="ion-padding" style="--background: #D6C5B2; flex: 1; min-height: 0;">

        <div *ngIf="!course" style="background: #ffcccc; padding: 20px; border-radius: 8px; text-align: center; color: #900; margin-top: 20px;">
          <h3>⚠️ Buscando curso...</h3>
          <p>ID intentado: <strong>{{ courseId }}</strong></p>
        </div>

        <div class="detail-content" *ngIf="course">
          <div class="info-card">
            <h3>💡 Concepto Clave</h3>
            <p>{{ course['concept'] }}</p>
            <div class="tip-box">
              <strong>Consejo Experto:</strong> {{ course['expertTip'] }}
            </div>
          </div>

          <div class="cases-section" *ngIf="currentCase">
            <div class="case-header-row">
              <h4>Caso {{ currentCaseIndex + 1 }} de {{ course['cases'].length }}: {{ currentCase['title'] }}</h4>
              <button class="tts-btn" (click)="playNarrative(currentCase['narrative'])">🔊 Reproducir Audio</button>
            </div>
            <p class="narrative-text">{{ currentCase['narrative'] }}</p>
            
            <div class="question-box">
              <h5>{{ currentCase['question'] }}</h5>
              <div class="options-list">
                <button *ngFor="let option of currentCase['options']" 
                        class="option-btn"
                        [class.correct]="selectedOption === option && option['isCorrect']"
                        [class.incorrect]="selectedOption === option && !option['isCorrect']"
                        [disabled]="isAnswered"
                        (click)="selectOption(option)">
                  {{ option['text'] }}
                </button>
              </div>
            </div>

            <div class="feedback-box" *ngIf="isAnswered">
              <p [class.success-text]="isCorrectAnswer" [class.error-text]="!isCorrectAnswer">
                {{ feedbackMessage }}
              </p>
              <button class="next-case-btn" (click)="nextCase()">
                {{ currentCaseIndex < course['cases'].length - 1 ? 'Siguiente Caso ➔' : '¡Completar Curso! 🏆' }}
              </button>
            </div>
          </div>
        </div>
      </ion-content>
    </div>
  `,
  styles: [`
    :host { display: block; position: relative; width: 100%; height: 100%; }
    .detail-content { max-width: 600px; margin: 0 auto; width: 100%; padding-bottom: 40px; }
    .info-card { background: #fff; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
    .info-card h3 { font-size: 14px; color: #2B587D; margin-top: 0; }
    .tip-box { background: rgba(43,88,125,0.08); padding: 10px; border-radius: 8px; font-size: 12px; margin-top: 8px; }
    .cases-section { background: #fff; padding: 16px; border-radius: 12px; margin-bottom: 40px; }
    .case-header-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; }
    .tts-btn { background: #2B587D; color: #fff; border: none; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; }
    .narrative-text { font-size: 13px; color: #444; line-height: 1.4; background: #f9f9f9; padding: 12px; border-radius: 8px; }
    .question-box h5 { font-size: 13px; color: #2B587D; margin: 14px 0 8px 0; }
    .options-list { display: flex; flex-direction: column; gap: 8px; }
    .option-btn { background: #f1f1f1; border: 1px solid #ddd; padding: 10px; border-radius: 8px; text-align: left; font-size: 12px; cursor: pointer; }
    .option-btn.correct { background: #d4edda; border-color: #c3e6cb; color: #155724; }
    .option-btn.incorrect { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
    .feedback-box { margin-top: 14px; padding: 10px; background: #f8f9fa; border-radius: 8px; text-align: center; }
    .success-text { color: #28a745; font-weight: bold; font-size: 12px; }
    .error-text { color: #dc3545; font-weight: bold; font-size: 12px; }
    .next-case-btn { margin-top: 8px; background: #2B587D; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; }
  `],
  standalone: true,
  imports: [CommonModule, IonContent, AppDetailHeaderComponent]
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  courseId: string | null = null;
  course?: Course;
  currentCaseIndex: number = 0;
  currentCase?: CaseStudy;
  selectedOption: any = null;
  isAnswered: boolean = false;
  isCorrectAnswer: boolean = false;
  feedbackMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Usamos subscribe para detectar cambios en el ID incluso si ya estamos en la vista de detalle
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      
      if (this.courseId) {
        const numericId = Number(this.courseId);
        this.course = COURSES_DATA.find((c: Course) => Number(c['id']) === numericId);
        
        // Reiniciamos los estados del curso actual
        this.currentCaseIndex = 0;
        this.selectedOption = null;
        this.isAnswered = false;
        
        if (this.course && this.course.cases && this.course.cases.length > 0) {
          this.currentCase = this.course.cases[0];
          this.playNarrative(this.currentCase['narrative']);
        } else {
          this.currentCase = undefined;
        }
      }
    });
  }

  ngOnDestroy() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  playNarrative(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      setTimeout(() => { window.speechSynthesis.speak(utterance); }, 300);
    }
  }

  selectOption(option: any) {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
    this.selectedOption = option;
    this.isAnswered = true;
    this.isCorrectAnswer = option['isCorrect'];
    this.feedbackMessage = option['feedback'];
  }

  nextCase() {
    if (this.course && this.currentCaseIndex < this.course['cases'].length - 1) {
      this.currentCaseIndex++;
      this.currentCase = this.course['cases'][this.currentCaseIndex];
      this.selectedOption = null;
      this.isAnswered = false;
      if (this.currentCase) { this.playRawNarrative(this.currentCase['narrative']); }
    } else {
      this.router.navigate(['/modules']);
    }
  }

  playRawNarrative(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      setTimeout(() => { window.speechSynthesis.speak(utterance); }, 300);
    }
  }

  goBack() {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
    this.router.navigate(['/modules']);
  }
}