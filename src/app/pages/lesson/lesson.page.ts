import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { AppDetailHeaderComponent } from '../../components/detail-header/detail-header.component';

interface Lesson {
  id: string;
  title: string;
  caseDescription: string;
  question: string;
  hint?: string;
  points: number;
  options: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

@Component({
  selector: 'app-lesson',
  template: `
    <app-detail-header [title]="lesson?.title || 'Caso de Estudio'" (back)="goBack()"></app-detail-header>

    <ion-content class="ion-padding" style="--background: #f4f6f8;" *ngIf="lesson">
      <!-- Simulador de Terminal (Si aplica) -->
      <div *ngIf="isTerminalModule" style="background: #1e1e1e; color: #00ff00; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 12px; margin-bottom: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
        <p style="margin: 0 0 5px 0; color: #888;"># G&G Security Terminal v1.0.4</p>
        <p style="margin: 0; color: #fff;">root&#64;ahuihou-lab:~# diagnosing network anomalies...</p>
      </div>

      <!-- Presentación del caso de la vida real -->
      <ion-card style="border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); margin-bottom: 15px; margin-top: 0;">
        <ion-card-header style="background: rgba(43, 88, 125, 0.05); padding: 12px 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <ion-icon name="alert-circle-outline" style="color: #2B587D; font-size: 20px;"></ion-icon>
              <span style="font-weight: bold; color: #2B587D; font-size: 14px;">Situación Cotidiana</span>
            </div>
            <!-- Botón de Pista de Investigación -->
            <ion-button size="small" fill="clear" (click)="showHint()" style="color: #C18F6B; font-weight: bold; font-size: 12px;">
              <ion-icon name="bulb-outline" slot="start"></ion-icon> Pista
            </ion-button>
          </div>
        </ion-card-header>
        <ion-card-content style="padding-top: 12px;">
          <p style="font-size: 14px; color: #333; line-height: 1.4;">{{ lesson.caseDescription }}</p>
        </ion-card-content>
      </ion-card>

      <!-- Desafío / Pregunta -->
      <div style="margin-bottom: 15px; padding: 0 4px;">
        <h3 style="font-size: 15px; font-weight: bold; color: #222; line-height: 1.3;">{{ lesson.question }}</h3>
      </div>

      <!-- Opciones de decisión -->
      <div *ngFor="let option of lesson.options" style="margin-bottom: 10px;">
        <ion-button 
          expand="block" 
          fill="outline" 
          (click)="selectOption(option)"
          [disabled]="answered"
          style="--border-color: #2B587D; --color: #333; --border-radius: 12px; text-transform: none; text-align: left; height: auto; padding: 10px; --background: #fff;">
          <span style="font-size: 13px; width: 100%; line-height: 1.3;">{{ option.text }}</span>
        </ion-button>
      </div>

      <!-- Retroalimentación detallada y resolución -->
      <ion-card *ngIf="answered" [style.background]="isLastCorrect ? 'rgba(122, 167, 122, 0.15)' : 'rgba(158, 93, 59, 0.1)'" style="border-radius: 16px; margin-top: 20px; box-shadow: none;">
        <ion-card-content style="padding: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <ion-icon [name]="isLastCorrect ? 'checkmark-circle' : 'close-circle'" [style.color]="isLastCorrect ? '#7AA77A' : '#9E5D3B'" style="font-size: 22px;"></ion-icon>
            <h4 style="font-weight: bold; margin: 0; color: #333; font-size: 15px;">{{ isLastCorrect ? '¡Decisión Correcta!' : 'Precaución / Incorrecto' }}</h4>
          </div>
          <p style="font-size: 13px; color: #444; line-height: 1.3;">{{ feedbackMessage }}</p>

          <ion-button expand="block" (click)="finishLesson()" style="margin-top: 15px; --background: #2B7C59; border-radius: 10px; height: 42px; font-weight: 600;">
            Completar Caso (+{{ lesson.points }} XP)
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppDetailHeaderComponent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonIcon,
  ]
})
export class LessonPage implements OnInit {
  lessonId: string | null = null;
  lesson: Lesson | undefined;
  answered = false;
  isLastCorrect = false;
  feedbackMessage = '';
  isTerminalModule = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameData: GameDataService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('lessonId');
    const modules = this.gameData.getModules();
    for (const mod of modules) {
      if (mod.isTerminalChallenge) {
        const found = mod.lessons.find(l => l.id === this.lessonId);
        if (found) {
          this.isTerminalModule = true;
        }
      }
      const found = mod.lessons.find(l => l.id === this.lessonId);
      if (found) {
        this.lesson = found;
        break;
      }
    }
  }

  async showHint() {
    const alert = await this.alertController.create({
      header: 'Pista de Investigación',
      message: this.lesson?.hint || 'Analiza cuidadosamente los detalles del caso antes de decidir.',
      buttons: ['Entendido']
    });
    await alert.present();
  }

  selectOption(option: any) {
    this.answered = true;
    this.isLastCorrect = option.isCorrect;
    this.feedbackMessage = option.feedback;

    if (option.isCorrect && this.lesson) {
      this.gameData.completeLesson(this.lesson.id, this.lesson.points);
    }
  }

  goBack() {
    this.router.navigate(['/modules']);
  }

  finishLesson() {
    this.router.navigate(['/modules']);
  }
}