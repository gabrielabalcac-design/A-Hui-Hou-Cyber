import { Component, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

interface ChallengeOption {
  text: string;
  correct: boolean;
}

interface Challenge {
  level: string;
  question: string;
  options: ChallengeOption[];
  explanation: string;
}

interface IncidentAction {
  text: string;
  correct: boolean;
  message: string;
}

interface Incident {
  level: string;
  alertCode: string;
  description: string;
  actions: IncidentAction[];
}

interface DailyMission {
  id: number;
  titleKey: string;
  completed: boolean;
  reward: string;
}

@Component({
  selector: 'app-home',
  template: `
    <app-header [showLogo]="true"></app-header>

    <main class="app-content">
      <div class="home-container">
        
        <div class="welcome-card">
          <div class="welcome-content">
            <span class="badge">{{ 'CONTROL_PANEL' | translate }}</span>
            <h2>{{ 'WELCOME_TITLE' | translate: { name: userNickname } }}</h2>
            <p>{{ 'WELCOME_DESC' | translate }}</p>
          </div>
          <div class="welcome-logo-badge">
            <img src="assets/Sublogo.jpg" alt="Badge Logo" class="welcome-badge-img">
          </div>
        </div>

        <div class="dashboard-cards">
          <div class="dash-col">
            <div class="difficulty-selector-card">
              <div class="diff-header">
                <span>🎚️ {{ 'TACTICAL_DIFFICULTY' | translate }}:</span>
                <span class="current-diff-label">{{ 'DIFF_' + selectedDifficulty.toUpperCase() | translate }}</span>
              </div>
              <div class="diff-buttons">
                <button class="btn-diff" [class.active]="selectedDifficulty === 'Principiante'" (click)="setDifficulty('Principiante')">{{ 'DIFF_PRINCIPIANTE' | translate }}</button>
                <button class="btn-diff" [class.active]="selectedDifficulty === 'Intermedio'" (click)="setDifficulty('Intermedio')">{{ 'DIFF_INTERMEDIO' | translate }}</button>
                <button class="btn-diff" [class.active]="selectedDifficulty === 'Avanzado'" (click)="setDifficulty('Avanzado')">{{ 'DIFF_AVANZADO' | translate }}</button>
              </div>
            </div>

            <div class="daily-missions-card">
              <div class="missions-header">
                <h3>🎯 {{ 'DAILY_MISSIONS_TITLE' | translate }}</h3>
                <span class="missions-progress">{{ completedMissionsCount }} / 3 {{ 'COMPLETED_SUFFIX' | translate }}</span>
              </div>
              <div class="mission-item" *ngFor="let m of dailyMissions" [class.done]="m.completed">
                <div class="mission-check">
                  <span *ngIf="m.completed">✅</span>
                  <span *ngIf="!m.completed">⏳</span>
                </div>
                <div class="mission-info">
                  <p class="mission-name">{{ m.titleKey | translate }}</p>
                  <span class="mission-reward">{{ m.reward }}</span>
                </div>
              </div>
            </div>

            <div class="flash-challenge-card">
              <div class="challenge-header">
                <div class="challenge-title-group">
                  <span class="challenge-icon">⚡</span>
                  <h3>{{ 'FLASH_CHALLENGE_TITLE' | translate }} ({{ 'DIFF_' + selectedDifficulty.toUpperCase() | translate }})</h3>
                </div>
                <span class="challenge-reward">+50 XP</span>
              </div>
              
              <p class="challenge-question">{{ currentChallenge.question }}</p>

              <div *ngIf="!challengeAnswered" class="challenge-options">
                <button *ngFor="let opt of currentChallenge.options" 
                        class="btn-option" 
                        (click)="answerChallenge(opt.correct)">
                  {{ opt.text }}
                </button>
              </div>

              <div *ngIf="challengeAnswered" class="challenge-feedback" [class.success]="isCorrect" [class.error]="!isCorrect">
                <p>{{ feedbackMessage }}</p>
                <button class="btn-retry" (click)="loadRandomChallenge()">{{ 'NEXT_CHALLENGE_BTN' | translate }}</button>
              </div>
            </div>
          </div>

          <div class="dash-col">
            <div class="tactical-tip-card">
              <div class="tip-header">
                <span class="tip-icon">💡</span>
                <h3>{{ 'TACTICAL_TIP_TITLE' | translate }}</h3>
              </div>
              <p class="tip-text">{{ currentTip }}</p>
              <button class="btn-next-tip" (click)="loadNextTip()">{{ 'NEXT_TIP_BTN' | translate }}</button>
            </div>

            <div class="progress-card">
              <div class="progress-header">
                <h3>{{ 'CYCLE_PROGRESS_TITLE' | translate }}</h3>
                <span class="progress-percentage">{{ cycleProgressPercent }}%</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" [style.width.%]="cycleProgressPercent"></div>
              </div>
              <p class="progress-text">
                {{ completedModulesCount }} de {{ totalModulesCount }} módulos de ciberseguridad completados.
              </p>
            </div>

            <div class="incident-simulator-card">
              <div class="simulator-header">
                <div class="simulator-title-group">
                  <span class="simulator-icon">🚨</span>
                  <h3>{{ 'SOC_SIMULATOR_TITLE' | translate }} ({{ 'DIFF_' + selectedDifficulty.toUpperCase() | translate }})</h3>
                </div>
                <span class="simulator-badge">{{ 'ACTIVE_PRACTICE_BADGE' | translate }}</span>
              </div>

              <p class="simulator-desc">{{ 'SOC_SIMULATOR_DESC' | translate }}</p>

              <div class="alert-box">
                <code>[{{ currentIncident.alertCode }}] {{ currentIncident.description }}</code>
              </div>

              <div *ngIf="!incidentReported" class="simulator-actions">
                <button *ngFor="let act of currentIncident.actions" 
                        class="btn-action" 
                        (click)="handleIncidentAction(act)">
                  {{ act.text }}
                </button>
              </div>

              <div *ngIf="incidentReported" class="simulator-feedback" [class.success]="incidentCorrect" [class.error]="!incidentCorrect">
                <p>{{ incidentFeedbackMsg }}</p>
                <button class="btn-retry" (click)="loadRandomIncident()">{{ 'ANALYZE_OTHER_ALERT_BTN' | translate }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= SECCIÓN INFERIOR: ACCESOS DIRECTOS E INSIGNIAS EN DOS COLUMNAS ================= -->
        <div class="bottom-sections" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; align-items: start;">
          
          <!-- COLUMNA IZQUIERDA: Accesos Directos -->
          <section class="home-section" style="margin-top: 0;">
            <div class="section-title" style="margin-bottom: 12px;">
              <h3 style="color: #1a364d; font-size: 16px; font-weight: 700; margin: 0;">{{ 'SHORTCUTS_TITLE' | translate }}</h3>
            </div>
            
            <div class="grid-menu" style="display: flex; flex-direction: column; gap: 12px;">
              <div class="menu-card course-card" role="link" tabindex="0" (click)="openLearningModule('/modules')" (keydown.enter)="openLearningModule('/modules')" style="cursor: pointer; padding: 16px; border-radius: 14px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div class="icon-box course-icon" style="font-size: 24px; margin-bottom: 6px;">📚</div>
                <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #2B587D; font-weight: 700;">{{ 'MENU_MODULES_TITLE' | translate }}</h4>
                <p style="margin: 0; font-size: 11.5px; color: #64748b;">{{ 'MENU_MODULES_DESC' | translate }}</p>
              </div>

              <div class="menu-card game-card" role="link" tabindex="0" (click)="navigateTo('/games')" (keydown.enter)="navigateTo('/games')" style="cursor: pointer; padding: 16px; border-radius: 14px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div class="icon-box game-icon" style="font-size: 24px; margin-bottom: 6px;">🎮</div>
                <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #2B587D; font-weight: 700;">{{ 'MENU_GAMES_TITLE' | translate }}</h4>
                <p style="margin: 0; font-size: 11.5px; color: #64748b;">{{ 'MENU_GAMES_DESC' | translate }}</p>
              </div>
            </div>
          </section>

          <!-- COLUMNA DERECHA: Insignias de Defensor -->
          <div class="badges-section" style="margin-top: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="color: #1a364d; font-size: 16px; font-weight: 700; margin: 0;">
                🏅 Insignias de Defensor
              </h3>
              <span style="font-size: 12px; color: #64748b; font-weight: 600;">
                {{ (completedModulesCount > 0 ? 1 : 0) + (userStreak > 0 ? 1 : 0) }} de 2 desbloqueadas
              </span>
            </div>
            
            <div class="badges-grid" style="display: flex; flex-direction: column; gap: 12px;">
              
              <!-- Insignia 1: Analista Phishing -->
              <div class="badge-card" 
                   [style.border-color]="completedModulesCount > 0 ? '#10b981' : '#e2e8f0'"
                   [style.background]="completedModulesCount > 0 ? '#f0fdf4' : '#ffffff'"
                   style="padding: 16px; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1.5px solid; transition: all 0.3s ease; position: relative; overflow: hidden;">
                
                <span style="position: absolute; top: 12px; right: 12px; font-size: 12px;">
                  {{ completedModulesCount > 0 ? '✅' : '🔒' }}
                </span>

                <div style="font-size: 24px; margin-bottom: 6px;">🛡️</div>
                <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #2B587D; font-weight: 700;">Analista Phishing</h4>
                <p style="margin: 0; font-size: 11.5px; color: #64748b;">
                  {{ completedModulesCount > 0 ? 'Módulo superado' : 'Completa 1 módulo' }}
                </p>
              </div>

              <!-- Insignia 2: Racha Activa -->
              <div class="badge-card" 
                   [style.border-color]="userStreak > 0 ? '#f59e0b' : '#e2e8f0'"
                   [style.background]="userStreak > 0 ? '#fffbeb' : '#ffffff'"
                   style="padding: 16px; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1.5px solid; transition: all 0.3s ease; position: relative; overflow: hidden;">
                
                <span style="position: absolute; top: 12px; right: 12px; font-size: 12px;">
                  {{ userStreak > 0 ? '🔥' : '🔒' }}
                </span>

                <div style="font-size: 24px; margin-bottom: 6px;">⚡</div>
                <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #2B587D; font-weight: 700;">Racha x{{ userStreak }}</h4>
                <p style="margin: 0; font-size: 11.5px; color: #64748b;">
                  {{ userStreak > 0 ? userStreak + ' días seguidos' : 'Sin racha activa' }}
                </p>
              </div>

            </div>
          </div>

        </div>


      </div>
    </main>

    <app-footer-nav activeTab="home"></app-footer-nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      background-color: #D6C5B2;
      overflow-y: auto;
    }
    .app-header {
      background-color: #2B587D;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10;
      position: sticky;
      top: 0;
    }
    .brand-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-logo {
      width: 62px;
      height: 62px;
      object-fit: contain;
      background: transparent;
    }
    .header-title-wrapper {
      height: 40px;
      display: flex;
      align-items: center;
    }
    .header-title-img {
      height: 34px;
      object-fit: contain;
    }
    .transparent-bg {
      mix-blend-mode: multiply;
    }
    .app-content {
      flex: 1;
      overflow-y: visible;
      background-color: #D6C5B2;
    }
    .home-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px 16px 100px 16px;
    }

    .welcome-card {
      background: linear-gradient(135deg, #2B587D, #2B7C59);
      border-radius: 20px;
      padding: 22px;
      color: #ffffff;
      box-shadow: 0 6px 20px rgba(43,88,125,0.25);
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .welcome-content {
      flex: 1;
    }
    .welcome-logo-badge {
      width: 115px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 12px;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .welcome-badge-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .welcome-card .badge {
      background: rgba(255,255,255,0.2);
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .welcome-card h2 {
      font-size: 20px;
      font-weight: 800;
      margin: 10px 0 4px 0;
    }
    .welcome-card p {
      font-size: 12px;
      opacity: 0.9;
      margin: 0;
      line-height: 1.4;
    }
    .difficulty-selector-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 20px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.04);
    }
    .diff-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #2B587D;
      margin-bottom: 10px;
    }
    .current-diff-label {
      background: rgba(43,88,125,0.1);
      padding: 2px 8px;
      border-radius: 6px;
      color: #2B587D;
    }
    .diff-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    .btn-diff {
      background: #f4f4f4;
      border: 1px solid #ddd;
      color: #555;
      padding: 8px 4px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-diff.active {
      background: #2B587D;
      color: #ffffff;
      border-color: #2B587D;
    }
    .tactical-tip-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      border-left: 6px solid #D97706;
    }
    .tip-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .tip-icon {
      font-size: 16px;
    }
    .tip-header h3 {
      font-size: 14px;
      font-weight: 700;
      color: #2B587D;
      margin: 0;
    }
    .tip-text {
      font-size: 12px;
      color: #444;
      margin: 0 0 10px 0;
      line-height: 1.4;
    }
    .btn-next-tip {
      background: transparent;
      border: none;
      font-size: 11px;
      color: #D97706;
      font-weight: bold;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }
    .daily-missions-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }
    .missions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .missions-header h3 {
      font-size: 14px;
      font-weight: 700;
      color: #2B587D;
      margin: 0;
    }
    .missions-progress {
      font-size: 11px;
      font-weight: bold;
      color: #2B7C59;
    }
    .mission-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      background: #f9f9f9;
      border-radius: 10px;
      margin-bottom: 8px;
      border: 1px solid #eee;
    }
    .mission-item.done {
      background: rgba(43,124,89,0.05);
      border-color: rgba(43,124,89,0.2);
    }
    .mission-check {
      font-size: 14px;
    }
    .mission-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mission-name {
      font-size: 12px;
      color: #333;
      margin: 0;
      font-weight: 500;
    }
    .mission-item.done .mission-name {
      text-decoration: line-through;
      color: #777;
    }
    .mission-reward {
      font-size: 10px;
      background: #2B7C59;
      color: #fff;
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: bold;
    }
    .progress-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .progress-header h3 {
      font-size: 15px;
      font-weight: 700;
      color: #2B587D;
      margin: 0;
    }
    .progress-percentage {
      font-size: 14px;
      font-weight: bold;
      color: #2B7C59;
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #2B587D, #2B7C59);
      border-radius: 4px;
    }
    .progress-text {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    .flash-challenge-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      border-top: 4px solid #C18F6B;
    }
    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .challenge-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .challenge-icon {
      font-size: 16px;
    }
    .challenge-header h3 {
      font-size: 15px;
      font-weight: 700;
      color: #2B587D;
      margin: 0;
    }
    .challenge-reward {
      background: rgba(193,143,107,0.15);
      color: #C18F6B;
      font-size: 11px;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 8px;
    }
    .challenge-question {
      font-size: 13px;
      color: #444;
      margin: 0 0 14px 0;
      line-height: 1.4;
    }
    .challenge-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn-option {
      background: #f4f4f4;
      border: 1px solid #ddd;
      color: #333;
      padding: 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .btn-option:hover {
      background: #eaeaea;
      border-color: #ccc;
    }
    .incident-simulator-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      border-top: 4px solid #2B587D;
    }
    .simulator-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .simulator-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .simulator-icon {
      font-size: 16px;
    }
    .simulator-header h3 {
      font-size: 15px;
      font-weight: 700;
      color: #2B587D;
      margin: 0;
    }
    .simulator-badge {
      background: rgba(43,88,125,0.1);
      color: #2B587D;
      font-size: 11px;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 8px;
    }
    .simulator-desc {
      font-size: 13px;
      color: #444;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }
    .alert-box {
      background: #222;
      color: #a8ff60;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 11px;
      margin-bottom: 14px;
      overflow-x: auto;
      font-family: monospace;
    }
    .simulator-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .btn-action {
      background: #f4f4f4;
      border: 1px solid #ddd;
      color: #333;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }
    .btn-action:hover {
      background: #eaeaea;
      border-color: #ccc;
    }
    .challenge-feedback, .simulator-feedback {
      padding: 12px;
      border-radius: 10px;
      text-align: center;
    }
    .challenge-feedback.success, .simulator-feedback.success {
      background: rgba(43,124,89,0.1);
      border: 1px solid #2B7C59;
      color: #2B7C59;
    }
    .challenge-feedback.error, .simulator-feedback.error {
      background: rgba(193,59,59,0.1);
      border: 1px solid #C13B3B;
      color: #C13B3B;
    }
    .challenge-feedback p, .simulator-feedback p {
      font-size: 12px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }
    .btn-retry {
      background: transparent;
      border: none;
      font-size: 11px;
      text-decoration: underline;
      cursor: pointer;
      color: inherit;
      font-weight: bold;
    }
    .section-title h3 {
      font-size: 15px;
      font-weight: 700;
      color: #2B587D;
      margin: 0 0 12px 0;
    }
    .badges-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .achievement-badge {
      background: #ffffff;
      border-radius: 14px;
      padding: 14px;
      text-align: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.04);
      border-bottom: 3px solid #7AA77A;
    }
    .badge-icon {
      font-size: 22px;
      margin-bottom: 6px;
    }
    .achievement-badge h4 {
      font-size: 13px;
      font-weight: 700;
      color: #2B587D;
      margin: 0 0 2px 0;
    }
    .achievement-badge p {
      font-size: 11px;
      color: #777;
      margin: 0;
    }
    .grid-menu {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .menu-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 18px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      display: block;
    }
    .course-card { border-top: 4px solid #C18F6B; }
    .game-card { border-top: 4px solid #9E5D3B; }
    .icon-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .course-icon { background: rgba(193,143,107,0.15); color: #C18F6B; }
    .game-icon { background: rgba(158,93,59,0.15); color: #9E5D3B; }
    .menu-card h4 {
      font-size: 14px;
      font-weight: 700;
      color: #2B587D;
      margin: 0 0 4px 0;
    }
    .menu-card p {
      font-size: 11px;
      color: #777;
      margin: 0;
      line-height: 1.3;
    }

    /* ================= ESCRITORIO (≥ 900px) ================= */
    /* Dashboard: en móvil una sola columna (mismo orden de siempre); en escritorio dos columnas independientes */
    .dashboard-cards {
      display: flex;
      flex-direction: column;
    }
    .dash-col { display: contents; }
    .difficulty-selector-card { order: 1; }
    .tactical-tip-card        { order: 2; }
    .daily-missions-card      { order: 3; }
    .progress-card            { order: 4; }
    .flash-challenge-card     { order: 5; }
    .incident-simulator-card  { order: 6; }

    @media (min-width: 900px) {
      .home-container {
        max-width: 1120px;
        padding: 28px 28px 100px 28px;
      }
      .welcome-card { margin-bottom: 22px; }

      .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 22px;
        align-items: start;
      }
      .dash-col {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 0;
      }
      .dash-col > * { margin: 0 !important; }

      .bottom-sections {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 22px;
        margin-top: 28px;
        align-items: stretch;
      }
      .home-section { min-width: 0; display: flex; flex-direction: column; }
      .home-section .section-title { margin-top: 0 !important; }
      .home-section .badges-grid,
      .home-section .grid-menu { flex: 1; margin-bottom: 0; }
      .badges-grid { grid-template-columns: repeat(2, 1fr); }
      .grid-menu { grid-template-columns: repeat(2, 1fr); }
      .achievement-badge,
      .menu-card { height: 100%; box-sizing: border-box; }
    }
  `],
  standalone: true,
  imports: [AppHeaderComponent, 
    CommonModule, 
    RouterModule, 
    FormsModule,
    FooterNavComponent,
    TranslatePipe
  ]
})
export class HomePage implements OnInit, OnDestroy {
  userNickname = 'Defensor';
  userStreak = 5;
  userXp: number = 1250;
  completedModulesCount: number = 0;
  totalModulesCount: number = 5; 
  cycleProgressPercent: number = 0;
  selectedDifficulty: 'Principiante' | 'Intermedio' | 'Avanzado' = 'Principiante';

  get currentLanguage(): 'es' | 'en' { return this.lang.current; }
  private destroyRef = inject(DestroyRef);

  tacticalTipsEs: string[] = [
    'Nunca reutilices la misma contraseña en plataformas críticas y redes sociales.',
    'Utiliza aplicaciones de autenticación por tokens (2FA) en lugar de códigos por SMS siempre que sea posible.',
    'Utiliza un gestor de contraseñas seguro para almacenar credenciales complejas y únicas.',
    'Cambia inmediatamente las contraseñas por defecto en cualquier router o dispositivo IoT nuevo.',
    'Implementa frases de contraseña (passphrases) largas en lugar de claves cortas y complejas difíciles de recordar.',
    'Nunca escribas tus contraseñas en notas de papel adhesivas cerca de tu monitor.',
    'No compartas tus credenciales de acceso ni siquiera con compañeros de confianza dentro de la organización.',
    'Configura la autenticación biométrica en tus dispositivos móviles como capa adicional de seguridad.',
    'Evita utilizar datos personales obvios (fechas de nacimiento, nombres de mascotas) en tus claves.',
    'Rota tus claves de acceso corporativas y de administrador de forma periódica.',
    'Verifica siempre el dominio real del remitente antes de hacer clic en enlaces de correo.',
    'Sospecha de llamadas o mensajes urgentes que soliciten códigos de verificación o transferencias bancarias.',
    'Desconfía de ofertas laborales o premios demasiado buenos para ser verdad recibidos por mensajería.',
    'No descargues archivos adjuntos inesperados de remitentes desconocidos o sospechosos.',
    'Verifica la ortografía y redacción en correos electrónicos corporativos para detectar posibles ataques de phishing.',
    'Nunca escanees códigos QR impresos en la calle o lugares públicos sin verificar el enlace de destino.',
    'Desconfía de supuestas alertas de soporte técnico que aparezcan de la nada en tu navegador web.',
    'Educa continuamente a tu entorno sobre las nuevas modalidades de estafas digitales y suplantación.',
    'No reveles información sensible de la empresa en redes sociales o foros públicos.',
    'Verifica siempre por un canal alternativo oficial si un jefe o directivo te pide una transferencia urgente.',
    'Mantén tu navegador y sistema operativo actualizados para parchear vulnerabilidades críticas.',
    'Configura actualizaciones automáticas en tus sistemas operativos y software esencial.',
    'Instala un antivirus o solución EDR actualizada que analice archivos descargados en tiempo real.',
    'Desactiva la ejecución automática de macros y scripts en documentos descargados de internet.',
    'Realiza análisis completos de malware en tus equipos de manera periódica.',
    'No descargues software pirata o de fuentes no oficiales, ya que suelen contener troyanos.',
    'Utiliza herramientas de análisis estático (SAST) y dependencias seguras en tus proyectos de software.',
    'Cifra siempre los discos de almacenamiento de tus equipos portátiles con BitLocker o LUKS.',
    'Configura el bloqueo automático de pantalla en todos tus dispositivos tras pocos minutos de inactividad.',
    'Desinstala aplicaciones y software obsoleto que ya no utilices en tus equipos.',
    'Desactiva el Bluetooth y Wi-Fi cuando no los estés utilizando en lugares públicos.',
    'Evita conectarte a redes Wi-Fi públicas abiertas sin utilizar una Red Privada Virtual (VPN) confiable.',
    'Configura redes de invitados separadas en tu router doméstico para visitantes o dispositivos IoT.',
    'Cambia la contraseña de administración y desactiva el acceso remoto WAN en tu enrutador casero.',
    'Utiliza protocolos cifrados (HTTPS, SFTP, SSH) en todas tus comunicaciones web y de red.',
    'Verifica regularmente el estado de los certificados SSL/TLS en servicios web institucionales.',
    'Evita el uso de redes Wi-Fi de hoteles o aeropuertos para realizar operaciones bancarias sensibles.',
    'Deshabilita servicios de red innecesarios o puertos abiertos en tus servidores de desarrollo.',
    'Monitorea el tráfico de red en busca de anomalías o peticiones salientes hacia dominios desconocidos.',
    'Utiliza cortafuegos (firewalls) configurados restrictivamente tanto en red como a nivel de host.',
    'Realiza copias de seguridad periódicas de tus archivos importantes siguiendo la regla 3-2-1.',
    'Almacena al menos una copia de seguridad en un soporte físico totalmente desconectado (air-gapped).',
    'Prueba la integridad y la restauración de tus backups de forma regular.',
    'Cifra tus archivos de respaldo en la nube para evitar accesos no autorizados en caso de brecha del proveedor.',
    'Documenta los planes de recuperación ante desastres y ataques de ransomware.',
    'Mantén respaldos inmutables para proteger la información contra borrados maliciosos.',
    'No guardes copias de seguridad en la misma partición física que el sistema operativo principal.',
    'Verifica los hashes criptográficos (SHA-256) de los instaladores y copias descargadas importantes.',
    'Automatiza las rutinas de respaldo para evitar depender de intervenciones manuales olvidadas.',
    'Guarda inventarios actualizados de tus activos digitales críticos y dónde se respaldan.',
    'Revisa periódicamente los permisos que otorgan las aplicaciones móviles a cámara y micrófono.',
    'No otorgues permisos de accesibilidad o superposición de pantalla a apps móviles de origen dudoso.',
    'Mantén el sistema operativo de tu smartphone siempre actualizado con los últimos parches de seguridad.',
    'Descarga aplicaciones móviles únicamente desde tiendas oficiales y verificadas (Google Play, App Store).',
    'Cierra sesión en tus aplicaciones móviles financieras si prestas tu teléfono a otra persona.',
    'Utiliza un PIN o patrón de desbloqueo robusto y biometría en tu smartphone.',
    'Desactiva la vista previa de mensajes sensibles en la pantalla de bloqueo de tu teléfono.',
    'Evita conectar tu teléfono a estaciones de carga USB públicas gratuitas (juice jacking).',
    'Configura la opción de rastreo y borrado remoto de tu dispositivo móvil en caso de pérdida.',
    'Revisa las autorizaciones de inicio de sesión de Google, Apple o redes sociales en aplicaciones terceras.',
    'Utiliza navegadores orientados a la privacidad y extensiones bloqueadoras de rastreadores.',
    'Borra el caché y las cookies del navegador periódicamente en equipos de uso compartido.',
    'Navega en modo incógnito cuando utilices computadoras públicas, pero recuerda que no oculta tu actividad al proveedor.',
    'Lee las políticas de privacidad y los permisos solicitados antes de instalar extensiones de navegador.',
    'Desactiva la geolocalización en las configuraciones de tu navegador web por defecto.',
    'Utiliza motores de búsqueda que no almacenen tu historial de consultas personales.',
    'Configura alertas en tiempo real para transacciones bancarias y movimientos inusuales.',
    'Monitorea periódicamente tus reportes de crédito para detectar posibles robos de identidad.',
    'Utiliza tarjetas virtuales de un solo uso para compras en sitios web de comercio electrónico poco conocidos.',
    'No guardes contraseñas ni datos de tarjetas de crédito guardados automáticamente en navegadores públicos.',
    'Implementa el principio de mínimo privilegio en todos los entornos de desarrollo y producción.',
    'Separa los entornos de pruebas (staging) de los entornos de producción reales.',
    'Revisa y audita las dependencias de código abierto (npm, pip) en busca de vulnerabilidades conocidas.',
    'Nunca expongas claves de API, tokens o credenciales de base de datos en repositorios públicos de Git.',
    'Utiliza variables de entorno seguras para gestionar configuraciones sensibles en tus aplicaciones.',
    'Realiza revisiones de código cruzadas (code reviews) enfocadas en aspectos de seguridad antes de fusionar ramas.',
    'Sanitiza y valida todas las entradas de usuario para prevenir ataques de inyección SQL y XSS.',
    'Implementa cabeceras de seguridad HTTP robustas (CSP, HSTS, X-Frame-Options) en tus aplicaciones web.',
    'Actualiza de inmediato las librerías y frameworks con fallos de seguridad reportados (CVE).',
    'Realiza pruebas de penetración (pentesting) periódicas en tus plataformas antes de lanzarlas al público.',
    'Nunca conectes unidades USB de origen desconocido o encontradas en la vía pública.',
    'Destruye físicamente o realiza un borrado seguro de discos duros antes de desechar equipos viejos.',
    'Bloquea físicamente tu estación de trabajo cada vez que te alejes de tu escritorio.',
    'No permitas el acceso a personas no autorizadas en áreas de servidores o zonas de trabajo sensibles.',
    'Utiliza trituradoras de papel para destruir documentos físicos que contengan información confidencial.',
    'Reporta de inmediato cualquier pérdida de credenciales, tarjetas o dispositivos corporativos.',
    'No dejes impresiones con datos sensibles olvidadas en las bandejas de impresoras compartidas.',
    'Identifica y cuestiona a personas desconocidas que deambulen por zonas restringidas de la oficina (tailgating).',
    'Mantén las pizarras de trabajo limpias de información confidencial al finalizar la jornada laboral.',
    'Participa activamente en los simulacros de concientización y phishing organizados por tu empresa.',
    'Configura autenticación multifactor en tus cuentas de correo personal y laboral de forma obligatoria.',
    'Desactiva el acceso remoto por Escritorio Remoto (RDP) expuesto directamente a internet sin pasarela VPN.',
    'Utiliza servicios de almacenamiento en la nube cifrados de extremo a extremo para información altamente confidencial.',
    'Revisa los registros de auditoría (logs) de tus servidores web en busca de intentos de fuerza bruta o escaneos.',
    'Evita usar contraseñas basadas en palabras del diccionario o secuencias numéricas sencillas.',
    'Mantén copias físicas o digitales de números de emergencia y contactos de respuesta a incidentes.',
    'Desconfía de correos electrónicos que amenacen con cerrar tus cuentas si no haces clic en un enlace inmediato.',
    'Utiliza herramientas de escaneo de vulnerabilidades automatizadas en tus redes locales de forma programada.',
    'Revisa los permisos de recursos compartidos en red para asegurar que solo accedan los usuarios autorizados.',
    'Adopta una mentalidad de "Cero Confianza" (Zero Trust) donde cada acceso digital sea verificado y validado constantemente.'
  ];

  tacticalTipsEn: string[] = [
    'Never reuse the same password on critical platforms and social media.',
    'Use token authentication apps (2FA) instead of SMS codes whenever possible.',
    'Use a secure password manager to store complex and unique credentials.',
    'Immediately change default credentials on any new router or IoT device.',
    'Implement long passphrases instead of short, complex passwords that are hard to remember.',
    'Never write your passwords down on sticky notes near your monitor.',
    'Do not share your access credentials even with trusted colleagues within the organization.',
    'Configure biometric authentication on your mobile devices as an additional security layer.',
    'Avoid using obvious personal data (birthdays, pet names) in your keys.',
    'Periodically rotate your corporate and administrator access keys.',
    'Always verify the actual sender domain before clicking on email links.',
    'Be suspicious of urgent calls or messages requesting verification codes or financial transfers.',
    'Beware of job offers or prizes that sound too good to be true received via messaging.',
    'Do not download unexpected attachments from unknown or suspicious senders.',
    'Check spelling and wording in corporate emails to detect potential phishing attacks.',
    'Never scan QR codes printed on the street or public places without verifying the destination link.',
    'Beware of fake technical support alerts popping up out of nowhere in your web browser.',
    'Continuously educate your peers on emerging digital scams and identity spoofing.',
    'Do not disclose sensitive corporate information on social media or public forums.',
    'Always verify through an official alternative channel if a manager requests an urgent transfer.',
    'Keep your browser and operating system updated to patch critical vulnerabilities.',
    'Configure automatic updates on your operating systems and essential software.',
    'Install an updated antivirus or EDR solution that scans downloaded files in real-time.',
    'Disable automatic execution of macros and scripts in files downloaded from the internet.',
    'Perform full malware scans on your equipment on a regular basis.',
    'Do not download pirated software or from unofficial sources, as they often contain trojans.',
    'Use static analysis tools (SAST) and secure dependencies in your software projects.',
    'Always encrypt storage drives on your laptops using BitLocker or LUKS.',
    'Configure automatic screen locking on all your devices after a few minutes of inactivity.',
    'Uninstall obsolete applications and software you no longer use on your machines.',
    'Turn off Bluetooth and Wi-Fi when not in use in public places.',
    'Avoid connecting to open public Wi-Fi networks without using a trusted Virtual Private Network (VPN).',
    'Set up separate guest networks on your home router for visitors or IoT devices.',
    'Change admin passwords and disable WAN remote access on your home router.',
    'Use encrypted protocols (HTTPS, SFTP, SSH) across all web and network communications.',
    'Regularly check the status of SSL/TLS certificates on institutional web services.',
    'Avoid using hotel or airport Wi-Fi networks for sensitive banking operations.',
    'Disable unnecessary network services or open ports on your development servers.',
    'Monitor network traffic for anomalies or outbound requests to unknown domains.',
    'Use restrictively configured firewalls at both the network and host levels.',
    'Regularly back up your important files following the 3-2-1 backup strategy.',
    'Store at least one backup on a completely disconnected physical medium (air-gapped).',
    'Test the integrity and restoration of your backups on a regular basis.',
    'Encrypt your cloud backup files to prevent unauthorized access in case of a provider breach.',
    'Document disaster recovery and ransomware attack response plans.',
    'Maintain immutable backups to protect information against malicious deletion.',
    'Do not store backups on the same physical partition as the main operating system.',
    'Verify cryptographic hashes (SHA-256) of important downloaded installers and copies.',
    'Automate backup routines to avoid depending on forgotten manual interventions.',
    'Keep updated inventories of your critical digital assets and where they are backed up.',
    'Periodically review permissions granted by mobile apps to camera and microphone.',
    'Do not grant accessibility or screen overlay permissions to mobile apps of questionable origin.',
    'Keep your smartphone operating system always updated with the latest security patches.',
    'Download mobile apps exclusively from official and verified stores (Google Play, App Store).',
    'Log out of your financial mobile apps if you lend your phone to someone else.',
    'Use a robust PIN or unlock pattern and biometrics on your smartphone.',
    'Disable sensitive message previews on your phone\'s lock screen.',
    'Avoid connecting your phone to free public USB charging stations (juice jacking).',
    'Configure tracking and remote wipe options on your mobile device in case of loss.',
    'Review sign-in authorizations for Google, Apple, or social networks on third-party apps.',
    'Use privacy-oriented browsers and extensions that block trackers.',
    'Clear browser cache and cookies periodically on shared computers.',
    'Surf in incognito mode when using public computers, but remember it does not hide activity from your ISP.',
    'Read privacy policies and requested permissions before installing browser extensions.',
    'Disable geolocation in your default web browser settings.',
    'Use search engines that do not store your personal query history.',
    'Set up real-time alerts for banking transactions and unusual activities.',
    'Periodically monitor your credit reports to detect potential identity theft.',
    'Use single-use virtual cards for shopping on lesser-known e-commerce websites.',
    'Do not save passwords or credit card data automatically in public browsers.',
    'Implement the principle of least privilege in all development and production environments.',
    'Separate staging environments from real production environments.',
    'Review and audit open-source dependencies (npm, pip) for known vulnerabilities.',
    'Never expose API keys, tokens, or database credentials in public Git repositories.',
    'Use secure environment variables to manage sensitive configurations in your applications.',
    'Conduct security-focused cross-code reviews before merging branches.',
    'Sanitize and validate all user inputs to prevent SQL injection and XSS attacks.',
    'Implement robust HTTP security headers (CSP, HSTS, X-Frame-Options) in web applications.',
    'Immediately update libraries and frameworks with reported security flaws (CVE).',
    'Perform periodic penetration tests (pentesting) on your platforms before public release.',
    'Never plug unknown USB flash drives or those found in public spaces into your devices.',
    'Physically destroy or securely wipe hard drives before disposing of old equipment.',
    'Physically lock your workstation every time you walk away from your desk.',
    'Do not allow unauthorized persons access to server areas or sensitive workspaces.',
    'Use shredders to destroy physical documents containing confidential information.',
    'Immediately report any loss of credentials, cards, or corporate devices.',
    'Do not leave printouts with sensitive data forgotten on shared printer trays.',
    'Identify and question unknown individuals wandering through restricted office areas (tailgating).',
    'Keep whiteboards clear of confidential information at the end of the workday.',
    'Actively participate in awareness and phishing simulations organized by your company.',
    'Make multifactor authentication mandatory on your personal and work email accounts.',
    'Disable Remote Desktop (RDP) remote access exposed directly to the internet without a VPN gateway.',
    'Use end-to-end encrypted cloud storage services for highly sensitive information.',
    'Review audit logs on your web servers for brute-force attempts or scanning activities.',
    'Avoid passwords based on dictionary words or simple numeric sequences.',
    'Keep physical or digital copies of emergency numbers and incident response contacts.',
    'Beware of emails threatening to close your accounts if you don\'t click an immediate link.',
    'Use automated vulnerability scanning tools on your local networks on a scheduled basis.',
    'Review network share permissions to ensure only authorized users have access.',
    'Adopt a "Zero Trust" mindset where every digital access is constantly verified and validated.'
  ];

  dailyMissions = [
  { id: 1, titleKey: 'Completar 1 Reto Flash', completed: false, reward: '+50 XP' },
  { id: 2, titleKey: 'Resolver 1 Incidente en el Simulador', completed: false, reward: '+80 XP' },
  { id: 3, titleKey: 'Revisar un módulo de aprendizaje', completed: false, reward: '+30 XP' }
];

  get completedMissionsCount(): number {
    return this.dailyMissions.filter(m => m.completed).length;
  }
    
  challengesListEs: Challenge[] = [
    // ==========================================
    // 🇪🇸 PRINCIPIANTE (30 PREGUNTAS)
    // ==========================================
    {
      level: 'Principiante',
      question: '¿Es seguro hacer clic en un enlace acortado recibido por SMS de un banco desconocido?',
      options: [
        { text: 'Sí, si parece urgente', correct: false },
        { text: 'No, puede ser Phishing', correct: true }
      ],
      explanation: 'Los enlaces acortados de fuentes no verificadas ocultan la URL de destino real.'
    },
    {
      level: 'Principiante',
      question: '¿Cuál es una buena práctica para crear una contraseña robusta?',
      options: [
        { text: 'Usar tu fecha de nacimiento', correct: false },
        { text: 'Mezclar símbolos, números y mayúsculas', correct: true }
      ],
      explanation: 'Las contraseñas complejas y largas son mucho más difíciles de descifrar por fuerza bruta.'
    },
    {
      level: 'Principiante',
      question: '¿Qué debes hacer si recibes un correo pidiendo actualizar tu contraseña urgente mediante un link?',
      options: [
        { text: 'Hacer clic inmediatamente', correct: false },
        { text: 'Ignorarlo o verificar ingresando directo al sitio oficial', correct: true }
      ],
      explanation: 'Nunca se deben usar enlaces directos de correos para gestiones sensibles de cuentas.'
    },
    {
      level: 'Principiante',
      question: '¿Qué significa la "S" al final del protocolo HTTPS en una página web?',
      options: [
        { text: 'Seguro (Secure)', correct: true },
        { text: 'Rápido (Swift)', correct: false }
      ],
      explanation: 'Indica que la conexión está cifrada mediante certificados SSL/TLS.'
    },
    {
      level: 'Principiante',
      question: '¿Es recomendable utilizar la misma contraseña en todas tus redes sociales y correos?',
      options: [
        { text: 'Sí, para recordarla fácilmente', correct: false },
        { text: 'No, porque si una cae, todas se comprometen', correct: true }
      ],
      explanation: 'El reciclaje de claves facilita el acceso masivo a atacantes en caso de una filtración.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es la autenticación de dos factores (2FA)?',
      options: [
        { text: 'Usar dos contraseñas iguales', correct: false },
        { text: 'Añadir un paso de verificación extra além de tu contraseña', correct: true }
      ],
      explanation: 'Combina algo que sabes (clave) con algo que tienes o eres (token o biometría).'
    },
    {
      level: 'Principiante',
      question: '¿Qué es el "Phishing"?',
      options: [
        { text: 'Un deporte acuático', correct: false },
        { text: 'Una técnica de estafa para robar información personal suplantando identidades', correct: true }
      ],
      explanation: 'Se disfraza de entidades legítimas para engañar al usuario.'
    },
    {
      level: 'Principiante',
      question: '¿Por qué es importante actualizar el sistema operativo de tu teléfono o PC?',
      options: [
        { text: 'Para ocupar más espacio', correct: false },
        { text: 'Para corregir fallos de seguridad y vulnerabilidades', correct: true }
      ],
      explanation: 'Los parches cierran las puertas que los atacantes usan para vulnerar los equipos.'
    },
    {
      level: 'Principiante',
      question: '¿Es seguro conectar un USB encontrado en la calle a tu computadora personal?',
      options: [
        { text: 'Sí, para ver qué contiene', correct: false },
        { text: 'No, puede contener malware o scripts maliciosos ocultos', correct: true }
      ],
      explanation: 'Es una táctica física común para infectar estaciones de trabajo.'
    },
    {
      level: 'Principiante',
      question: '¿Qué debes hacer al terminar de usar tu cuenta en una PC pública o compartida?',
      options: [
        { text: 'Cerrar sesión (Log out) y limpiar datos', correct: true },
        { text: 'Solo cerrar la pestaña del navegador', correct: false }
      ],
      explanation: 'Cerrar sesión evita que el siguiente usuario acceda a tus perfiles activos.'
    },
    {
      level: 'Principiante',
      question: '¿Cuál es el propósito principal de un antivirus?',
      options: [
        { text: 'Acelerar la velocidad del internet', correct: false },
        { text: 'Detectar, bloquear y eliminar software malicioso', correct: true }
      ],
      explanation: 'Protege el equipo examinando archivos y procesos en busca de firmas de virus.'
    },
    {
      level: 'Principiante',
      question: '¿Qué tipo de información NUNCA debes compartir en redes sociales?',
      options: [
        { text: 'Tus gustos musicales', correct: false },
        { text: 'Contraseñas, documentos de identidad o números de tarjetas', correct: true }
      ],
      explanation: 'Exponer datos privados facilita robos de identidad y fraudes financieros.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es una red Wi-Fi pública abierta?',
      options: [
        { text: 'Una red donde cualquiera puede conectarse sin clave y sin cifrado seguro', correct: true },
        { text: 'Una red privada exclusiva para empleados', correct: false }
      ],
      explanation: 'Al no tener cifrado, cualquier atacante en el rango puede espiar el tráfico.'
    },
    {
      level: 'Principiante',
      question: '¿Cómo puedes verificar si un sitio web de compras es legítimo?',
      options: [
        { text: 'Mirando si tiene un diseño bonito', correct: false },
        { text: 'Revisando su URL oficial, reputación y certificado SSL', correct: true }
      ],
      explanation: 'Los estafadores crean réplicas con dominios ligeramente alterados.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es una copia de seguridad (Backup)?',
      options: [
        { text: 'Borrar archivos innecesarios', correct: false },
        { text: 'Guardar una réplica de tus datos importantes en un lugar seguro', correct: true }
      ],
      explanation: 'Protege la información ante fallos de hardware o ataques de ransomware.'
    },
    {
      level: 'Principiante',
      question: '¿Es seguro descargar aplicaciones desde páginas de terceros no oficiales?',
      options: [
        { text: 'Sí, suelen ser gratis', correct: false },
        { text: 'No, pueden venir modificadas con troyanos o spyware', correct: true }
      ],
      explanation: 'Las tiendas oficiales (Google Play, App Store) realizan controles de seguridad previos.'
    },
    {
      level: 'Principiante',
      question: '¿Qué debes hacer si recibes un mensaje diciendo que ganaste un premio millonario sin haber participado?',
      options: [
        { text: 'Reclamarlo de inmediato con tus datos', correct: false },
        { text: 'Ignorarlo y borrarlo, es una estafa clásica', correct: true }
      ],
      explanation: 'Los ganchos de premios falsos buscan robar dinero o datos personales.'
    },
    {
      level: 'Principiante',
      question: '¿Para qué sirve configurar el bloqueo automático de pantalla en tu smartphone?',
      options: [
        { text: 'Para ahorrar batería únicamente', correct: false },
        { text: 'Para evitar accesos no autorizados si dejas el teléfono descuidado', correct: true }
      ],
      explanation: 'Protege tu dispositivo físico frente a mirones o robos express.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es el "Vishing"?',
      options: [
        { text: 'Un ataque de phishing realizado a través de llamadas telefónicas o de voz', correct: true },
        { text: 'Un virus informático que afecta videos', correct: false }
      ],
      explanation: 'Combina ingeniería social y suplantación de voz para manipular a la víctima.'
    },
    {
      level: 'Principiante',
      question: '¿Qué precaución debes tener al escanear un código QR en la vía pública?',
      options: [
        { text: 'Ninguna, todos son seguros', correct: false },
        { text: 'Verificar que la URL previa a abrir sea legítima y no un enlace trampa', correct: true }
      ],
      explanation: 'Los códigos QR pueden sobreponerse con pegatinas falsas para redirigir a webs maliciosas.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es un gestor de contraseñas?',
      options: [
        { text: 'Una libreta de papel donde anotas tus claves', correct: false },
        { text: 'Una aplicación cifrada para almacenar y generar contraseñas únicas', correct: true }
      ],
      explanation: 'Te libera de memorizar decenas de claves complejas.'
    },
    {
      level: 'Principiante',
      question: '¿Por qué debes evitar usar Wi-Fi abierto para hacer transacciones bancarias?',
      options: [
        { text: 'Porque el internet es muy lento', correct: false },
        { text: 'Porque tus credenciales y datos pueden ser interceptados', correct: true }
      ],
      explanation: 'En redes abiertas sin VPN, el tráfico puede ser leído por terceros.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es el "Smishing"?',
      options: [
        { text: 'Phishing ejecutado a través de mensajes de texto SMS', correct: true },
        { text: 'Un error de red en teléfonos móviles', correct: false }
      ],
      explanation: 'Utiliza mensajes cortos para engañar con falsas alertas bancarias o de paquetes.'
    },
    {
      level: 'Principiante',
      question: '¿Qué indica un candado cerrado en la barra de direcciones del navegador?',
      options: [
        { text: 'Que la página web es 100% confiable y honesta', correct: false },
        { text: 'Que la comunicación entre tu navegador y el servidor está cifrada', correct: true }
      ],
      explanation: 'El candado solo certifica el cifrado de la conexión, no la intencionalidad del sitio.'
    },
    {
      level: 'Principiante',
      question: '¿Qué debes hacer si pierdes tu teléfono móvil corporativo o personal?',
      options: [
        { text: 'Esperar a que alguien lo devuelva', correct: false },
        { text: 'Reportarlo y activar el borrado remoto de datos', correct: true }
      ],
      explanation: 'Minimiza el riesgo de que accedan a tu información personal o laboral.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es el ransomware?',
      options: [
        { text: 'Un programa para limpiar memoria RAM', correct: false },
        { text: 'Un malware que cifra tus archivos y pide un rescate económico', correct: true }
      ],
      explanation: 'Bloquea el acceso a la información exigiendo pago a cambio de la clave de descifrado.'
    },
    {
      level: 'Principiante',
      question: '¿Por qué no debes anotar tus contraseñas en notas adhesivas pegadas al monitor?',
      options: [
        { text: 'Porque se desprenden con el calor', correct: false },
        { text: 'Porque cualquier persona que visite tu área de trabajo podrá verlas', correct: true }
      ],
      explanation: 'Constituye una vulnerabilidad física grave de ingeniería social visual.'
    },
    {
      level: 'Principiante',
      question: '¿Qué es una clave de recuperación o respaldo (Recovery Code) en el 2FA?',
      options: [
        { text: 'Un código de repuesto para entrar si pierdes acceso a tu app de autenticación', correct: true },
        { text: 'Una contraseña para reiniciar el módem', correct: false }
      ],
      explanation: 'Salvan tu cuenta en caso de que pierdas el dispositivo móvil configurado.'
    },
    {
      level: 'Principiante',
      question: '¿Es seguro aceptar solicitudes de amistad en redes sociales de personas completamente desconocidas?',
      options: [
        { text: 'Sí, para tener más seguidores', correct: false },
        { text: 'No, podría tratarse de perfiles falsos creados para espionaje o estafa', correct: true }
      ],
      explanation: 'Muchos atacantes usan avatares falsos para ganar confianza y extraer datos.'
    },
    {
      level: 'Principiante',
      question: '¿Cuál es la primera acción ante un equipo infectado con un virus en la red local?',
      options: [
        { text: 'Apagar el monitor para que no se vea', correct: false },
        { text: 'Desconectarlo de la red (cable Ethernet y Wi-Fi) inmediatamente', correct: true }
      ],
      explanation: 'Aislar el equipo frena la propagación lateral del malware hacia otros dispositivos.'
    },

    // ==========================================
    // 🟡 INTERMEDIO (30 PREGUNTAS)
    // ==========================================
    {
      level: 'Intermedio',
      question: '¿Qué protocolo de red cifra el tráfico web garantizando privacidad y seguridad?',
      options: [
        { text: 'HTTP', correct: false },
        { text: 'HTTPS', correct: true }
      ],
      explanation: 'HTTPS utiliza cifrado SSL/TLS para proteger los datos en tránsito entre el navegador y el servidor.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de Inyección SQL (SQLi)?',
      options: [
        { text: 'Una inserción de código malicioso en consultas a bases de datos', correct: true },
        { text: 'Un fallo de hardware en discos duros', correct: false }
      ],
      explanation: 'Permite a los atacantes manipular bases de datos si no se sanitizan las entradas.'
    },
    {
      level: 'Intermedio',
      question: '¿Cuál es el objetivo principal de un ataque DDoS (Denegación de Servicio Distribuidora)?',
      options: [
        { text: 'Robar contraseñas de usuarios', correct: false },
        { text: 'Saturar un servidor o servicio para dejarlo inaccesible', correct: true }
      ],
      explanation: 'Inunda el objetivo con tráfico masivo desde múltiples fuentes (botnets).'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el principio de "Menor Privilegio" (Least Privilege)?',
      options: [
        { text: 'Dar acceso total a todos los empleados', correct: false },
        { text: 'Otorgar a los usuarios solo los permisos mínimos necesarios para su labor', correct: true }
      ],
      explanation: 'Limita el impacto potencial en caso de que una cuenta sea comprometida.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué describe mejor una vulnerabilidad Zero-Day?',
      options: [
        { text: 'Un fallo que se soluciona en cero días automáticamente', correct: false },
        { text: 'Una vulnerabilidad desconocida por el fabricante y sin parche oficial', correct: true }
      ],
      explanation: 'Representa un riesgo elevado porque no existen defensas iniciales conocidas.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué función cumple una Red Privada Virtual (VPN)?',
      options: [
        { text: 'Aumentar la velocidad de descarga', correct: false },
        { text: 'Crear un túnel cifrado para navegar seguro en redes públicas', correct: true }
      ],
      explanation: 'Oculta tu dirección IP real y protege los datos frente a escuchas en la red.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de Cross-Site Scripting (XSS)?',
      options: [
        { text: 'Inyección de scripts maliciosos en páginas web vistas por otros usuarios', correct: true },
        { text: 'Un fallo en el cifrado de correos electrónicos', correct: false }
      ],
      explanation: 'Permite ejecutar código JavaScript en el navegador de la víctima.'
    },
    {
      level: 'Intermedio',
      question: '¿En qué consiste la regla de respaldo 3-2-1?',
      options: [
        { text: '3 copias, en 2 soportes distintos, y 1 copia fuera de sitio', correct: true },
        { text: '3 contraseñas, 2 usuarios y 1 administrador', correct: false }
      ],
      explanation: 'Garantiza la resiliencia de la información ante cualquier desastre o cifrado.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un archivo o payload "Fileless Malware"?',
      options: [
        { text: 'Malware que opera exclusivamente en la memoria RAM sin dejar ficheros en disco', correct: true },
        { text: 'Un virus que elimina archivos automáticamente', correct: false }
      ],
      explanation: 'Dificulta enormemente la detección de los antivirus tradicionales basados en ficheros.'
    },
    {
      level: 'Intermedio',
      question: '¿Cuál es la diferencia principal entre cifrado simétrico y asimétrico?',
      options: [
        { text: 'El simétrico usa una sola clave para cifrar y descifrar; el asimétrico usa par de claves (pública y privada)', correct: true },
        { text: 'El simétrico no usa claves', correct: false }
      ],
      explanation: 'El asimétrico soluciona el problema del intercambio seguro de claves.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el escaneo de puertos en auditorías de seguridad?',
      options: [
        { text: 'Comprobar qué servicios de red están abiertos y accesibles en una máquina', correct: true },
        { text: 'Revisar los puertos físicos USB del equipo', correct: false }
      ],
      explanation: 'Permite identificar puntos de entrada potenciales en la infraestructura.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué son los tokens de acceso OAuth mal configurados?',
      options: [
        { text: 'Credenciales que otorgan permisos excesivos a aplicaciones terceras', correct: true },
        { text: 'Llaves físicas de seguridad dañadas', correct: false }
      ],
      explanation: 'Pueden permitir que apps externas accedan indefinidamente a perfiles de usuario.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de fuerza bruta?',
      options: [
        { text: 'Probar sistemáticamente todas las combinaciones posibles de claves hasta dar con la correcta', correct: true },
        { text: 'Romper físicamente un servidor con herramientas', correct: false }
      ],
      explanation: 'Se mitiga implementando bloqueos de cuenta tras intentos fallidos.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué rol cumple un sistema EDR (Endpoint Detection and Response)?',
      options: [
        { text: 'Monitorear y responder de forma avanzada ante amenazas en dispositivos finales', correct: true },
        { text: 'Gestionar las impresoras de la oficina', correct: false }
      ],
      explanation: 'Va más allá del antivirus tradicional analizando comportamientos anómalos.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de DNS Spoofing o Envenenamiento de caché DNS?',
      options: [
        { text: 'Alterar registros DNS para redirigir usuarios a servidores maliciosos', correct: true },
        { text: 'Bloquear el acceso al cable de red', correct: false }
      ],
      explanation: 'Engaña al sistema para que resuelva nombres legítimos hacia IPs controladas por atacantes.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el modelo de seguridad "Zero Trust" (Confianza Cero)?',
      options: [
        { text: 'Asumir que nadie dentro ni fuera de la red es confiable por defecto y verificar siempre', correct: true },
        { text: 'Desconfiar de todos los clientes y no venderles nada', correct: false }
      ],
      explanation: 'Requiere autenticación y autorización continua para cada acceso.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es la sandboxing (zona de pruebas)?',
      options: [
        { text: 'Un entorno aislado para ejecutar y probar software sospechoso sin riesgo', correct: true },
        { text: 'Un juego de niños en la red corporativa', correct: false }
      ],
      explanation: 'Impide que código malicioso afecte al sistema operativo principal.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué son las cabeceras de seguridad HTTP (Security Headers)?',
      options: [
        { text: 'Directivas enviadas por el servidor web para proteger el navegador ante ataques (CSP, HSTS)', correct: true },
        { text: 'Comentarios ocultos en el código fuente', correct: false }
      ],
      explanation: 'Mitigan vulnerabilidades como XSS y secuestro de clics (Clickjacking).'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el análisis estático de código (SAST)?',
      options: [
        { text: 'Revisar el código fuente en busca de fallos de seguridad sin necesidad de ejecutarlo', correct: true },
        { text: 'Probar la aplicación haciendo clic en los botones', correct: false }
      ],
      explanation: 'Ayuda a detectar malas prácticas de programación en etapas tempranas de desarrollo.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es la exfiltración de datos?',
      options: [
        { text: 'La extracción o transferencia no autorizada de datos desde una red u host', correct: true },
        { text: 'El borrado seguro de discos duros', correct: false }
      ],
      explanation: 'Es el paso final crítico en muchas brechas de seguridad corporativas.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un certificado SSL/TLS salvaje (Wildcard)?',
      options: [
        { text: 'Un certificado que protege un dominio principal y todos sus subdominios', correct: true },
        { text: 'Un certificado caducado', correct: false }
      ],
      explanation: 'Facilita la gestión criptográfica bajo comodines (ej. *.dominio.com).'
    },
    {
      level: 'Intermedio',
      question: '¿Cuál es la función de un honeypot (tarro de miel) en ciberseguridad?',
      options: [
        { text: 'Atraer y engañar a atacantes para estudiar sus tácticas sin comprometer sistemas reales', correct: true },
        { text: 'Almacenar contraseñas maestras', correct: false }
      ],
      explanation: 'Actúa como cebo señuelo dentro de la infraestructura de red.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el término "Credential Stuffing"?',
      options: [
        { text: 'Automatizar el uso de credenciales robadas en masa para probarlas en múltiples sitios', correct: true },
        { text: 'Crear contraseñas muy largas', correct: false }
      ],
      explanation: 'Aprovecha el mal hábito de reutilizar contraseñas en diferentes plataformas.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es una clave API (API Key) expuesta?',
      options: [
        { text: 'Un identificador secreto filtrado públicamente que permite acceso no autorizado a servicios', correct: true },
        { text: 'Una llave para abrir la puerta del datacenter', correct: false }
      ],
      explanation: 'Dejar claves de API en repositorios públicos de GitHub es un error crítico común.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué significa que un sistema sea tolerante a fallos y redundante?',
      options: [
        { text: 'Que cuenta con respaldos y componentes duplicados para seguir operando ante fallos', correct: true },
        { text: 'Que repite los mismos errores dos veces', correct: false }
      ],
      explanation: 'Evita puntos únicos de fallo (SPOF) en la arquitectura.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de denegación de servicio (DoS) a nivel de aplicación?',
      options: [
        { text: 'Agotar recursos específicos de una app web (ej. consultas pesadas de BD) con pocas peticiones', correct: true },
        { text: 'Apagar el interruptor eléctrico general', correct: false }
      ],
      explanation: 'Apunta a la lógica del software en lugar de saturar el ancho de banda bruto.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el cifrado de extremo a extremo (E2EE)?',
      options: [
        { text: 'Cifrado donde solo el emisor y el receptor pueden leer los mensajes, sin intermediarios', correct: true },
        { text: 'Cifrar solo cuando el archivo llega al servidor', correct: false }
      ],
      explanation: 'Garantiza que ni siquiera el proveedor del servicio de mensajería descifre el contenido.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es el análisis dinámico de seguridad (DAST)?',
      options: [
        { text: 'Evaluar una aplicación en ejecución simulando ataques externos', correct: true },
        { text: 'Leer el código fuente línea por línea', correct: false }
      ],
      explanation: 'Prueba la postura de seguridad de la app desde una perspectiva de caja negra.'
    },
    {
      level: 'Intermedio',
      question: '¿Qué es un ataque de Directory Traversal (Path Traversal)?',
      options: [
        { text: 'Manipular rutas de archivos para acceder a directorios prohibidos del servidor', correct: true },
        { text: 'Perderse en la estructura de carpetas de Windows', correct: false }
      ],
      explanation: 'Permite leer ficheros sensibles del sistema operativo usando secuencias como "../".'
    },
    {
      level: 'Intermedio',
      question: '¿Cuál es el propósito de realizar auditorías de código abierto (Open Source Dependencies)?',
      options: [
        { text: 'Detectar vulnerabilidades conocidas (CVE) en librerías de terceros heredadas', correct: true },
        { text: 'Traducir el código a otros idiomas', correct: false }
      ],
      explanation: 'La mayoría de aplicaciones modernas dependen en gran medida de paquetes externos.'
    },

    // ==========================================
    // 🔴 AVANZADO (30 PREGUNTAS)
    // ==========================================
    {
      level: 'Avanzado',
      question: '¿Qué tipo de ataque vectorial intercepta las comunicaciones entre dos nodos simulando ser ambos?',
      options: [
        { text: 'Ataque de Man-in-the-Middle (MitM)', correct: true },
        { text: 'Ataque de denegación de servicio (DDoS)', correct: false }
      ],
      explanation: 'MitM permite al atacante espiar o alterar el flujo de datos sin que las partes lo noten.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de escalada de privilegios (Privilege Escalation)?',
      options: [
        { text: 'Obtener acceso de nivel superior (ej. root/admin) partiendo de una cuenta estándar', correct: true },
        { text: 'Subir de categoría en un videojuego online', correct: false }
      ],
      explanation: 'Los atacantes lo usan tras una brecha inicial para controlar todo el sistema.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué técnica utiliza el malware avanzado para evadir sandboxing detectando si corre en máquina virtual?',
      options: [
        { text: 'Técnicas anti-análisis y anti-virtualización (Anti-VM / Anti-Debugging)', correct: true },
        { text: 'Cifrado con llave de 1 bit', correct: false }
      ],
      explanation: 'El software malicioso se pone en modo latente si detecta entornos de investigación.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de desbordamiento de búfer (Buffer Overflow)?',
      options: [
        { text: 'Escribir más datos en la memoria asignada de los que el búfer puede soportar, corrompiendo memoria', correct: true },
        { text: 'Llenar el disco duro de películas', correct: false }
      ],
      explanation: 'Puede permitir la ejecución arbitraria de código malicioso controlando el puntero de instrucción.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué define a un grupo APT (Advanced Persistent Threat)?',
      options: [
        { text: 'Un grupo patrocinado por estados o actores complejos con ataques prolongados y sigilosos', correct: true },
        { text: 'Un equipo de soporte técnico lento', correct: false }
      ],
      explanation: 'Buscan persistencia a largo plazo en infraestructuras críticas sin ser detectados.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el secuestro de sesión (Session Hijacking)?',
      options: [
        { text: 'Robar o suplantar el token de sesión activo de un usuario legítimo', correct: true },
        { text: 'Apagar una computadora a distancia', correct: false }
      ],
      explanation: 'Permite al atacante operar con la identidad de la víctima sin conocer su contraseña.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de Inyección de Prompt (Prompt Injection) en modelos de IA / LLM?',
      options: [
        { text: 'Manipular las entradas de texto para saltarse las restricciones de seguridad del modelo', correct: true },
        { text: 'Inyectar corriente eléctrica al procesador de IA', correct: false }
      ],
      explanation: 'Engaña al asistente inteligente para que revele información confidencial o ejecute tareas prohibidas.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es la técnica de persistencia "DLL Hijacking" en Windows?',
      options: [
        { text: 'Colocar una DLL maliciosa en rutas prioritarias para que una app legítima la cargue', correct: true },
        { text: 'Desinstalar librerías del sistema', correct: false }
      ],
      explanation: 'Permite ejecutar código arbitrario con los privilegios de la aplicación afectada.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el análisis forense de memoria RAM (Memory Forensics)?',
      options: [
        { text: 'Extraer y analizar volcado de memoria volátil para hallar artefactos de malware invisible', correct: true },
        { text: 'Revisar cuántos gigabytes tiene una tarjeta gráfica', correct: false }
      ],
      explanation: 'Fundamental para descubrir procesos inyectados, claves en texto plano y conexiones ocultas.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de canal lateral (Side-Channel Attack)?',
      options: [
        { text: 'Extraer claves criptográficas midiendo consumo de energía, radiación electromagnética o tiempos', correct: true },
        { text: 'Entrar por la puerta trasera de un edificio', correct: false }
      ],
      explanation: 'Ataca la implementación física del hardware en lugar del algoritmo matemático.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el cifrado homomórfico?',
      options: [
        { text: 'Permitir realizar cálculos matemáticos sobre datos cifrados sin necesidad de descifrarlos antes', correct: true },
        { text: 'Un cifrado que cambia de forma cada segundo', correct: false }
      ],
      explanation: 'Permite procesar información en la nube manteniendo total privacidad de los datos.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de Denegación de Servicio por Agotamiento de Recursos de Capa 7?',
      options: [
        { text: 'Ataques dirigidos a agotar hilos o conexiones HTTP del servidor web', correct: true },
        { text: 'Cortar los cables submarinos de fibra óptica', correct: false }
      ],
      explanation: 'Simula solicitudes legítimas complejas difíciles de filtrar por firewalls tradicionales.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el modelo de cadenas de suministro de software y sus riesgos (Software Supply Chain)?',
      options: [
        { text: 'Riesgos derivados de dependencias y librerías de terceros comprometidas antes de compilar', correct: true },
        { text: 'La logística de entrega física de laptops', correct: false }
      ],
      explanation: 'Un ataque a un paquete open-source popular infecta a miles de aplicaciones dependientes.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es una vulnerabilidad de tipo SSRF (Server-Side Request Forgery)?',
      options: [
        { text: 'Inducir al servidor backend a realizar peticiones HTTP hacia destinos internos o prohibidos', correct: true },
        { text: 'Un fallo en el router Wi-Fi de casa', correct: false }
      ],
      explanation: 'Permite saltarse controles perimetrales para escanear redes internas o servicios de nube.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el "Kerberoasting" en entornos de Active Directory?',
      options: [
        { text: 'Técnica para extraer y crackear tickets de servicio Kerberos offline', correct: true },
        { text: 'Un protocolo de autenticación web', correct: false }
      ],
      explanation: 'Permite a un atacante obtener contraseñas de cuentas de servicio con privilegios.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el hashing con sal (Salt)?',
      options: [
        { text: 'Añadir datos aleatorios a una contraseña antes de aplicarle hash para frustrar ataques de tablas arcoíris', correct: true },
        { text: 'Encriptar bases de datos con sal marina', correct: false }
      ],
      explanation: 'Garantiza que dos usuarios con la misma contraseña tengan hashes completamente distintos.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de Polimorfismo en Malware?',
      options: [
        { text: 'Modificar su firma y estructura binaria en cada infección para evadir antivirus', correct: true },
        { text: 'Un virus que cambia de color en pantalla', correct: false }
      ],
      explanation: 'Utiliza motores de cifrado mutantes para alterar su apariencia hash constantemente.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es la técnica de "Pass-the-Hash"?',
      options: [
        { text: 'Autenticarse en un sistema usando el hash de la contraseña en lugar de la clave en texto plano', correct: true },
        { text: 'Enviar correos electrónicos masivos', correct: false }
      ],
      explanation: 'Aprovecha protocolos que permiten reutilizar hashes capturados en memoria.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de inyección LDAP (LDAP Injection)?',
      options: [
        { text: 'Manipular consultas a directorios corporativos para burlar autenticaciones', correct: true },
        { text: 'Inyectar código en bases de datos relacionales SQL', correct: false }
      ],
      explanation: 'Afecta sistemas de directorio empresarial si no se validan adecuadamente las entradas.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el "Fuzzing" (Fuzz Testing)?',
      options: [
        { text: 'Técnica automatizada que inyecta datos inválidos o aleatorios para encontrar fallos y crashes', correct: true },
        { text: 'Una técnica de diseño gráfico borroso', correct: false }
      ],
      explanation: 'Ayuda a descubrir desbordamientos de búfer y errores lógicos no previstos.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el secuestro de BGP (BGP Hijacking)?',
      options: [
        { text: 'Interceptar tráfico de internet falsificando rutas de anuncios en el protocolo de encaminamiento BGP', correct: true },
        { text: 'Robar dominios web (.com)', correct: false }
      ],
      explanation: 'Permite desviar el tráfico global de redes enteras hacia servidores maliciosos.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el modelo de amenazas STRIDE?',
      options: [
        { text: 'Un marco de clasificación de amenazas (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, EoP)', correct: true },
        { text: 'Una metodología de desarrollo ágil', correct: false }
      ],
      explanation: 'Ayuda a los arquitectos de software a identificar fallos de seguridad en el diseño.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de Inyección XXE (XML External Entity)?',
      options: [
        { text: 'Explotar parsers XML vulnerables para leer archivos locales del servidor o hacer SSRF', correct: true },
        { text: 'Modificar estilos CSS en páginas web', correct: false }
      ],
      explanation: 'Afecta aplicaciones que procesan entradas XML mal validadas.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el mecanismo de rotación de claves criptográficas (Key Rotation)?',
      options: [
        { text: 'Reemplazar periódicamente claves de cifrado antiguas por nuevas para limitar daños ante filtraciones', correct: true },
        { text: 'Girar las antenas del router', correct: false }
      ],
      explanation: 'Reduce la ventana de exposición si una clave secreta llega a verse comprometida.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es un ataque de Deserialización Insegura (Insecure Deserialization)?',
      options: [
        { text: 'Ejecutar código arbitrario manipulando objetos serializados antes de ser procesados por la app', correct: true },
        { text: 'Borrar archivos comprimidos ZIP', correct: false }
      ],
      explanation: 'Ocurre cuando la aplicación confía ciegamente en datos complejos deserializados.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué caracteriza a una botnet basada en DGA (Domain Generation Algorithms)?',
      options: [
        { text: 'Generar miles de dominios aleatorios diarios para comunicarse con centros de comando sin ser bloqueados', correct: true },
        { text: 'Crear redes Wi-Fi automáticas', correct: false }
      ],
      explanation: 'Dificulta la tarea de los defensores al derribar servidores de control tradicionales.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el análisis de código binario mediante ingeniería inversa?',
      options: [
        { text: 'Desensamblar código compilado para entender su funcionamiento lógico y detectar malware', correct: true },
        { text: 'Convertir código a lenguaje natural español', correct: false }
      ],
      explanation: 'Permite diseccionar muestras de software malicioso cuando no se dispone del código fuente.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es la persistencia mediante servicios y tareas programadas en sistemas operativos?',
      options: [
        { text: 'Registrar tareas ocultas para que el malware se ejecute automáticamente tras cada reinicio', correct: true },
        { text: 'Programar alarmas en el reloj del sistema', correct: false }
      ],
      explanation: 'Táctica clásica de post-explotación para asegurar el acceso continuo al host.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es el sandboxing a nivel de contenedor (Docker/K8s) y sus escapes (Container Escape)?',
      options: [
        { text: 'Vulnerabilidades que permiten a un proceso dentro de un contenedor saltar al host físico subyacente', correct: true },
        { text: 'Escapar de una sala de servidores cerrada', correct: false }
      ],
      explanation: 'Representa un riesgo crítico al romper el aislamiento del aislamiento de contenedores.'
    },
    {
      level: 'Avanzado',
      question: '¿Qué es la mitigación de ataques por desbordamiento mediante ASLR (Address Space Layout Randomization)?',
      options: [
        { text: 'Aleatorizar las posiciones de memoria de los procesos para dificultar exploits de ejecución', correct: true },
        { text: 'Duplicar la memoria RAM del equipo', correct: false }
      ],
      explanation: 'Hace impredecible la ubicación exacta de funciones y variables en memoria para los atacantes.'
    }
  ];

  challengesListEn: Challenge[] = [
    // ==========================================
    // 🇺🇸 BEGINNER (30 QUESTIONS)
    // ==========================================
    {
      level: 'Principiante',
      question: 'Is it safe to click on a shortened link received via SMS from an unknown bank?',
      options: [
        { text: 'Yes, if it looks urgent', correct: false },
        { text: 'No, it could be Phishing', correct: true }
      ],
      explanation: 'Shortened links from unverified sources hide the actual destination URL.'
    },
    {
      level: 'Principiante',
      question: 'What is a good practice to create a strong password?',
      options: [
        { text: 'Use your birth date', correct: false },
        { text: 'Mix symbols, numbers, and uppercase letters', correct: true }
      ],
      explanation: 'Complex and long passwords are much harder to crack by brute force.'
    },
    {
      level: 'Principiante',
      question: 'What should you do if you receive an email asking to urgently update your password via a link?',
      options: [
        { text: 'Click the link immediately', correct: false },
        { text: 'Ignore it or log in directly through the official website', correct: true }
      ],
      explanation: 'You should never use direct email links for sensitive account management.'
    },
    {
      level: 'Principiante',
      question: 'What does the "S" stand for at the end of HTTPS in a web address?',
      options: [
        { text: 'Secure', correct: true },
        { text: 'Swift', correct: false }
      ],
      explanation: 'It indicates that the connection is encrypted using SSL/TLS certificates.'
    },
    {
      level: 'Principiante',
      question: 'Is it recommended to use the exact same password across all your social media and emails?',
      options: [
        { text: 'Yes, for easy recollection', correct: false },
        { text: 'No, because if one account falls, all are compromised', correct: true }
      ],
      explanation: 'Password recycling makes mass account takeover easy for attackers.'
    },
    {
      level: 'Principiante',
      question: 'What is Two-Factor Authentication (2FA)?',
      options: [
        { text: 'Using two identical passwords', correct: false },
        { text: 'Adding an extra verification step besides your password', correct: true }
      ],
      explanation: 'It combines something you know (password) with something you have or are (token or biometrics).'
    },
    {
      level: 'Principiante',
      question: 'What is "Phishing"?',
      options: [
        { text: 'A water sport', correct: false },
        { text: 'A scam technique to steal personal data by impersonating trusted entities', correct: true }
      ],
      explanation: 'It masquerades as legitimate organizations to deceive users.'
    },
    {
      level: 'Principiante',
      question: 'Why is it important to update your phone or PC operating system?',
      options: [
        { text: 'To take up more storage space', correct: false },
        { text: 'To patch security flaws and vulnerabilities', correct: true }
      ],
      explanation: 'Patches close the doors that attackers use to breach systems.'
    },
    {
      level: 'Principiante',
      question: 'Is it safe to plug a USB drive found in the street into your personal computer?',
      options: [
        { text: 'Yes, to see what is on it', correct: false },
        { text: 'No, it may contain malware or hidden malicious scripts', correct: true }
      ],
      explanation: 'It is a common physical tactic to infect workstations.'
    },
    {
      level: 'Principiante',
      question: 'What should you do when finished using your account on a public or shared PC?',
      options: [
        { text: 'Log out and clear browser data', correct: true },
        { text: 'Just close the browser tab', correct: false }
      ],
      explanation: 'Logging out prevents the next user from accessing your active profiles.'
    },
    {
      level: 'Principiante',
      question: 'What is the main purpose of an antivirus program?',
      options: [
        { text: 'To speed up internet browsing', correct: false },
        { text: 'To detect, block, and remove malicious software', correct: true }
      ],
      explanation: 'It protects equipment by scanning files and processes for virus signatures.'
    },
    {
      level: 'Principiante',
      question: 'What type of information should you NEVER share on social media?',
      options: [
        { text: 'Your musical tastes', correct: false },
        { text: 'Passwords, ID documents, or credit card numbers', correct: true }
      ],
      explanation: 'Exposing private data facilitates identity theft and financial fraud.'
    },
    {
      level: 'Principiante',
      question: 'What is an open public Wi-Fi network?',
      options: [
        { text: 'A network where anyone can connect without a password and without secure encryption', correct: true },
        { text: 'A private network exclusively for employees', correct: false }
      ],
      explanation: 'Lacking encryption, any attacker within range can snoop on traffic.'
    },
    {
      level: 'Principiante',
      question: 'How can you verify if an e-commerce shopping site is legitimate?',
      options: [
        { text: 'By looking at whether it has a pretty design', correct: false },
        { text: 'By checking its official URL, reputation, and SSL certificate', correct: true }
      ],
      explanation: 'Scammers build lookalike replicas with slightly altered domains.'
    },
    {
      level: 'Principiante',
      question: 'What is a data Backup?',
      options: [
        { text: 'Deleting unnecessary files', correct: false },
        { text: 'Saving a replica of your important data in a safe location', correct: true }
      ],
      explanation: 'It protects information against hardware failure or ransomware attacks.'
    },
    {
      level: 'Principiante',
      question: 'Is it safe to download apps from unofficial third-party websites?',
      options: [
        { text: 'Yes, they are usually free', correct: false },
        { text: 'No, they might be bundled with trojans or spyware', correct: true }
      ],
      explanation: 'Official stores (Google Play, App Store) perform prior security checks.'
    },
    {
      level: 'Principiante',
      question: 'What should you do if you receive a message saying you won a million-dollar prize without entering?',
      options: [
        { text: 'Claim it immediately with your details', correct: false },
        { text: 'Ignore and delete it, it is a classic scam', correct: true }
      ],
      explanation: 'Fake prize hooks seek to steal money or personal data.'
    },
    {
      level: 'Principiante',
      question: 'What is the purpose of setting up automatic screen lock on your smartphone?',
      options: [
        { text: 'To save battery only', correct: false },
        { text: 'To prevent unauthorized access if you leave the phone unattended', correct: true }
      ],
      explanation: 'It protects your physical device against snooping or express theft.'
    },
    {
      level: 'Principiante',
      question: 'What is "Vishing"?',
      options: [
        { text: 'A phishing attack carried out through phone calls or voice messages', correct: true },
        { text: 'A computer virus affecting video files', correct: false }
      ],
      explanation: 'It combines social engineering and voice spoofing to manipulate victims.'
    },
    {
      level: 'Principiante',
      question: 'What precaution should you take when scanning a QR code in public?',
      options: [
        { text: 'None, all are safe', correct: false },
        { text: 'Verify that the destination URL before opening is legitimate', correct: true }
      ],
      explanation: 'QR codes can be overlaid with fake stickers redirecting to malicious sites.'
    },
    {
      level: 'Principiante',
      question: 'What is a password manager?',
      options: [
        { text: 'A paper notebook where you write your keys', correct: false },
        { text: 'An encrypted application to store and generate unique passwords', correct: true }
      ],
      explanation: 'It frees you from memorizing dozens of complex passwords.'
    },
    {
      level: 'Principiante',
      question: 'Why should you avoid using open Wi-Fi for banking transactions?',
      options: [
        { text: 'Because the internet is too slow', correct: false },
        { text: 'Because your credentials and data can be intercepted', correct: true }
      ],
      explanation: 'On open networks without a VPN, traffic can be read by third parties.'
    },
    {
      level: 'Principiante',
      question: 'What is "Smishing"?',
      options: [
        { text: 'Phishing executed via SMS text messages', correct: true },
        { text: 'A mobile network glitch', correct: false }
      ],
      explanation: 'It uses short messages to deceive users with fake bank or package alerts.'
    },
    {
      level: 'Principiante',
      question: 'What does a locked padlock icon in the browser address bar indicate?',
      options: [
        { text: 'That the website is 100% trustworthy and honest', correct: false },
        { text: 'That communication between your browser and the server is encrypted', correct: true }
      ],
      explanation: 'The padlock only certifies connection encryption, not the site intent.'
    },
    {
      level: 'Principiante',
      question: 'What should you do if you lose your corporate or personal mobile phone?',
      options: [
        { text: 'Wait for someone to return it', correct: false },
        { text: 'Report it and trigger remote data wipe', correct: true }
      ],
      explanation: 'It minimizes the risk of unauthorized access to your personal or work data.'
    },
    {
      level: 'Principiante',
      question: 'What is ransomware?',
      options: [
        { text: 'A tool to clean RAM memory', correct: false },
        { text: 'Malware that encrypts your files and demands a financial ransom', correct: true }
      ],
      explanation: 'It locks information access demanding payment in exchange for the decryption key.'
    },
    {
      level: 'Principiante',
      question: 'Why shouldn\'t you write your passwords on sticky notes attached to your monitor?',
      options: [
        { text: 'Because heat peels them off', correct: false },
        { text: 'Because anyone visiting your workspace can see them', correct: true }
      ],
      explanation: 'It constitutes a severe physical vulnerability of visual social engineering.'
    },
    {
      level: 'Principiante',
      question: 'What is a Recovery Code in 2FA?',
      options: [
        { text: 'A backup code to log in if you lose access to your authenticator app', correct: true },
        { text: 'A password to restart the modem', correct: false }
      ],
      explanation: 'They save your account in case you lose your configured mobile device.'
    },
    {
      level: 'Principiante',
      question: 'Is it safe to accept friend requests on social media from total strangers?',
      options: [
        { text: 'Yes, to get more followers', correct: false },
        { text: 'No, they could be fake profiles created for espionage or scams', correct: true }
      ],
      explanation: 'Many attackers use fake avatars to build trust and extract data.'
    },
    {
      level: 'Principiante',
      question: 'What is the first action when a computer is infected with a virus on the local network?',
      options: [
        { text: 'Turn off the monitor so it cannot be seen', correct: false },
        { text: 'Disconnect it from the network (Ethernet cable and Wi-Fi) immediately', correct: true }
      ],
      explanation: 'Isolating the machine stops the lateral spread of malware to other devices.'
    },

    // ==========================================
    // 🟡 INTERMEDIATE (30 QUESTIONS)
    // ==========================================
    {
      level: 'Intermedio',
      question: 'What network protocol encrypts web traffic guaranteeing privacy and security?',
      options: [
        { text: 'HTTP', correct: false },
        { text: 'HTTPS', correct: true }
      ],
      explanation: 'HTTPS uses SSL/TLS encryption to protect data in transit between browser and server.'
    },
    {
      level: 'Intermedio',
      question: 'What is a SQL Injection (SQLi) attack?',
      options: [
        { text: 'Insertion of malicious code into database queries', correct: true },
        { text: 'A hardware failure in hard drives', correct: false }
      ],
      explanation: 'It allows attackers to manipulate databases if inputs are not properly sanitized.'
    },
    {
      level: 'Intermedio',
      question: 'What is the primary objective of a DDoS (Distributed Denial of Service) attack?',
      options: [
        { text: 'To steal user passwords', correct: false },
        { text: 'To overwhelm a server or service making it inaccessible', correct: true }
      ],
      explanation: 'It floods the target with massive traffic from multiple sources (botnets).'
    },
    {
      level: 'Intermedio',
      question: 'What is the "Least Privilege" principle?',
      options: [
        { text: 'Giving full access to all employees', correct: false },
        { text: 'Granting users only the minimum permissions necessary for their tasks', correct: true }
      ],
      explanation: 'It limits potential impact if an account becomes compromised.'
    },
    {
      level: 'Intermedio',
      question: 'Which best describes a Zero-Day vulnerability?',
      options: [
        { text: 'A flaw fixed automatically in zero days', correct: false },
        { text: 'A vulnerability unknown to the vendor with no official patch available', correct: true }
      ],
      explanation: 'It represents high risk because no known initial defenses exist.'
    },
    {
      level: 'Intermedio',
      question: 'What is the main function of a Virtual Private Network (VPN)?',
      options: [
        { text: 'To increase download speed', correct: false },
        { text: 'To create an encrypted tunnel for safe browsing on public networks', correct: true }
      ],
      explanation: 'It masks your real IP address and protects data against network sniffing.'
    },
    {
      level: 'Intermedio',
      question: 'What is a Cross-Site Scripting (XSS) attack?',
      options: [
        { text: 'Injection of malicious scripts into web pages viewed by other users', correct: true },
        { text: 'A flaw in email encryption', correct: false }
      ],
      explanation: 'It allows executing JavaScript code in the victim\'s browser.'
    },
    {
      level: 'Intermedio',
      question: 'What does the 3-2-1 backup rule consist of?',
      options: [
        { text: '3 copies, on 2 different media, and 1 offsite copy', correct: true },
        { text: '3 passwords, 2 users, and 1 admin', correct: false }
      ],
      explanation: 'It ensures data resilience against any disaster or encryption.'
    },
    {
      level: 'Intermedio',
      question: 'What is "Fileless Malware"?',
      options: [
        { text: 'Malware operating exclusively in RAM memory without leaving disk files', correct: true },
        { text: 'A virus that automatically deletes files', correct: false }
      ],
      explanation: 'It heavily hinders detection by traditional file-based antivirus solutions.'
    },
    {
      level: 'Intermedio',
      question: 'What is the main difference between symmetric and asymmetric encryption?',
      options: [
        { text: 'Symmetric uses a single key to encrypt/decrypt; asymmetric uses a key pair (public and private)', correct: true },
        { text: 'Symmetric uses no keys', correct: false }
      ],
      explanation: 'Asymmetric encryption solves the secure key exchange problem.'
    },
    {
      level: 'Intermedio',
      question: 'What is port scanning in security audits?',
      options: [
        { text: 'Checking which network services are open and accessible on a machine', correct: true },
        { text: 'Checking physical USB ports on hardware', correct: false }
      ],
      explanation: 'It helps identify potential entry points across infrastructure.'
    },
    {
      level: 'Intermedio',
      question: 'What are misconfigured OAuth access tokens?',
      options: [
        { text: 'Credentials granting excessive permissions to third-party applications', correct: true },
        { text: 'Damaged physical security keys', correct: false }
      ],
      explanation: 'They can allow external apps indefinite access to user profiles.'
    },
    {
      level: 'Intermedio',
      question: 'What is a brute-force attack?',
      options: [
        { text: 'Systematically trying all possible key combinations until finding the right one', correct: true },
        { text: 'Physically breaking a server with tools', correct: false }
      ],
      explanation: 'Mitigated by implementing account lockouts after failed attempts.'
    },
    {
      level: 'Intermedio',
      question: 'What role does an EDR (Endpoint Detection and Response) system play?',
      options: [
        { text: 'Advanced monitoring and threat response on endpoint devices', correct: true },
        { text: 'Managing office printers', correct: false }
      ],
      explanation: 'It goes beyond traditional antivirus by analyzing anomalous behaviors.'
    },
    {
      level: 'Intermedio',
      question: 'What is DNS Spoofing or DNS Cache Poisoning?',
      options: [
        { text: 'Altering DNS records to redirect users to malicious servers', correct: true },
        { text: 'Blocking access to the network cable', correct: false }
      ],
      explanation: 'It tricks the system into resolving legitimate names to attacker-controlled IPs.'
    },
    {
      level: 'Intermedio',
      question: 'What is the "Zero Trust" security model?',
      options: [
        { text: 'Assuming no one inside or outside the network is trusted by default and always verifying', correct: true },
        { text: 'Distrusting all clients and selling nothing', correct: false }
      ],
      explanation: 'It requires continuous authentication and authorization for every access.'
    },
    {
      level: 'Intermedio',
      question: 'What is sandboxing?',
      options: [
        { text: 'An isolated environment to execute and test suspicious software safely', correct: true },
        { text: 'A corporate network children game', correct: false }
      ],
      explanation: 'It prevents malicious code from affecting the primary operating system.'
    },
    {
      level: 'Intermedio',
      question: 'What are HTTP Security Headers?',
      options: [
        { text: 'Directives sent by web servers to protect browsers against attacks (CSP, HSTS)', correct: true },
        { text: 'Hidden comments in source code', correct: false }
      ],
      explanation: 'They mitigate vulnerabilities like XSS and Clickjacking.'
    },
    {
      level: 'Intermedio',
      question: 'What is Static Application Security Testing (SAST)?',
      options: [
        { text: 'Reviewing source code for security flaws without executing it', correct: true },
        { text: 'Testing an app by clicking buttons', correct: false }
      ],
      explanation: 'It helps catch bad coding practices early in the development lifecycle.'
    },
    {
      level: 'Intermedio',
      question: 'What is data exfiltration?',
      options: [
        { text: 'Unauthorized extraction or transfer of data from a network or host', correct: true },
        { text: 'Secure hard drive wiping', correct: false }
      ],
      explanation: 'It is the critical final step in many corporate security breaches.'
    },
    {
      level: 'Intermedio',
      question: 'What is a Wildcard SSL/TLS certificate?',
      options: [
        { text: 'A certificate protecting a root domain and all its subdomains', correct: true },
        { text: 'An expired certificate', correct: false }
      ],
      explanation: 'It simplifies cryptographic management under wildcards (e.g., *.domain.com).'
    },
    {
      level: 'Intermedio',
      question: 'What is the purpose of a honeypot in cybersecurity?',
      options: [
        { text: 'To attract and trap attackers to study their tactics without risking real systems', correct: true },
        { text: 'To store master passwords', correct: false }
      ],
      explanation: 'It acts as decoy bait inside network infrastructure.'
    },
    {
      level: 'Intermedio',
      question: 'What is "Credential Stuffing"?',
      options: [
        { text: 'Automating mass testing of stolen credentials across multiple websites', correct: true },
        { text: 'Creating very long passwords', correct: false }
      ],
      explanation: 'It exploits the bad habit of password reuse across different platforms.'
    },
    {
      level: 'Intermedio',
      question: 'What is an exposed API Key?',
      options: [
        { text: 'A publicly leaked secret identifier granting unauthorized service access', correct: true },
        { text: 'A physical key to open the datacenter door', correct: false }
      ],
      explanation: 'Leaving API keys in public GitHub repositories is a common critical mistake.'
    },
    {
      level: 'Intermedio',
      question: 'What does it mean for a system to be fault-tolerant and redundant?',
      options: [
        { text: 'Having backups and duplicated components to keep operating during failures', correct: true },
        { text: 'Repeating the same errors twice', correct: false }
      ],
      explanation: 'It prevents Single Points of Failure (SPOF) in architecture.'
    },
    {
      level: 'Intermedio',
      question: 'What is a Layer 7 Application-level Denial of Service attack?',
      options: [
        { text: 'Exhausting specific web server resources (e.g. heavy DB queries) with minimal requests', correct: true },
        { text: 'Turning off the main power switch', correct: false }
      ],
      explanation: 'It targets software logic rather than brute raw bandwidth.'
    },
    {
      level: 'Intermedio',
      question: 'What is End-to-End Encryption (E2EE)?',
      options: [
        { text: 'Encryption where only sender and recipient can read messages, without intermediaries', correct: true },
        { text: 'Encrypting only when the file reaches the server', correct: false }
      ],
      explanation: 'It ensures not even the messaging service provider can decrypt content.'
    },
    {
      level: 'Intermedio',
      question: 'What is Dynamic Application Security Testing (DAST)?',
      options: [
        { text: 'Evaluating a running application by simulating external attacks', correct: true },
        { text: 'Reading source code line by line', correct: false }
      ],
      explanation: 'It tests application security posture from a black-box perspective.'
    },
    {
      level: 'Intermedio',
      question: 'What is a Directory Traversal (Path Traversal) attack?',
      options: [
        { text: 'Manipulating file paths to access unauthorized directories on the server', correct: true },
        { text: 'Getting lost in Windows folder structures', correct: false }
      ],
      explanation: 'It allows reading sensitive OS files using sequences like "../".'
    },
    {
      level: 'Intermedio',
      question: 'What is the purpose of auditing Open Source Dependencies?',
      options: [
        { text: 'To detect known vulnerabilities (CVE) in inherited third-party libraries', correct: true },
        { text: 'To translate code into other languages', correct: false }
      ],
      explanation: 'Most modern apps heavily rely on external packages.'
    },

    // ==========================================
    // 🔴 ADVANCED (30 QUESTIONS)
    // ==========================================
    {
      level: 'Avanzado',
      question: 'What type of vector attack intercepts communications between two nodes pretending to be both?',
      options: [
        { text: 'Man-in-the-Middle (MitM) attack', correct: true },
        { text: 'Denial of Service (DDoS) attack', correct: false }
      ],
      explanation: 'MitM allows the attacker to spy or alter the data flow without parties noticing.'
    },
    {
      level: 'Avanzado',
      question: 'What is a Privilege Escalation attack?',
      options: [
        { text: 'Gaining higher-level access (e.g., root/admin) starting from a standard account', correct: true },
        { text: 'Leveling up in an online video game', correct: false }
      ],
      explanation: 'Attackers use this post-initial breach to control entire systems.'
    },
    {
      level: 'Avanzado',
      question: 'What technique does advanced malware use to evade sandboxing by detecting virtual machines?',
      options: [
        { text: 'Anti-analysis and anti-virtualization techniques (Anti-VM / Anti-Debugging)', correct: true },
        { text: '1-bit key encryption', correct: false }
      ],
      explanation: 'Malware goes dormant if it detects research environments.'
    },
    {
      level: 'Avanzado',
      question: 'What is a Buffer Overflow attack?',
      options: [
        { text: 'Writing more data into allocated memory than the buffer can hold, corrupting memory', correct: true },
        { text: 'Filling a hard drive with movies', correct: false }
      ],
      explanation: 'It can allow arbitrary code execution by overriding instruction pointers.'
    },
    {
      level: 'Avanzado',
      question: 'What defines an APT (Advanced Persistent Threat) group?',
      options: [
        { text: 'State-sponsored or complex actors conducting prolonged and stealthy attacks', correct: true },
        { text: 'A slow IT support team', correct: false }
      ],
      explanation: 'They seek long-term persistence in critical infrastructure undetected.'
    },
    {
      level: 'Avanzado',
      question: 'What is Session Hijacking?',
      options: [
        { text: 'Stealing or impersonating an active session token of a legitimate user', correct: true },
        { text: 'Turning off a computer remotely', correct: false }
      ],
      explanation: 'It allows the attacker to operate under the victim identity without knowing their password.'
    },
    {
      level: 'Avanzado',
      question: 'What is a Prompt Injection attack in AI / LLM models?',
      options: [
        { text: 'Manipulating text inputs to bypass model safety restrictions', correct: true },
        { text: 'Injecting electric current into the AI processor', correct: false }
      ],
      explanation: 'It tricks intelligent assistants into revealing secrets or executing forbidden tasks.'
    },
    {
      level: 'Avanzado',
      question: 'What is the "DLL Hijacking" persistence technique in Windows?',
      options: [
        { text: 'Placing a malicious DLL in high-priority paths so a legitimate app loads it', correct: true },
        { text: 'Uninstalling system libraries', correct: false }
      ],
      explanation: 'It allows executing arbitrary code with the privileges of the affected application.'
    },
    {
      level: 'Avanzado',
      question: 'What is RAM Memory Forensics?',
      options: [
        { text: 'Extracting and analyzing volatile memory dumps to find invisible malware artifacts', correct: true },
        { text: 'Checking graphics card gigabytes', correct: false }
      ],
      explanation: 'Crucial for uncovering injected processes, plaintext keys, and hidden connections.'
    },
    {
      level: 'Avanzado',
      question: 'What is a Side-Channel Attack?',
      options: [
        { text: 'Extracting cryptographic keys by measuring power consumption, electromagnetic radiation, or timing', correct: true },
        { text: 'Entering a building through the back door', correct: false }
      ],
      explanation: 'It attacks physical hardware implementation rather than mathematical algorithms.'
    },
    {
      level: 'Avanzado',
      question: 'What is Homomorphic Encryption?',
      options: [
        { text: 'Allowing mathematical computations on encrypted data without decrypting it first', correct: true },
        { text: 'Encryption changing shape every second', correct: false }
      ],
      explanation: 'It allows processing cloud data while maintaining complete privacy.'
    },
    {
      level: 'Avanzado',
      question: 'What is a Layer 7 Resource Exhaustion Denial of Service attack?',
      options: [
        { text: 'Attacks targeting web server HTTP threads or connections', correct: true },
        { text: 'Cutting undersea fiber optic cables', correct: false }
      ],
      explanation: 'It simulates complex legitimate requests difficult for traditional firewalls to filter.'
    },
    {
      level: 'Avanzado',
      question: 'What is the Software Supply Chain risk model?',
      options: [
        { text: 'Risks from compromised third-party dependencies and libraries prior to compilation', correct: true },
        { text: 'Physical logistics of laptop deliveries', correct: false }
      ],
      explanation: 'An attack on a popular open-source package infects thousands of dependent apps.'
    },
    {
      level: 'Avanzado',
      question: 'What is an SSRF (Server-Side Request Forgery) vulnerability?',
      options: [
        { text: 'Inducing the backend server to make HTTP requests to internal or forbidden destinations', correct: true },
        { text: 'A home Wi-Fi router glitch', correct: false }
      ],
      explanation: 'It bypasses perimeter controls to scan internal networks or cloud services.'
    },
    {
      level: 'Avanzado',
      question: 'What is "Kerberoasting" in Active Directory environments?',
      options: [
        { text: 'A technique to extract and offline crack Kerberos service tickets', correct: true },
        { text: 'A web authentication protocol', correct: false }
      ],
      explanation: 'It allows an attacker to obtain passwords of privileged service accounts.'
    },
    {
      level: 'Avanzado',
      question: 'What is Salting in password hashing?',
      options: [
        { text: 'Adding random data to a password before hashing to thwart rainbow table attacks', correct: true },
        { text: 'Encrypting databases with sea salt', correct: false }
      ],
      explanation: 'It ensures two users with identical passwords have completely different hashes.'
    },
    {
      level: 'Avanzado',
      question: 'What is Polymorphic Malware?',
      options: [
        { text: 'Modifying its signature and binary structure upon every infection to evade antiviruses', correct: true },
        { text: 'A virus that changes screen colors', correct: false }
      ],
      explanation: 'It uses mutating encryption engines to constantly alter hash appearances.'
    },
    {
      level: 'Avanzado',
      question: 'What is the "Pass-the-Hash" technique?',
      options: [
        { text: 'Authenticating to a system using password hashes instead of plaintext keys', correct: true },
        { text: 'Sending bulk emails', correct: false }
      ],
      explanation: 'It leverages protocols allowing captured memory hashes to be reused.'
    },
    {
      level: 'Avanzado',
      question: 'What is an LDAP Injection attack?',
      options: [
        { text: 'Manipulating corporate directory queries to bypass authentication', correct: true },
        { text: 'Injecting code into relational SQL databases', correct: false }
      ],
      explanation: 'It affects enterprise directory systems if inputs are improperly validated.'
    },
    {
      level: 'Avanzado',
      question: 'What is Fuzzing (Fuzz Testing)?',
      options: [
        { text: 'Automated technique injecting invalid or random data to find bugs and crashes', correct: true },
        { text: 'A blurry graphic design technique', correct: false }
      ],
      explanation: 'It helps discover buffer overflows and unexpected logical errors.'
    },
    {
      level: 'Avanzado',
      question: 'What is BGP Hijacking?',
      options: [
        { text: 'Intercepting internet traffic by falsifying route announcements in BGP', correct: true },
        { text: 'Stealing web domains (.com)', correct: false }
      ],
      explanation: 'It allows diverting global traffic of entire networks toward malicious servers.'
    },
    {
      level: 'Avanzado',
      question: 'What is the STRIDE threat modeling framework?',
      options: [
        { text: 'A threat classification framework (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, EoP)', correct: true },
        { text: 'An agile development methodology', correct: false }
      ],
      explanation: 'It helps software architects identify design security flaws.'
    },
    {
      level: 'Avanzado',
      question: 'What is an XML External Entity (XXE) Injection attack?',
      options: [
        { text: 'Exploiting vulnerable XML parsers to read local server files or perform SSRF', correct: true },
        { text: 'Modifying CSS styles on web pages', correct: false }
      ],
      explanation: 'It affects applications processing poorly validated XML inputs.'
    },
    {
      level: 'Avanzado',
      question: 'What is Cryptographic Key Rotation?',
      options: [
        { text: 'Periodically replacing old encryption keys with new ones to limit blast radius', correct: true },
        { text: 'Twisting router antennas', correct: false }
      ],
      explanation: 'It reduces exposure windows if a secret key gets compromised.'
    },
    {
      level: 'Avanzado',
      question: 'What is Insecure Deserialization?',
      options: [
        { text: 'Executing arbitrary code by manipulating serialized objects before app processing', correct: true },
        { text: 'Deleting compressed ZIP files', correct: false }
      ],
      explanation: 'It occurs when applications blindly trust complex deserialized data.'
    },
    {
      level: 'Avanzado',
      question: 'What characterizes a DGA (Domain Generation Algorithm) botnet?',
      options: [
        { text: 'Generating thousands of random daily domains to reach command servers without blocking', correct: true },
        { text: 'Creating automatic Wi-Fi networks', correct: false }
      ],
      explanation: 'It complicates defenders efforts when traditional control servers are taken down.'
    },
    {
      level: 'Avanzado',
      question: 'What is binary code analysis via reverse engineering?',
      options: [
        { text: 'Disassembling compiled code to understand logical behavior and detect malware', correct: true },
        { text: 'Converting code to natural Spanish language', correct: false }
      ],
      explanation: 'It allows dissecting malicious software samples when source code is unavailable.'
    },
    {
      level: 'Avanzado',
      question: 'What is persistence via services and scheduled tasks in operating systems?',
      options: [
        { text: 'Registering hidden tasks so malware automatically executes after every reboot', correct: true },
        { text: 'Setting alarms in the system clock', correct: false }
      ],
      explanation: 'A classic post-exploitation tactic to ensure continuous host access.'
    },
    {
      level: 'Avanzado',
      question: 'What is container-level sandboxing (Docker/K8s) and Container Escapes?',
      options: [
        { text: 'Vulnerabilities allowing a process inside a container to break out to the underlying host', correct: true },
        { text: 'Escaping a locked server room', correct: false }
      ],
      explanation: 'A critical risk breaking container isolation boundaries.'
    },
    {
      level: 'Avanzado',
      question: 'What is ASLR (Address Space Layout Randomization) overflow mitigation?',
      options: [
        { text: 'Randomizing process memory locations to make code execution exploits harder', correct: true },
        { text: 'Duplicating device RAM', correct: false }
      ],
      explanation: 'It makes exact locations of functions and variables in memory unpredictable to attackers.'
    }
  ];

    incidentsListEs: Incident[] = [
    // ==========================================
    // 🟢 INCIDENTES SOC - ESPAÑOL (30 PRINCIPIANTE)
    // ==========================================
    { level: 'Principiante', alertCode: 'SOC-01', description: 'Correo con remitente falso "soporte@sec-update.com" solicitando credenciales.', actions: [ { text: '🛡️ Bloquear y Reportar Phishing', correct: true, message: '¡Excelente decisión! Amenaza neutralizada con éxito.' }, { text: '⚠️ Ignorar y Marcar como Spam menor', correct: false, message: '¡Cuidado! Una suplantación activa requiere reporte formal.' } ] },
    { level: 'Principiante', alertCode: 'SOC-02', description: 'Conexión USB desconocida conectada a la estación de trabajo en horario no laboral.', actions: [ { text: '🚫 Desconectar dispositivo y notificar al SOC', correct: true, message: '¡Muy bien! Se previno una posible exfiltración o carga de malware físico.' }, { text: '📂 Explorar el contenido del USB por curiosidad', correct: false, message: '¡Peligro! Un dispositivo desconocido puede ejecutar payloads automáticos.' } ] },
    { level: 'Principiante', alertCode: 'SOC-03', description: 'Empleado comparte su contraseña temporal por chat de mensajería instantánea.', actions: [ { text: '🔒 Invalidar clave inmediatamente y exigir cambio por gestor', correct: true, message: '¡Correcto! Evitaste una brecha por exposición de credenciales.' }, { text: '💬 Dejar pasar la advertencia por ser un caso excepcional', correct: false, message: 'Riesgo alto: Las contraseñas compartidas comprometen la seguridad.' } ] },
    { level: 'Principiante', alertCode: 'SOC-04', description: 'Se detecta un aviso de navegador falso que indica que el equipo está infectado y exige llamar a un número.', actions: [ { text: '❌ Cerrar navegador y no llamar a ningún contacto', correct: true, message: '¡Impecable! Evitaste caer en una estafa de soporte técnico fraudulento.' }, { text: '📞 Llamar al número proporcionado para recibir ayuda', correct: false, message: 'Error: Los estafadores aprovecharán para robar datos o instalar software malicioso.' } ] },
    { level: 'Principiante', alertCode: 'SOC-05', description: 'Documento PDF recibido de un remitente desconocido con macros habilitadas pendientes.', actions: [ { text: '🗑️ Eliminar el archivo sin abrirlo ni activar contenido', correct: true, message: '¡Muy bien! Los documentos con macros desconocidas suelen ocultar troyanos.' }, { text: '👁️ Abrir el archivo en modo de edición para leerlo', correct: false, message: 'Peligro: Activar macros en documentos dudosos ejecuta código malicioso.' } ] },
    { level: 'Principiante', alertCode: 'SOC-06', description: 'Un usuario deja su sesión de correo abierta y desbloqueada al ausentarse del escritorio.', actions: [ { text: '💻 Bloquear la sesión manualmente con combinación de teclas', correct: true, message: '¡Excelente cultura de seguridad física!' }, { text: '👀 Dejar la sesión abierta esperando que regrese', correct: false, message: 'Riesgo: Cualquier persona puede acceder y suplantar al usuario.' } ] },
    { level: 'Principiante', alertCode: 'SOC-07', description: 'Impresora compartida con documentos impresos con datos personales olvidados en la bandeja.', actions: [ { text: '📄 Retirar los documentos y entregarlos a seguridad o su dueño', correct: true, message: '¡Muy bien! Evitaste una fuga de información física.' }, { text: '🗑️ Tirar los papeles a la basura común sin revisar', correct: false, message: 'Cuidado: Los datos en papel también deben protegerse contra el espionaje.' } ] },
    { level: 'Principiante', alertCode: 'SOC-08', description: 'Se recibe un SMS de una empresa de envíos pidiendo pagar una tasa aduanera mediante un enlace corto.', actions: [ { text: '🚫 Borrar mensaje sin hacer clic y verificar en la web oficial', correct: true, message: '¡Correcto! Es una campaña típica de smishing.' }, { text: '💳 Ingresar los datos de tarjeta para liberar el paquete', correct: false, message: 'Peligro: Entregaste tus datos bancarios a defraudadores.' } ] },
    { level: 'Principiante', alertCode: 'SOC-09', description: 'Colaborador utiliza una memoria USB corporativa en una computadora pública de un café.', actions: [ { text: '⚠️ Reportar al equipo de seguridad para análisis preventivo del USB', correct: true, message: '¡Excelente! Los equipos públicos suelen estar infectados.' }, { text: '🔌 Conectar la memoria directamente al PC de la oficina', correct: false, message: 'Riesgo alto de introducir malware corporativo.' } ] },
    { level: 'Principiante', alertCode: 'SOC-10', description: 'Intento de acceso físico por parte de una persona sin credencial siguiendo de cerca a un empleado (tailgating).', actions: [ { text: '🛑 Detener a la persona y solicitar su identificación oficial', correct: true, message: '¡Impecable! Detuviste un intento de intrusión física.' }, { text: '🚪 Sostener la puerta amablemente sin verificar', correct: false, message: 'Error de seguridad: Facilitaste el acceso a un posible atacante.' } ] },
    { level: 'Principiante', alertCode: 'SOC-11', description: 'Alerta de app móvil que indica que una aplicación no oficial tiene permisos de superposición.', actions: [ { text: '⚙️ Revocar permisos y desinstalar la aplicación sospechosa', correct: true, message: '¡Correcto! Preveniste el robo de credenciales mediante pantallas falsas.' }, { text: '📲 Ignorar el aviso y continuar usándola', correct: false, message: 'Peligro: Estas apps pueden capturar tus claves bancarias.' } ] },
    { level: 'Principiante', alertCode: 'SOC-12', description: 'Se detecta la clave de un servicio interno escrita en una nota adhesiva debajo del teclado.', actions: [ { text: '🗑️ Destruir la nota adhesiva y exigir el uso de gestor de claves', correct: true, message: '¡Muy bien! Eliminaste una vulnerabilidad física crítica.' }, { text: '📝 Pegarla en un lugar más escondido del monitor', correct: false, message: 'Insuficiente: Las claves nunca deben anotarse físicamente.' } ] },
    { level: 'Principiante', alertCode: 'SOC-13', description: 'Correo electrónico institucional anunciando un bono navideño con un enlace exterior dudoso.', actions: [ { text: '🔍 Verificar con el departamento de TI antes de interactuar', correct: true, message: '¡Excelente reflejo de validación!' }, { text: '🎉 Hacer clic rápido para no perder el bono', correct: false, message: 'Caíste en un gancho de phishing estacional.' } ] },
    { level: 'Principiante', alertCode: 'SOC-14', description: 'Conexión a una red Wi-Fi pública abierta sin utilizar VPN para revisar correos de la empresa.', actions: [ { text: '🔒 Activar inmediatamente la Red Privada Virtual corporativa', correct: true, message: '¡Perfecto! Blindaste tus comunicaciones frente a escuchas locales.' }, { text: '🌐 Continuar navegando sin protección', correct: false, message: 'Riesgo: Tus credenciales de correo quedaron expuestas en la red abierta.' } ] },
    { level: 'Principiante', alertCode: 'SOC-15', description: 'Llamada telefónica de alguien que dice ser del banco pidiendo validar el código OTP recibido.', actions: [ { text: '📵 Colgar de inmediato el teléfono y reportar el fraude', correct: true, message: '¡Excelente! Ningún banco legítimo pide códigos OTP por teléfono.' }, { text: '🗣️ Dictar el código para solucionar el problema reportado', correct: false, message: 'Peligro: Permitiste una transferencia bancaria no autorizada.' } ] },
    { level: 'Principiante', alertCode: 'SOC-16', description: 'Software antivirus muestra advertencia de actualización pendiente desatendida por semanas.', actions: [ { text: '🔄 Ejecutar la actualización del antivirus de inmediato', correct: true, message: '¡Correcto! Mantuviste las firmas de protección al día.' }, { text: '💤 Posponer la actualización indefinidamente', correct: false, message: 'Riesgo: El equipo queda vulnerable ante nuevas amenazas.' } ] },
    { level: 'Principiante', alertCode: 'SOC-17', description: 'Se encuentra un documento impreso corporativo confidencial olvidado en una cafetería.', actions: [ { text: '📋 Recoger el documento y entregarlo en el área de seguridad', correct: true, message: '¡Muy bien! Evitaste la divulgación de secretos comerciales.' }, { text: '👀 Leerlo por curiosidad y dejarlo en el mismo sitio', correct: false, message: 'Violación de confidencialidad y buenas prácticas.' } ] },
    { level: 'Principiante', alertCode: 'SOC-18', description: 'Un archivo descargado de internet tiene extensión doble (ej. .pdf.exe).', actions: [ { text: '🚫 Detener la ejecución y eliminar el archivo inmediatamente', correct: true, message: '¡Excelente! Identificaste una técnica clásica de camuflaje de malware.' }, { text: '📂 Abrir el archivo confiando en que es un documento', correct: false, message: 'Peligro: Ejecutaste un ejecutable malicioso disfrazado de PDF.' } ] },
    { level: 'Principiante', alertCode: 'SOC-19', description: 'Solicitud de amistad en red social profesional de perfil sin foto ni trayectoria clara.', actions: [ { text: '❌ Rechazar la solicitud por sospecha de perfil falso', correct: true, message: '¡Muy bien! Protegiste tu red de contactos frente a espionaje.' }, { text: 'accept Aceptar para ampliar la red de contactos', correct: false, message: 'Riesgo: Expones tus publicaciones corporativas a actores maliciosos.' } ] },
    { level: 'Principiante', alertCode: 'SOC-20', description: 'Aviso de seguridad indicando que la contraseña actual es débil y reutilizada.', actions: [ { text: '🔑 Cambiar la contraseña por una robusta y única de inmediato', correct: true, message: '¡Impecable! Fortaleciste la postura de seguridad de tu cuenta.' }, { text: '⏰ Ignorar la notificación hasta la próxima semana', correct: false, message: 'Riesgo de acceso no autorizado por fuerza bruta.' } ] },
    { level: 'Principiante', alertCode: 'SOC-21', description: 'Se detecta un conector USB sospechoso enchufado en un puerto de pared de la sala de reuniones.', actions: [ { text: '🔌 Desconectar el aparato y reportarlo a mantenimiento o TI', correct: true, message: '¡Excelente! Podría tratarse de un dispositivo de espionaje o carga maliciosa.' }, { text: '📱 Conectar el celular a cargar en dicho puerto', correct: false, message: 'Peligro de robo de datos o infección (juice jacking).' } ] },
    { level: 'Principiante', alertCode: 'SOC-22', description: 'Usuario reporta que su pantalla parpadea y abre pestañas de navegador por sí sola.', actions: [ { text: 'disconnect Desconectar red y notificar al SOC por posible control remoto', correct: true, message: '¡Correcto! Se actuó ante síntomas claros de intrusión activa.' }, { text: '☕ Continuar trabajando ignorando el parpadeo', correct: false, message: 'Peligro: Un atacante podría estar operando el equipo en vivo.' } ] },
    { level: 'Principiante', alertCode: 'SOC-23', description: 'Se recibe un correo con faltas graves de ortografía y logotipos borrosos de una entidad oficial.', actions: [ { text: '🛡️ Marcar como correo no deseado y reportar phishing', correct: true, message: '¡Muy bien! Reconociste los indicios visuales clásicos de estafa.' }, { text: '🔗 Hacer clic en el enlace por si acaso es importante', correct: false, message: 'Riesgo de compromiso de credenciales.' } ] },
    { level: 'Principiante', alertCode: 'SOC-24', description: 'Un compañero pide prestado tu equipo personal de trabajo para revisar sus redes sociales.', actions: [ { text: '⛔ Negarse amablemente explicando las políticas de seguridad de la empresa', correct: true, message: '¡Excelente! Los equipos corporativos son de uso exclusivo y estrictamente personal.' }, { text: '🤝 Prestar el equipo sin supervisión', correct: false, message: 'Violación de control de acceso y custodia de activos.' } ] },
    { level: 'Principiante', alertCode: 'SOC-25', description: 'Aparece una ventana emergente de actualización de software desconocido al iniciar el PC.', actions: [ { text: '❌ Cancelar la ventana y verificar con el soporte técnico interno', correct: true, message: '¡Correcto! Preveniste la instalación de programas no autorizados o adware.' }, { text: '📥 Instalar para que la ventana deje de molestar', correct: false, message: 'Riesgo de instalar software malicioso o inútil.' } ] },
    { level: 'Principiante', alertCode: 'SOC-26', description: 'Se detecta un correo con la dirección del jefe pero solicitando acciones inusuales de dinero.', actions: [ { text: '📞 Llamar directamente al jefe por teléfono para confirmar la orden', correct: true, message: '¡Impecable! Verificación cruzada fuera de banda exitosa.' }, { text: '💸 Realizar la transferencia solicitada inmediatamente', correct: false, message: 'Caíste en un fraude de suplantación de directivos (BEC básico).' } ] },
    { level: 'Principiante', alertCode: 'SOC-27', description: 'Un dispositivo Bluetooth desconocido solicita emparejamiento constante con tu móvil.', actions: [ { text: '🚫 Rechazar el emparejamiento y desactivar Bluetooth temporalmente', correct: true, message: '¡Muy bien! Evitaste posibles ataques de proximidad (Bluejacking).' }, { text: '✅ Aceptar para ver de qué dispositivo se trata', correct: false, message: 'Riesgo de transferencia de archivos maliciosos no deseados.' } ] },
    { level: 'Principiante', alertCode: 'SOC-28', description: 'Se extravía una tarjeta de identificación o carnet de acceso a las oficinas.', actions: [ { text: '📢 Notificar de inmediato a seguridad física para bloquear el acceso', correct: true, message: '¡Excelente! Evitaste el ingreso de unauthorized persons.' }, { text: '🤫 Guardar silencio esperando encontrarlo mañana', correct: false, message: 'Riesgo alto de intrusión física con credencial activa.' } ] },
    { level: 'Principiante', alertCode: 'SOC-29', description: 'El navegador advierte que el certificado de seguridad de un sitio web interno ha expirado.', actions: [ { text: '⚠️ Detener la navegación y reportar al administrador de sistemas', correct: true, message: '¡Correcto! Evitaste posibles ataques de intermediario.' }, { text: '⏭️ Omitir la advertencia y continuar de todos modos', correct: false, message: 'Peligro: Podrías exponerte a comunicaciones no cifradas o suplantaciones.' } ] },
    { level: 'Principiante', alertCode: 'SOC-30', description: 'Se recibe una encuesta atractiva por correo prometiendo un smartphone gratis a cambio de datos.', actions: [ { text: '🗑️ Borrar el correo sin abrir enlaces', correct: true, message: '¡Muy bien! Identificaste una típica campaña de ingeniería social.' }, { text: '📝 Llenar el formulario con tus datos personales', correct: false, message: 'Entregaste tu información personal a estafadores.' } ] },

    // ==========================================
    // 🟡 INCIDENTES SOC - ESPAÑOL (30 INTERMEDIO)
    // ==========================================
    { level: 'Intermedio', alertCode: 'SOC-31', description: 'Intento de inicio de sesión múltiple fallido desde una IP desconocida en el extranjero.', actions: [ { text: '🔒 Forzar cambio de clave y bloqueo temporal', correct: true, message: '¡Correcto! Detuviste un ataque de fuerza bruta a tiempo.' }, { text: '📁 Dejar pasar, probablemente olvidaron su clave', correct: false, message: '¡Peligro! Ignorar accesos extraños expone la cuenta a intrusos.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-32', description: 'Tráfico inusual saliente de la base de datos hacia un servidor externo desconocido.', actions: [ { text: '🛑 Suspender la conexión saliente y auditar consultas SQL', correct: true, message: '¡Excelente! Se contuvo una potencial exfiltración de datos.' }, { text: '🔄 Reiniciar el servidor de base de datos sin revisar logs', correct: false, message: 'Error: No se identificó el origen de la fuga.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-33', description: 'Se detecta un escaneo de puertos masivo (Port Scanning) desde una IP interna del segmento de desarrollo.', actions: [ { text: '🔍 Aislar el host emisor del escaneo e investigar código o malware', correct: true, message: '¡Impecable! Contuviste un reconocimiento interno.' }, { text: '📊 Ignorar el tráfico por ser horario de pruebas', correct: false, message: 'Riesgo: Podría tratarse de un equipo ya comprometido.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-34', description: 'Certificado SSL/TLS corporativo próximo a expirar en portal público de clientes.', actions: [ { text: '🔄 Renovar e instalar el certificado antes de la fecha límite', correct: true, message: '¡Muy bien! Evitaste interrupciones de servicio y alertas de navegador.' }, { text: '⏳ Esperar a que expire para ver qué impacto genera', correct: false, message: 'Error crítico: Los clientes perderán confianza y acceso seguro.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-35', description: 'Se detecta un intento de inyección SQL (SQLi) reflejado en los logs del servidor web principal.', actions: [ { text: '🛡️ Bloquear la IP atacante y revisar validación de entradas en la app', correct: true, message: '¡Excelente respuesta de mitigación!' }, { text: '🗑️ Borrar los registros de logs para liberar espacio', correct: false, message: 'Error: Eliminaste evidencia crucial para la forense.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-36', description: 'Alerta de EDR: Proceso PowerShell ejecutando comandos codificados en base64 de forma sospechosa.', actions: [ { text: '🛑 Terminar el proceso y aislar el endpoint afectado', correct: true, message: '¡Muy bien! Detuviste una ejecución de script ofuscado malicioso.' }, { text: '👀 Dejar correr el comando para ver qué intenta hacer', correct: false, message: 'Peligro: Podría comprometer todo el dominio.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-37', description: 'Se descubre un bucket de almacenamiento en la nube S3 con permisos públicos de lectura y escritura.', actions: [ { text: '🔒 Restringir de inmediato los permisos y auditar accesos recientes', correct: true, message: '¡Correcto! Preveniste una exposición masiva de datos.' }, { text: '🌐 Dejarlo público para facilitar la colaboración', correct: false, message: 'Riesgo crítico de fuga de información.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-38', description: 'Se detecta un intento de ataque de fuerza bruta contra el servicio SSH expuesto en internet.', actions: [ { text: '🛡️ Implementar bloqueo por Fail2ban y cambiar el puerto por defecto', correct: true, message: '¡Excelente! Mitigaste los intentos automatizados de acceso.' }, { text: '🚪 Apagar el servidor SSH permanentemente', correct: false, message: 'Innecesario: El servicio es necesario, solo requiere endurecimiento.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-39', description: 'Se encuentra una clave API de producción publicada por error en un commit reciente de GitHub.', actions: [ { text: '🔑 Revocar la API key de inmediato, rotar credenciales y limpiar historial', correct: true, message: '¡Impecable! Evitaste el uso malicioso de tus servicios cloud.' }, { text: '📝 Editar el archivo en el repositorio ocultando la línea', correct: false, message: 'Insuficiente: El historial de Git conserva la clave filtrada.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-40', description: 'Logs muestran múltiples solicitudes HTTP GET masivas intentando saturar la memoria caché.', actions: [ { text: '⚡ Activar reglas de mitigación de tasa (Rate Limiting) en el WAF', correct: true, message: '¡Muy bien! Frenaste un intento de DoS a nivel de aplicación.' }, { text: '🔌 Desconectar el servidor web de internet', correct: false, message: 'Medida extrema innecesaria que afecta la disponibilidad legítima.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-41', description: 'Se detecta un cambio no autorizado en los registros DNS MX de un dominio corporativo.', actions: [ { text: '🛡️ Revertir registros DNS en el registrador y revisar credenciales de acceso', correct: true, message: '¡Correcto! Evitaste la interceptación de correos electrónicos.' }, { text: '📞 Llamar al proveedor de internet para reclamar', correct: false, message: 'Error: El problema suele estar en credenciales filtradas del panel DNS.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-42', description: 'Un usuario con privilegios estándar ejecuta herramientas de auditoría de red (Nmap, Wireshark) en su PC.', actions: [ { text: '🔍 Investigar el motivo y confiscar temporalmente la herramienta si no está autorizada', correct: true, message: '¡Muy bien! Controlaste el reconocimiento interno no autorizado.' }, { text: '👍 Felicitar al usuario por su interés en la seguridad', correct: false, message: 'Riesgo: El uso de herramientas de hacking sin permiso viola políticas.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-43', description: 'Se observa un pico inusual de descargas de archivos grandes desde la base de datos hacia una IP externa.', actions: [ { text: '🛑 Bloquear IP externa y aislar el servidor gestor temporalmente', correct: true, message: '¡Excelente! Contuviste una posible exfiltración de datos.' }, { text: '☕ Esperar a que termine la transferencia para ver qué descargaron', correct: false, message: 'Error crítico: Permitiste que la información saliera por completo.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-44', description: 'Se detecta que una librería NPM de terceros incorporada recientemente tiene una CVE crítica conocida.', actions: [ { text: '📦 Actualizar la librería a una versión parcheada de inmediato', correct: true, message: '¡Impecable! Mitigaste el riesgo en la cadena de suministro.' }, { text: '🗑️ Eliminar toda la aplicación y reescribirla desde cero', correct: false, message: 'Desproporcionado: Solo se requiere actualizar la dependencia.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-45', description: 'Alerta SOC: Autenticación exitosa desde una ubicación geográfica imposible en un intervalo de 10 minutos (viaje imposible).', actions: [ { text: '🔒 Revocar sesiones activas del usuario y solicitar cambio de clave', correct: true, message: '¡Correcto! Preveniste el secuestro de cuenta.' }, { text: '✈️ Asumir que el usuario viajó en avión privado', correct: false, message: 'Peligro: Ignoraste un indicador claro de compromiso (IoC).' } ] },
    { level: 'Intermedio', alertCode: 'SOC-46', description: 'Se detectan peticiones HTTP con cargas útiles (Payloads) dirigidas a explotar vulnerabilidades de Path Traversal.', actions: [ { text: '🛡️ Bloquear origen en el WAF y auditar logs del servidor web', correct: true, message: '¡Muy bien! Bloqueaste un intento de lectura de archivos protegidos.' }, { text: '📂 Cambiar de carpeta todos los archivos del servidor', correct: false, message: 'Ineficaz: No soluciona el vector de ataque ni bloquea al agresor.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-47', description: 'Un script automatizado de respaldo genera errores constantes debido a accesos denegados en bases de datos.', actions: [ { text: '🛠️ Revisar permisos de la cuenta de servicio de respaldos', correct: true, message: '¡Correcto! Restauraste la integridad de las copias de seguridad.' }, { text: '🗑️ Desactivar los respaldos para que dejen de salir alertas', correct: false, message: 'Riesgo alto: Te quedas sin copias de seguridad funcionales.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-48', description: 'Se descubre un servidor de base de datos de pruebas expuesto a internet sin contraseña robusta.', actions: [ { text: '🔒 Bloquear acceso exterior mediante firewall y asegurar credenciales', correct: true, message: '¡Excelente! Eliminaste una puerta de entrada crítica.' }, { text: '📢 Publicar en el chat general un llamado de atención', correct: false, message: 'Insuficiente: El servidor sigue expuesto mientras discuten.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-49', description: 'Se detecta un intento de denegación de servicio lento (Slowloris) saturando las conexiones HTTP.', actions: [ { text: '⚡ Ajustar tiempos de espera (Timeouts) en el servidor web y proxy inversor', correct: true, message: '¡Muy bien! Mitigaste el agotamiento de hilos de conexión.' }, { text: '🔄 Reiniciar la computadora del operador', correct: false, message: 'Ineficaz: El ataque proviene de múltiples IPs distribuidas.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-50', description: 'Se detecta que un empleado desactivó el software antivirus en su equipo de trabajo.', actions: [ { text: '💻 Forzar la reactivación remota del antivirus y abrir incidente disciplinario', correct: true, message: '¡Impecable! Mantuviste el cumplimiento normativo endpoint.' }, { text: '🤷‍♂️ Dejarlo así si el empleado promete que no lo volverá a hacer', correct: false, message: 'Riesgo: El equipo queda totalmente desprotegido ante malware.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-51', description: 'Alerta de redireccionamiento abierto (Open Redirect) detectado en parámetros de URL de la web corporativa.', actions: [ { text: '🛠️ Modificar el código para validar y restringir destinos de redirección', correct: true, message: '¡Correcto! Preveniste que tu web sea usada para phishing externo.' }, { text: '🌐 Cambiar el dominio principal de la empresa', correct: false, message: 'Desproporcionado: El problema radica en la validación de parámetros.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-52', description: 'Se detectan múltiples peticiones de restablecimiento de contraseña masivas hacia cuentas de clientes.', actions: [ { text: '🛡️ Implementar CAPTCHA y limitar la tasa de solicitudes por IP', correct: true, message: '¡Muy bien! Frenaste el acoso y posible enumeración de usuarios.' }, { text: '🚫 Desactivar la opción de recuperar contraseña para todos', correct: false, message: 'Medida drástica que afecta negativamente la experiencia del cliente legítimo.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-53', description: 'Se descubre un certificado SSL autofirmado desconocido instalado en un proxy de la red interna.', actions: [ { text: '🔍 Investigar el origen del certificado y aislar el proxy si es anómalo', correct: true, message: '¡Excelente! Podría tratarse de un ataque de intermediario interno (MitM).' }, { text: '✅ Aceptar el certificado en todos los navegadores corporativos', correct: false, message: 'Peligro grave: Autorizaste una interceptación de tráfico no verificada.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-54', description: 'Se detecta una regla de reenvío automático oculta en un buzón de correo corporativo comprometido.', actions: [ { text: '🗑️ Eliminar la regla de reenvío, cambiar contraseña y revisar logs de acceso', correct: true, message: '¡Correcto! Detuviste la filtración silenciosa de correos.' }, { text: '👀 Dejar la regla activa para ver quién recibe los correos', correct: false, message: 'Riesgo: Continuarán exfiltrándose comunicaciones sensibles.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-55', description: 'Se descubre tráfico cifrado anómalo saliendo hacia puertos no estándar (ej. puerto 4444).', actions: [ { text: '🛑 Aislar el equipo y analizar si corresponde a una sesión de C2 (Command and Control)', correct: true, message: '¡Impecable! Detectaste indicios de una posible puerta trasera activa.' }, { text: '🌐 Abrir el puerto en el firewall perimetral para permitir el tráfico', correct: false, message: 'Peligro extremo: Facilitaste la comunicación de un troyano.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-56', description: 'Se detecta un intento de ataque de Cross-Site Request Forgery (CSRF) contra el panel de administración.', actions: [ { text: '🛡️ Verificar implementación de tokens anti-CSRF en formularios críticos', correct: true, message: '¡Muy bien! Aseguraste la integridad de las peticiones de usuario.' }, { text: '🚪 Cerrar todas las sesiones de usuarios actuales', correct: false, message: 'Medida temporal que no soluciona la vulnerabilidad del código.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-57', description: 'Se observa que un script de automatización utiliza credenciales en texto plano dentro de su código.', actions: [ { text: '🔐 Migrar las credenciales a un gestor de secretos o variables de entorno', correct: true, message: '¡Correcto! Eliminaste la exposición de secretos en código fuente.' }, { text: '📝 Cifrar el script con una contraseña débil', correct: false, message: 'Insuficiente: Las credenciales embebidas siguen siendo vulnerables.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-58', description: 'Se detecta un aumento repentino en el uso de CPU al 100% en servidores web sin tráfico legítimo alto.', actions: [ { text: '🔍 Inspeccionar procesos activos en busca de mineros de criptomonedas o malware', correct: true, message: '¡Excelente! Identificaste uso no autorizado de recursos.' }, { text: '🧰 Comprar más servidores físicos inmediatamente', correct: false, message: 'Error: El problema es lógico/malicioso, no de capacidad de hardware.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-59', description: 'Se descubre un dominio typosquatting registrado recientemente que imita al de la empresa.', actions: [ { text: '⚖️ Iniciar acciones legales de protección de marca y alertar a los usuarios', correct: true, message: '¡Muy bien! Anticipaste posibles campañas de phishing dirigidas.' }, { text: '😴 Ignorarlo hasta que comiencen a estafar clientes', correct: false, message: 'Riesgo: Dejar actuar al atacante daña la reputación corporativa.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-60', description: 'Se detecta que el registro de auditoría (logs) de un servidor crítico fue borrado o detenido.', actions: [ { text: '🚨 Declarar incidente crítico, aislar el servidor y volcar evidencia forense', correct: true, message: '¡Impecable! Los atacantes suelen borrar logs para ocultar sus huellas.' }, { text: '🔄 Reiniciar el servicio de logs y continuar operando con normalidad', correct: false, message: 'Peligro grave: Ignoraste un claro indicador de compromiso de post-explotación.' } ] },

    // ==========================================
    // 🔴 INCIDENTES SOC - ESPAÑOL (30 AVANZADO)
    // ==========================================
    { level: 'Avanzado', alertCode: 'SOC-61', description: 'Archivo ejecutable desconocido descargado ejecutando llamadas anómalas a registros del sistema.', actions: [ { text: '🛑 Aislar host de la red y volcar memoria RAM', correct: true, message: '🔥 ¡Muy bien! Contuviste un avance de malware persistente avanzado (APT).' }, { text: '🗑️ Solo borrar el archivo ejecutable de la carpeta Temp', correct: false, message: '⚠️ ¡Insuficiente! El proceso inyectado sigue operando en memoria.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-62', description: 'Modificación no autorizada detectada en reglas iptables del cortafuegos perimetral.', actions: [ { text: '🛡️ Revertir reglas desde respaldo seguro y aislar IP gestora', correct: true, message: '¡Impecable! Se neutralizó una brecha de persistencia en red.' }, { text: '✍️ Editar manualmente las reglas en caliente sin respaldo', correct: false, message: 'Riesgo alto: Podría dejar expuesto el segmento interno.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-63', description: 'Se detecta inyección de DLL maliciosa en un proceso legítimo del sistema (explorer.exe).', actions: [ { text: '🛑 Suspender proceso host, aislar máquina y extraer volcado de memoria', correct: true, message: '¡Excelente! Detuviste una técnica avanzada de evasión de EDR.' }, { text: '🔄 Reiniciar la computadora para limpiar la RAM', correct: false, message: 'Insuficiente: Pierdes evidencia forense volátil valiosa.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-64', description: 'Se observa actividad de Kerberoasting solicitando tickets TGS masivos en Active Directory.', actions: [ { text: '🔒 Forzar rotación inmediata de passwords de cuentas de servicio y auditar permisos', correct: true, message: '¡Impecable! Frenaste la extracción offline de hashes de servicio.' }, { text: '🚪 Apagar el controlador de dominio principal', correct: false, message: 'Medida catastrófica que interrumpe toda la autenticación de la red.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-65', description: 'Se detecta un ataque de Deserialización Insegura explotando un endpoint Java RMI expuesto.', actions: [ { text: '🛑 Aislar servidor afectado, parchear librería vulnerable y analizar persistencia', correct: true, message: '¡Muy bien! Contuviste una ejecución remota de código (RCE) crítica.' }, { text: '🌐 Cambiar la contraseña del usuario administrador del sistema operativo', correct: false, message: 'Insuficiente: El RCE permite control total sin requerir contraseñas.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-66', description: 'Alerta de exfiltración mediante túnel DNS encubierto hacia un dominio externo controlado por atacantes.', actions: [ { text: '🛑 Bloquear tráfico DNS saliente no autorizado y aislar host emisor', correct: true, message: '¡Excelente! Cortaste un canal clandestino de salida de datos.' }, { text: '🌐 Cambiar el proveedor de internet de la oficina', correct: false, message: 'Ineficaz: El problema reside en el host interno infectado.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-67', description: 'Se detecta un volcado de credenciales de LSASS en memoria mediante herramientas de volcado tipo Mimikatz.', actions: [ { text: '🚨 Aislar host, asumir compromiso total de credenciales del dominio y forzar reset masivo', correct: true, message: '¡Impecable! Contuviste el robo de hashes de todo el entorno.' }, { text: '💻 Solo cerrar la sesión del usuario actual', correct: false, message: 'Insuficiente: Las credenciales en memoria ya fueron robadas.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-68', description: 'Se descubre un ataque de Pass-the-Hash exitoso autenticándose en múltiples servidores internos.', actions: [ { text: '🛡️ Aislar los sistemas afectados, revocar tickets Kerberos y aplicar parches de aislamiento', correct: true, message: '¡Muy bien! Frenaste el movimiento lateral del atacante en la red.' }, { text: '🔄 Cambiar todas las contraseñas de usuario estándar de la red', correct: false, message: 'Incompleto: El ataque utiliza hashes de cuentas de servicio/admin.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-69', description: 'Se detecta una tarea programada maliciosa oculta ejecutando comandos codificados cada hora.', actions: [ { text: '🔍 Eliminar tarea persistente, auditar claves de registro Run y aislar host', correct: true, message: '¡Correcto! Neutralizaste un mecanismo de persistencia avanzado.' }, { text: '⏰ Cambiar la hora del sistema para que no se ejecute a tiempo', correct: false, message: 'Peligro: Es una solución falsa que no elimina el malware.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-70', description: 'Se descubre un ataque de SSRF permitiendo a un atacante consultar metadatos internos de AWS (IMDSv1).', actions: [ { text: '🛡️ Migrar a IMDSv2 obligatorio y bloquear rutas de metadatos en la aplicación', correct: true, message: '¡Excelente! Preveniste el robo de roles IAM de la instancia cloud.' }, { text: '🌐 Apagar la consola de AWS completa', correct: false, message: 'Desproporcionado: La falla radica en la aplicación vulnerable al SSRF.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-71', description: 'Se detecta actividad de un Rootkit a nivel de kernel ocultando procesos maliciosos en Linux.', actions: [ { text: '🚨 Apagar físicamente el servidor, arrancar con medio forense externo y reconstruir desde cero', correct: true, message: '¡Impecable! Un rootkit de kernel invalida la confianza en el sistema operativo.' }, { text: '💻 Matar el proceso oculto usando el comando kill', correct: false, message: 'Inútil: El kernel comprometido seguirá ocultando y ejecutando el código.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-72', description: 'Se detecta un ataque de BGP Hijacking alterando rutas de tráfico internacional hacia servicios corporativos.', actions: [ { text: '📞 Coordinar urgentemente con el proveedor ISP y administradores de AS para corregir anuncios', correct: true, message: '¡Muy bien! Restableciste las rutas legítimas de enrutamiento global.' }, { text: '🔄 Reiniciar el router principal de la oficina', correct: false, message: 'Ineficaz: El secuestro ocurre a nivel de operadores de internet globales.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-73', description: 'Se detecta inyección de comandos OS (OS Command Injection) en interfaz de administración avanzada.', actions: [ { text: '🛑 Aislar host, parchear vulnerabilidad de validación y revisar logs de ejecución', correct: true, message: '¡Correcto! Detuviste la ejecución directa de comandos en el servidor.' }, { text: '🎨 Cambiar el diseño de la interfaz gráfica', correct: false, message: 'Absurdo: El problema es de seguridad lógica en el backend.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-74', description: 'Se detecta un intento de compromiso de firmware UEFI/BIOS en estaciones de trabajo clave.', actions: [ { text: '🛠️ Reinstalar chip SPI físicamente o reemplazar motherboard y verificar Secure Boot', correct: true, message: '¡Impecable! Contuviste persistencia a nivel de firmware hardware.' }, { text: '🗑️ Formatear el disco duro principal', correct: false, message: 'Insuficiente: El malware en UEFI sobrevive al formateo del disco.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-75', description: 'Se detecta un ataque de inyección LDAP permitiendo bypass de autenticación en directorio corporativo.', actions: [ { text: '🛡️ Sanitizar entradas de consulta LDAP y aplicar filtros estrictos en el código', correct: true, message: '¡Muy bien! Restauraste la integridad de la autenticación de directorio.' }, { text: '🚪 Apagar el servicio de directorio Active Directory', correct: false, message: 'Catastrófico: Interrumpiría toda la operación de la compañía.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-76', description: 'Se descubre un ataque de tipo Container Escape permitiendo salir de un contenedor Docker al host.', actions: [ { text: '🚨 Aislar host físico subyacente, parchear motor de contenedores y revocar privilegios', correct: true, message: '¡Excelente! Contuviste el salto de aislamiento de contenedores.' }, { text: '🔄 Reiniciar el contenedor Docker afectado', correct: false, message: 'Insuficiente: El host subyacente ya fue vulnerado.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-77', description: 'Se detecta un ataque de poisoning de caché ARP (ARP Spoofing) en la red local de la oficina.', actions: [ { text: '🛡️ Activar mitigaciones de seguridad de puertos (Dynamic ARP Inspection / Port Security) en switches', correct: true, message: '¡Impecable! Detuviste la interceptación de tráfico local en capa 2.' }, { text: '📶 Cambiar la contraseña del Wi-Fi de invitados', correct: false, message: 'Ineficaz: El ataque ocurre por manipulación de tablas ARP locales.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-78', description: 'Se detecta uso de técnicas de Domain Generation Algorithms (DGA) en peticiones DNS masivas.', actions: [ { text: '🛑 Aislar host emisor, bloquear dominios generados y analizar muestra de malware', correct: true, message: '¡Muy bien! Identificaste una botnet intentando comunicarse con C2.' }, { text: '🌐 Cambiar las DNS públicas a Google (8.8.8.8)', correct: false, message: 'Insuficiente: El host interno sigue infectado generando peticiones.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-79', description: 'Se detecta un ataque de explotación de desbordamiento de búfer (Buffer Overflow) en servicio demonio expuesto.', actions: [ { text: '🛑 Aislar servicio afectado, aplicar parche del fabricante y revisar volcados de core', correct: true, message: '¡Correcto! Contuviste un vector clásico de ejecución remota.' }, { text: '💻 Reiniciar el servicio cada 5 minutos automáticamente', correct: false, message: 'Peligro: El servicio seguirá siendo vulnerable a la explotación.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-80', description: 'Se detecta exfiltración masiva esteganográfica oculta dentro de imágenes PNG subidas por usuarios.', actions: [ { text: '🔍 Incautar muestras de imágenes, bloquear cuenta infractora y auditar algoritmo de subida', correct: true, message: '¡Impecable! Descubriste una técnica avanzada de ocultación de datos.' }, { text: '🖼️ Borrar todas las fotos de perfil de los usuarios', correct: false, message: 'Desproporcionado: Se debe analizar el vector esteganográfico específico.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-81', description: 'Se detecta ataque de inyección XXE (XML External Entity) leyendo archivos /etc/passwd del servidor.', actions: [ { text: '🛡️ Deshabilitar entidades externas (DTD) en el parser XML de la aplicación', correct: true, message: '¡Muy bien! Bloqueaste la lectura de ficheros internos mediante XML.' }, { text: '📂 Mover el archivo /etc/passwd a otra carpeta', correct: false, message: 'Absurdo: El sistema operativo requiere ese archivo para funcionar.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-82', description: 'Se detecta actividad de Golden Ticket permitiendo persistencia total en dominio Active Directory.', actions: [ { text: '🚨 Invalidar cuenta de servicio KRBTGT dos veces consecutivas y forzar reseteo global', correct: true, message: '¡Impecable! Invalidaste la llave maestra del dominio forzando la expulsión del atacante.' }, { text: '💻 Reiniciar el servidor DNS del dominio', correct: false, message: 'Insuficiente: El Golden Ticket se basa en la llave KRBTGT comprometida.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-83', description: 'Se detecta secuestro de sesión mediante análisis de tráfico y robo de cookies de autenticación cifradas.', actions: [ { text: '🔒 Invalidar tokens de sesión en servidor, forzar reautenticación y exigir 2FA robusto', correct: true, message: '¡Correcto! Frenaste la suplantación de identidad activa.' }, { text: '🍪 Pedir a los usuarios que borren las cookies manualmente', correct: false, message: 'Lento e ineficaz ante un ataque coordinado en curso.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-84', description: 'Se detecta un ataque de inyección de plantilla del lado del servidor (SSTI - Server-Side Template Injection).', actions: [ { text: '🛡️ Corregir la lógica de renderizado del motor de plantillas y aislar el entorno', correct: true, message: '¡Excelente! Evitaste ejecución remota de código mediante plantillas.' }, { text: '🎨 Cambiar la plantilla visual CSS del sitio', correct: false, message: 'Incapaz de resolver el fallo de seguridad en el motor backend.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-85', description: 'Se descubre manipulación de parámetros de objetos inseguros (BOLA / IDOR) en API financiera.', actions: [ { text: '🔒 Implementar controles estrictos de autorización por objeto en los endpoints de API', correct: true, message: '¡Impecable! Preveniste el acceso no autorizado a datos de otros usuarios.' }, { text: '🌐 Apagar todos los servidores de la empresa', correct: false, message: 'Medida extrema innecesaria que detiene la operación legítima.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-86', description: 'Se detecta un ataque de inyección de cabeceras HTTP (HTTP Response Splitting / Smuggling).', actions: [ { text: '🛡️ Normalizar peticiones HTTP en el proxy inverso y parchear discrepancias de parsing', correct: true, message: '¡Muy bien! Preveniste la contaminación de caché y bypass de seguridad.' }, { text: '🔌 Desconectar el cable de red principal', correct: false, message: 'Ineficaz frente a vulnerabilidades de parsing del protocolo HTTP.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-87', description: 'Se descubre que un atacante modificó binarios legítimos del sistema mediante manipulación de hashes.', actions: [ { text: '🚨 Aislar host, verificar integridad mediante copias firmadas oficiales y restaurar sistema', correct: true, message: '¡Impecable! Restauraste la confianza de los binarios del sistema operativo.' }, { text: '💻 Actualizar el navegador web del usuario', correct: false, message: 'Insuficiente: El sistema operativo base fue alterado en profundidad.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-88', description: 'Se detecta exfiltración sigilosa fragmentada a través de canales laterales ICMP (Ping covert channel).', actions: [ { text: '🛑 Bloquear tráfico ICMP saliente no esencial y aislar el host emisor de paquetes', correct: true, message: '¡Excelente! Cortaste un túnel clandestino de comunicación por ping.' }, { text: '📶 Reiniciar el módem Wi-Fi de la oficina', correct: false, message: 'Ineficaz: El host interno está generando el tráfico anómalo de forma dirigida.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-89', description: 'Se detecta un ataque de inyección de dependencias en el compilador o entorno de compilación (CI/CD).', actions: [ { text: '🚨 Detener pipelines de CI/CD, auditar artefactos compilados y limpiar agentes', correct: true, message: '¡Impecable! Protegiste la cadena de compilación de software de producción.' }, { text: '📢 Enviar un correo motivacional a los desarrolladores', correct: false, message: 'Inadecuado ante un compromiso directo en la infraestructura de despliegue.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-90', description: 'Se detecta un ataque de denegación de servicio avanzado dirigido al protocolo NTP de sincronización horaria.', actions: [ { text: '🛡️ Endurecer servidores NTP con restricciones de consulta y mitigación de amplificación', correct: true, message: '¡Correcto! Restauraste la sincronización horaria segura de la infraestructura.' }, { text: '⏰ Cambiar manualmente la hora en todos los relojes de oficina', correct: false, message: 'Insuficiente para la sincronización crítica de logs y autenticación de servidores.' } ] },
    ]
    incidentsListEn: Incident[] = [
    // ==========================================
    // 🇺🇸 INCIDENTS SOC - ENGLISH (30 BEGINNER)
    // ==========================================
    { level: 'Principiante', alertCode: 'SOC-01', description: 'Email with fake sender "soporte@sec-update.com" requesting credentials.', actions: [ { text: '🛡️ Block and Report Phishing', correct: true, message: 'Excellent decision! Threat successfully neutralized.' }, { text: '⚠️ Ignore and Mark as minor Spam', correct: false, message: 'Watch out! Active spoofing requires formal reporting.' } ] },
    { level: 'Principiante', alertCode: 'SOC-02', description: 'Unknown USB connection plugged into workstation outside working hours.', actions: [ { text: '🚫 Disconnect device and notify SOC', correct: true, message: 'Great job! Prevented potential physical malware loading.' }, { text: '📂 Browse USB content out of curiosity', correct: false, message: 'Danger! Unknown devices can execute automatic payloads.' } ] },
    { level: 'Principiante', alertCode: 'SOC-03', description: 'Employee shares temporary password via instant messaging chat.', actions: [ { text: '🔒 Invalidate key immediately and require password manager reset', correct: true, message: 'Correct! You avoided credential exposure breach.' }, { text: '💬 Let the warning slide as an exceptional case', correct: false, message: 'High risk: Shared passwords compromise overall security.' } ] },
    { level: 'Principiante', alertCode: 'SOC-04', description: 'Fake browser pop-up warning that the computer is infected and demanding a support call.', actions: [ { text: '❌ Close browser and do not call any contact number', correct: true, message: 'Flawless! You avoided falling for technical support fraud.' }, { text: '📞 Call the provided number for immediate help', correct: false, message: 'Error: Scammers will exploit this to steal data or install malware.' } ] },
    { level: 'Principiante', alertCode: 'SOC-05', description: 'PDF document received from an unknown sender with pending macro activation prompts.', actions: [ { text: '🗑️ Delete the file without opening or enabling content', correct: true, message: 'Very well! Unknown macro documents usually hide trojans.' }, { text: '👁️ Open file in editing mode to read it', correct: false, message: 'Danger: Enabling macros in unverified files executes malicious code.' } ] },
    { level: 'Principiante', alertCode: 'SOC-06', description: 'User leaves email session open and unlocked when walking away from desk.', actions: [ { text: '💻 Lock session manually using keyboard shortcuts', correct: true, message: 'Excellent physical security culture!' }, { text: '👀 Leave session open waiting for return', correct: false, message: 'Risk: Anyone can access and impersonate the user.' } ] },
    { level: 'Principiante', alertCode: 'SOC-07', description: 'Shared printer tray contains confidential printed documents with personal data left behind.', actions: [ { text: '📄 Retrieve documents and deliver them to security or owner', correct: true, message: 'Very well! You prevented physical information leakage.' }, { text: '🗑️ Throw papers into common trash without checking', correct: false, message: 'Caution: Paper data must also be protected against snooping.' } ] },
    { level: 'Principiante', alertCode: 'SOC-08', description: 'SMS received from shipping company asking to pay customs fee via short link.', actions: [ { text: '🚫 Delete message without clicking and verify on official website', correct: true, message: 'Correct! This is a typical smishing campaign.' }, { text: '💳 Enter card details to release the package', correct: false, message: 'Danger: You handed banking details to fraudsters.' } ] },
    { level: 'Principiante', alertCode: 'SOC-09', description: 'Employee uses corporate USB drive on public computer in a coffee shop.', actions: [ { text: '⚠️ Report to security team for preventive USB scanning', correct: true, message: 'Excellent! Public computers are frequently infected.' }, { text: '🔌 Plug flash drive directly into office PC', correct: false, message: 'High risk of introducing corporate malware.' } ] },
    { level: 'Principiante', alertCode: 'SOC-10', description: 'Physical access attempt by unbadged person closely following an employee (tailgating).', actions: [ { text: '🛑 Stop person and request official identification', correct: true, message: 'Flawless! You stopped a physical intrusion attempt.' }, { text: '🚪 Hold door politely without verifying', correct: false, message: 'Security failure: You facilitated access for potential attacker.' } ] },
    { level: 'Principiante', alertCode: 'SOC-11', description: 'Mobile app warning indicating an unofficial app has screen overlay permissions.', actions: [ { text: '⚙️ Revoke permissions and uninstall suspicious app', correct: true, message: 'Correct! You prevented credential theft via fake login screens.' }, { text: '📲 Ignore warning and keep using it', correct: false, message: 'Danger: These apps can capture banking passwords.' } ] },
    { level: 'Principiante', alertCode: 'SOC-12', description: 'Internal service password found written on sticky note under keyboard.', actions: [ { text: '🗑️ Destroy sticky note and mandate password manager usage', correct: true, message: 'Very well! You eliminated a critical physical vulnerability.' }, { text: '📝 Stick it in a more hidden monitor spot', correct: false, message: 'Insufficient: Passwords should never be written down physically.' } ] },
    { level: 'Principiante', alertCode: 'SOC-13', description: 'Institutional email announcing holiday bonus with suspicious external link.', actions: [ { text: '🔍 Verify with IT department before interacting', correct: true, message: 'Excellent validation reflex!' }, { text: '🎉 Click quickly to avoid missing bonus', correct: false, message: 'You fell for a seasonal phishing hook.' } ] },
    { level: 'Principiante', alertCode: 'SOC-14', description: 'Connecting to open public Wi-Fi network without VPN to check company email.', actions: [ { text: '🔒 Immediately activate corporate Virtual Private Network', correct: true, message: 'Perfect! You shielded communications against local sniffing.' }, { text: '🌐 Continue browsing unprotected', correct: false, message: 'Risk: Email credentials exposed on open network.' } ] },
    { level: 'Principiante', alertCode: 'SOC-15', description: 'Phone call from someone claiming to be bank asking to validate received OTP code.', actions: [ { text: '📵 Hang up immediately and report fraud', correct: true, message: 'Excellent! No legitimate bank requests OTP codes over phone.' }, { text: '🗣️ Dictate code to fix reported issue', correct: false, message: 'Danger: You authorized unauthorized bank transfer.' } ] },
    { level: 'Principiante', alertCode: 'SOC-16', description: 'Antivirus software showing pending update warning unattended for weeks.', actions: [ { text: '🔄 Run antivirus update immediately', correct: true, message: 'Correct! You kept protection signatures up to date.' }, { text: '💤 Postpone update indefinitely', correct: false, message: 'Risk: Equipment remains vulnerable to new threats.' } ] },
    { level: 'Principiante', alertCode: 'SOC-17', description: 'Confidential corporate printed document found left behind in cafeteria.', actions: [ { text: '📋 Pick up document and turn it in to security area', correct: true, message: 'Very well! You prevented trade secret disclosure.' }, { text: '👀 Read out of curiosity and leave it there', correct: false, message: 'Confidentiality and best practice violation.' } ] },
    { level: 'Principiante', alertCode: 'SOC-18', description: 'Downloaded internet file has double extension (e.g. .pdf.exe).', actions: [ { text: '🚫 Stop execution and delete file immediately', correct: true, message: 'Great! You identified classic malware camouflage technique.' }, { text: '📂 Open file trusting it is a document', correct: false, message: 'Danger: You executed malicious executable disguised as PDF.' } ] },
    { level: 'Principiante', alertCode: 'SOC-19', description: 'Friend request on professional social network from profile with no photo or clear history.', actions: [ { text: '❌ Reject request due to fake profile suspicion', correct: true, message: 'Very well! You protected contact network against espionage.' }, { text: 'accept Accept to expand contact network', correct: false, message: 'Risk: Exposing corporate posts to malicious actors.' } ] },
    { level: 'Principiante', alertCode: 'SOC-20', description: 'Security alert indicating current password is weak and reused.', actions: [ { text: '🔑 Change password to strong and unique one immediately', correct: true, message: 'Flawless! You strengthened your account security posture.' }, { text: '⏰ Ignore notification until next week', correct: false, message: 'Unauthorized access risk via brute force.' } ] },
    { level: 'Principiante', alertCode: 'SOC-21', description: 'Suspicious USB connector plugged into wall socket in meeting room.', actions: [ { text: '🔌 Unplug apparatus and report to maintenance or IT', correct: true, message: 'Excellent! Might be espionage or malicious charging device.' }, { text: '📱 Plug mobile phone in to charge', correct: false, message: 'Data theft or infection danger (juice jacking).' } ] },
    { level: 'Principiante', alertCode: 'SOC-22', description: 'User reports screen flickering and opening browser tabs on its own.', actions: [ { text: 'disconnect Disconnect network and notify SOC of possible remote control', correct: true, message: 'Correct! Acted upon clear active intrusion symptoms.' }, { text: '☕ Keep working ignoring flicker', correct: false, message: 'Danger: Attacker might be operating machine live.' } ] },
    { level: 'Principiante', alertCode: 'SOC-23', description: 'Email received with severe spelling mistakes and blurry official logos.', actions: [ { text: '🛡️ Mark as junk mail and report phishing', correct: true, message: 'Very well! Recognized classic visual scam indicators.' }, { text: '🔗 Click link just in case it is important', correct: false, message: 'Credential compromise risk.' } ] },
    { level: 'Principiante', alertCode: 'SOC-24', description: 'Coworker asks to borrow your work laptop to check their social media.', actions: [ { text: '⛔ Kindly refuse explaining company security policies', correct: true, message: 'Excellent! Corporate devices are strictly personal use.' }, { text: '🤝 Lend device unsupervised', correct: false, message: 'Access control and asset custody violation.' } ] },
    { level: 'Principiante', alertCode: 'SOC-25', description: 'Unknown software update pop-up appears when starting PC.', actions: [ { text: '❌ Cancel pop-up and verify with internal IT support', correct: true, message: 'Correct! Prevented unauthorized software installation.' }, { text: '📥 Install to make pop-up go away', correct: false, message: 'Risk of installing unwanted adware or malware.' } ] },
    { level: 'Principiante', alertCode: 'SOC-26', description: 'Email arrives with boss display name requesting unusual money transfers.', actions: [ { text: '📞 Call boss directly via phone to confirm order', correct: true, message: 'Flawless! Successful out-of-band cross verification.' }, { text: '💸 Execute requested transfer immediately', correct: false, message: 'Fell for executive impersonation fraud (basic BEC).' } ] },
    { level: 'Principiante', alertCode: 'SOC-27', description: 'Unknown Bluetooth device requests constant pairing with your phone.', actions: [ { text: '🚫 Reject pairing and turn off Bluetooth temporarily', correct: true, message: 'Very well! Avoided proximity attacks (Bluejacking).' }, { text: '✅ Accept to see what device it is', correct: false, message: 'Unwanted malicious file transfer risk.' } ] },
    { level: 'Principiante', alertCode: 'SOC-28', description: 'Office building access badge or ID card is lost.', actions: [ { text: '📢 Immediately notify physical security to block access', correct: true, message: 'Excellent! Prevented unauthorized entry.' }, { text: '🤫 Keep quiet hoping to find it tomorrow', correct: false, message: 'High risk of physical intrusion with active credential.' } ] },
    { level: 'Principiante', alertCode: 'SOC-29', description: 'Browser warns internal website SSL certificate has expired.', actions: [ { text: '⚠️ Stop browsing and report to system administrator', correct: true, message: 'Correct! Avoided potential man-in-the-middle attacks.' }, { text: '⏭️ Bypass warning and continue anyway', correct: false, message: 'Danger: Exposed to unencrypted communications or spoofing.' } ] },
    { level: 'Principiante', alertCode: 'SOC-30', description: 'Attractive survey email promising free smartphone in exchange for data.', actions: [ { text: '🗑️ Delete email without opening links', correct: true, message: 'Very well! Identified typical social engineering campaign.' }, { text: '📝 Fill form with personal details', correct: false, message: 'You handed personal info to scammers.' } ] },

    // ==========================================
    // 🟡 INCIDENTS SOC - ENGLISH (30 INTERMEDIATE)
    // ==========================================
    { level: 'Intermedio', alertCode: 'SOC-31', description: 'Multiple failed login attempt from an unknown overseas IP address.', actions: [ { text: '🔒 Force password change and temporary block', correct: true, message: 'Correct! You stopped a brute force attack in time.' }, { text: '📁 Let it pass, they probably forgot their key', correct: false, message: 'Danger! Ignoring strange accesses exposes the account to intruders.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-32', description: 'Unusual outbound database traffic toward an unknown external server.', actions: [ { text: '🛑 Suspend outbound connection and audit SQL queries', correct: true, message: 'Excellent! Contained potential data exfiltration.' }, { text: '🔄 Restart DB server without checking logs', correct: false, message: 'Error: Origin of the leak was not identified.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-33', description: 'Massive port scanning detected from internal development network segment.', actions: [ { text: '🔍 Isolate scanning host and investigate code or malware', correct: true, message: 'Flawless! Contained internal reconnaissance.' }, { text: '📊 Ignore traffic as it is testing hours', correct: false, message: 'Risk: Might be already compromised machine.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-34', description: 'Corporate SSL/TLS certificate nearing expiration on public customer portal.', actions: [ { text: '🔄 Renew and install certificate before deadline', correct: true, message: 'Very well! Prevented service downtime and browser warnings.' }, { text: '⏳ Wait until expiration to see impact', correct: false, message: 'Critical error: Customers will lose trust and secure access.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-35', description: 'SQL Injection (SQLi) attempt reflected in main web server logs.', actions: [ { text: '🛡️ Block attacking IP and review input validation in app', correct: true, message: 'Excellent mitigation response!' }, { text: '🗑️ Delete log files to free up space', correct: false, message: 'Error: Destroyed crucial forensic evidence.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-36', description: 'EDR alert: PowerShell process executing base64 encoded commands suspiciously.', actions: [ { text: '🛑 Terminate process and isolate affected endpoint', correct: true, message: 'Very well! Stopped malicious obfuscated script execution.' }, { text: '👀 Let command run to see what it tries to do', correct: false, message: 'Danger: Might compromise entire domain.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-37', description: 'Amazon S3 cloud storage bucket discovered with public read/write permissions.', actions: [ { text: '🔒 Immediately restrict permissions and audit recent accesses', correct: true, message: 'Correct! Prevented massive data exposure.' }, { text: '🌐 Leave public to ease collaboration', correct: false, message: 'Critical data leakage risk.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-38', description: 'Brute force attack attempt against internet-exposed SSH service.', actions: [ { text: '🛡️ Implement Fail2ban blocking and change default port', correct: true, message: 'Excellent! Mitigated automated login attempts.' }, { text: '🚪 Turn off SSH server permanently', correct: false, message: 'Unnecessary: Service is required, just needs hardening.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-39', description: 'Production API key accidentally published in recent GitHub commit.', actions: [ { text: '🔑 Revoke API key immediately, rotate credentials, and clean history', correct: true, message: 'Flawless! Prevented malicious cloud service usage.' }, { text: '📝 Edit file in repository hiding line', correct: false, message: 'Insufficient: Git history retains leaked key.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-40', description: 'Logs show multiple massive HTTP GET requests attempting to exhaust cache memory.', actions: [ { text: '⚡ Activate rate limiting rules in WAF', correct: true, message: 'Very well! Stopped application-level DoS attempt.' }, { text: '🔌 Disconnect web server from internet', correct: false, message: 'Unnecessary extreme measure affecting legitimate availability.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-41', description: 'Unauthorized change detected in corporate domain MX DNS records.', actions: [ { text: '🛡️ Revert DNS records at registrar and review access credentials', correct: true, message: 'Correct! Prevented email interception.' }, { text: '📞 Call internet provider to complain', correct: false, message: 'Error: Issue usually stems from compromised DNS panel credentials.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-42', description: 'Standard privilege user runs network auditing tools (Nmap, Wireshark) on PC.', actions: [ { text: '🔍 Investigate motive and temporarily confiscate tool if unauthorized', correct: true, message: 'Very well! Controlled unauthorized internal reconnaissance.' }, { text: '👍 Congratulate user on interest in security', correct: false, message: 'Risk: Unauthorized hacking tool usage violates policies.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-43', description: 'Unusual spike in large file downloads from database to external IP.', actions: [ { text: '🛑 Block external IP and isolate database server temporarily', correct: true, message: 'Excellent! Contained potential data exfiltration.' }, { text: '☕ Wait for transfer to finish to see what was downloaded', correct: false, message: 'Critical error: Allowed information to leak completely.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-44', description: 'Recently added third-party NPM library found to have known critical CVE.', actions: [ { text: '📦 Update library to patched version immediately', correct: true, message: 'Flawless! Mitigated supply chain risk.' }, { text: '🗑️ Delete entire app and rewrite from scratch', correct: false, message: 'Disproportionate: Only dependency update required.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-45', description: 'SOC Alert: Successful login from geographically impossible location within 10 minutes (impossible travel).', actions: [ { text: '🔒 Revoke active user sessions and require password change', correct: true, message: 'Correct! Prevented account takeover.' }, { text: '✈️ Assume user flew on private jet', correct: false, message: 'Danger: Ignored clear Indicator of Compromise (IoC).' } ] },
    { level: 'Intermedio', alertCode: 'SOC-46', description: 'HTTP requests with payloads targeting Path Traversal vulnerabilities detected.', actions: [ { text: '🛡️ Block origin in WAF and audit web server logs', correct: true, message: 'Very well! Blocked protected file reading attempt.' }, { text: '📂 Move all server files to different folder', correct: false, message: 'Ineffective: Does not fix attack vector or block aggressor.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-47', description: 'Automated backup script throws constant errors due to database access denied.', actions: [ { text: '🛠️ Review permissions of backup service account', correct: true, message: 'Correct! Restored backup integrity.' }, { text: '🗑️ Disable backups so alerts stop firing', correct: false, message: 'High risk: Left without functional backups.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-48', description: 'Test database server discovered exposed to internet without robust password.', actions: [ { text: '🔒 Block external access via firewall and secure credentials', correct: true, message: 'Excellent! Eliminated critical entry door.' }, { text: '📢 Post warning in general chat', correct: false, message: 'Insufficient: Server remains exposed during discussion.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-49', description: 'Slow HTTP Denial of Service attack (Slowloris) saturating connections.', actions: [ { text: '⚡ Adjust timeouts on web server and reverse proxy', correct: true, message: 'Very well! Mitigated connection thread exhaustion.' }, { text: '🔄 Restart operator computer', correct: false, message: 'Ineffective: Attack comes from multiple distributed IPs.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-50', description: 'Employee found to have disabled antivirus software on work machine.', actions: [ { text: '💻 Force remote antivirus reactivation and open disciplinary incident', correct: true, message: 'Flawless! Maintained endpoint compliance.' }, { text: '🤷‍♂️ Leave it if employee promises not to do it again', correct: false, message: 'Risk: Machine left totally unprotected against malware.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-51', description: 'Open Redirect vulnerability detected in corporate web URL parameters.', actions: [ { text: '🛠️ Modify code to validate and restrict redirect destinations', correct: true, message: 'Correct! Prevented web from being used for external phishing.' }, { text: '🌐 Change primary company domain', correct: false, message: 'Disproportionate: Issue lies in parameter validation.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-52', description: 'Massive password reset requests targeting customer accounts.', actions: [ { text: '🛡️ Implement CAPTCHA and rate limit requests per IP', correct: true, message: 'Very well! Stopped harassment and possible user enumeration.' }, { text: '🚫 Disable password recovery option for everyone', correct: false, message: 'Drastic measure harming legitimate customer experience.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-53', description: 'Unknown self-signed SSL certificate discovered installed on internal network proxy.', actions: [ { text: '🔍 Investigate certificate origin and isolate proxy if anomalous', correct: true, message: 'Excellent! Might be internal man-in-the-middle attack.' }, { text: '✅ Accept certificate in all corporate browsers', correct: false, message: 'Severe danger: Authorized unverified traffic interception.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-54', description: 'Hidden automatic forwarding rule discovered in compromised corporate mailbox.', actions: [ { text: '🗑️ Delete forwarding rule, change password, and review access logs', correct: true, message: 'Correct! Stopped silent email exfiltration.' }, { text: '👀 Leave rule active to see who receives emails', correct: false, message: 'Risk: Sensitive communications continue leaking.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-55', description: 'Anomalous encrypted traffic heading out to non-standard ports (e.g. port 4444).', actions: [ { text: '🛑 Isolate machine and analyze if it corresponds to C2 session', correct: true, message: 'Flawless! Detected signs of active backdoor.' }, { text: '🌐 Open port in perimeter firewall to allow traffic', correct: false, message: 'Extreme danger: Facilitated trojan communication.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-56', description: 'Cross-Site Request Forgery (CSRF) attack attempt against admin panel.', actions: [ { text: '🛡️ Verify implementation of anti-CSRF tokens in critical forms', correct: true, message: 'Very well! Secured user request integrity.' }, { text: '🚪 Close all current user sessions', correct: false, message: 'Temporary measure not fixing code vulnerability.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-57', description: 'Automation script found using plaintext credentials hardcoded inside source.', actions: [ { text: '🔐 Migrate credentials to secret manager or environment variables', correct: true, message: 'Correct! Eliminated secret exposure in source code.' }, { text: '📝 Encrypt script with weak password', correct: false, message: 'Insufficient: Hardcoded credentials remain vulnerable.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-58', description: 'Sudden CPU spike to 100% on web servers with no high legitimate traffic.', actions: [ { text: '🔍 Inspect active processes for crypto miners or malware', correct: true, message: 'Excellent! Identified unauthorized resource usage.' }, { text: '🧰 Buy more physical servers immediately', correct: false, message: 'Error: Problem is logical/malicious, not hardware capacity.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-59', description: 'Typosquatting domain recently registered imitating company domain.', actions: [ { text: '⚖️ Initiate brand protection legal action and warn users', correct: true, message: 'Very well! Anticipated targeted phishing campaigns.' }, { text: '😴 Ignore until they start scamming customers', correct: false, message: 'Risk: Allowing attacker to act damages corporate reputation.' } ] },
    { level: 'Intermedio', alertCode: 'SOC-60', description: 'Critical server audit logs found deleted or stopped.', actions: [ { text: '🚨 Declare critical incident, isolate server, and dump forensic evidence', correct: true, message: 'Flawless! Attackers often delete logs to hide tracks.' }, { text: '🔄 Restart log service and continue normal operation', correct: false, message: 'Severe danger: Ignored clear post-exploitation compromise indicator.' } ] },

    // ==========================================
    // 🔴 INCIDENTS SOC - ENGLISH (30 ADVANCED)
    // ==========================================
    { level: 'Avanzado', alertCode: 'SOC-61', description: 'Unknown executable file downloaded running anomalous system registry calls.', actions: [ { text: '🛑 Isolate network host and dump RAM memory', correct: true, message: '🔥 Very well! You contained an advanced persistent threat (APT) malware.' }, { text: '⚠️ Only delete the executable file from Temp folder', correct: false, message: '⚠️ Insufficient! The injected process keeps running in memory.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-62', description: 'Unauthorized modification detected in perimeter firewall iptables rules.', actions: [ { text: '🛡️ Revert rules from secure backup and isolate managing IP', correct: true, message: 'Flawless! Neutralized a network persistence breach.' }, { text: '✍️ Manually edit live rules without backup', correct: false, message: 'High risk: Could leave internal segment exposed.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-63', description: 'Malicious DLL injection detected inside legitimate system process (explorer.exe).', actions: [ { text: '🛑 Suspend host process, isolate machine, and extract memory dump', correct: true, message: 'Excellent! Stopped advanced EDR evasion technique.' }, { text: '🔄 Restart computer to clear RAM', correct: false, message: 'Insufficient: Valuable volatile forensic evidence lost.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-64', description: 'Kerberoasting activity requesting mass TGS tickets in Active Directory.', actions: [ { text: '🔒 Force immediate service account password rotation and audit permissions', correct: true, message: 'Flawless! Halted offline service hash extraction.' }, { text: '🚪 Turn off main domain controller', correct: false, message: 'Catastrophic measure disrupting all network authentication.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-65', description: 'Insecure Deserialization attack exploiting exposed Java RMI endpoint.', actions: [ { text: '🛑 Isolate affected server, patch vulnerable library, and analyze persistence', correct: true, message: 'Very well! Contained critical remote code execution (RCE).' }, { text: '🌐 Change operating system admin password', correct: false, message: 'Insufficient: RCE allows full control without passwords.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-66', description: 'Exfiltration alert via covert DNS tunnel heading to external attacker domain.', actions: [ { text: '🛑 Block unauthorized outgoing DNS traffic and isolate emitting host', correct: true, message: 'Excellent! Cut clandestine data outflow channel.' }, { text: '🌐 Change office internet provider', correct: false, message: 'Ineffective: Issue resides in infected internal host.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-67', description: 'LSASS memory credential dump detected via Mimikatz-style dumping tools.', actions: [ { text: '🚨 Isolate host, assume total domain credential compromise, and force mass reset', correct: true, message: 'Flawless! Contained hash theft across entire environment.' }, { text: '💻 Only log out current user session', correct: false, message: 'Insufficient: In-memory credentials already stolen.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-68', description: 'Successful Pass-the-Hash attack authenticating across multiple internal servers.', actions: [ { text: '🛡️ Isolate affected systems, revoke Kerberos tickets, and apply isolation patches', correct: true, message: 'Very well! Stopped attacker lateral movement in network.' }, { text: '🔄 Change all network standard user passwords', correct: false, message: 'Incomplete: Attack uses service/admin account hashes.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-69', description: 'Malicious hidden scheduled task detected running encoded commands hourly.', actions: [ { text: '🔍 Remove persistent task, audit Run registry keys, and isolate host', correct: true, message: 'Correct! Neutralized advanced persistence mechanism.' }, { text: '⏰ Change system time so it doesn’t run on time', correct: false, message: 'Danger: False solution not removing malware.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-70', description: 'SSRF attack allowing attacker to query internal AWS metadata (IMDSv1).', actions: [ { text: '🛡️ Migrate to mandatory IMDSv2 and block metadata routes in app', correct: true, message: 'Excellent! Prevented cloud instance IAM role theft.' }, { text: '🌐 Turn off entire AWS console', correct: false, message: 'Disproportionate: Flaw lies in SSRF-vulnerable app.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-71', description: 'Kernel-level Rootkit activity hiding malicious processes in Linux.', actions: [ { text: '🚨 Physically power down server, boot external forensic media, and rebuild from scratch', correct: true, message: 'Flawless! Kernel rootkit invalidates OS trust.' }, { text: '💻 Kill hidden process using kill command', correct: false, message: 'Useless: Compromised kernel will keep hiding and executing code.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-72', description: 'BGP Hijacking attack altering international traffic routes toward corporate services.', actions: [ { text: '📞 Urgently coordinate with ISP and AS administrators to correct announcements', correct: true, message: 'Very well! Restored legitimate global routing paths.' }, { text: '🔄 Restart main office router', correct: false, message: 'Ineffective: Hijacking occurs at global internet operator level.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-73', description: 'OS Command Injection detected in advanced admin interface.', actions: [ { text: '🛑 Isolate host, patch validation vulnerability, and review execution logs', correct: true, message: 'Correct! Stopped direct command execution on server.' }, { text: '🎨 Change graphical interface design', correct: false, message: 'Absurd: Problem is logical security in backend.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-74', description: 'UEFI/BIOS firmware compromise attempt on key workstations.', actions: [ { text: '🛠️ Physically flash SPI chip or replace motherboard and verify Secure Boot', correct: true, message: 'Flawless! Contained hardware firmware-level persistence.' }, { text: '🗑️ Format main hard drive', correct: false, message: 'Insufficient: UEFI malware survives hard drive formatting.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-75', description: 'LDAP injection attack allowing authentication bypass in corporate directory.', actions: [ { text: '🛡️ Sanitize LDAP query inputs and apply strict filters in code', correct: true, message: 'Very well! Restored directory authentication integrity.' }, { text: '🚪 Shut down Active Directory directory service', correct: false, message: 'Catastrophic: Would disrupt entire company operation.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-76', description: 'Container Escape attack allowing breakout from Docker container to host.', actions: [ { text: '🚨 Isolate underlying physical host, patch container engine, and revoke privileges', correct: true, message: 'Excellent! Contained container isolation breakout.' }, { text: '🔄 Restart affected Docker container', correct: false, message: 'Insufficient: Underlying host already breached.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-77', description: 'ARP Cache Poisoning (ARP Spoofing) attack on local office network.', actions: [ { text: '🛡️ Enable port security / Dynamic ARP Inspection mitigations on switches', correct: true, message: 'Flawless! Stopped layer 2 local traffic interception.' }, { text: '📶 Change guest Wi-Fi password', correct: false, message: 'Ineffective: Attack happens via local ARP table manipulation.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-78', description: 'Domain Generation Algorithms (DGA) activity detected in mass DNS queries.', actions: [ { text: '🛑 Isolate emitting host, block generated domains, and analyze malware sample', correct: true, message: 'Very well! Identified botnet trying to reach C2.' }, { text: '🌐 Change public DNS to Google (8.8.8.8)', correct: false, message: 'Insufficient: Internal host remains infected generating queries.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-79', description: 'Buffer Overflow exploit attack on exposed daemon service.', actions: [ { text: '🛑 Isolate affected service, apply vendor patch, and review core dumps', correct: true, message: 'Correct! Contained classic remote execution vector.' }, { text: '💻 Restart service automatically every 5 minutes', correct: false, message: 'Danger: Service remains vulnerable to exploitation.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-80', description: 'Steganographic mass exfiltration hidden inside user-uploaded PNG images.', actions: [ { text: '🔍 Seize image samples, block infringing account, and audit upload algorithm', correct: true, message: 'Flawless! Discovered advanced data hiding technique.' }, { text: '🖼️ Delete all user profile pictures', correct: false, message: 'Disproportionate: Must analyze specific steganographic vector.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-81', description: 'XML External Entity (XXE) injection attack reading server /etc/passwd files.', actions: [ { text: '🛡️ Disable external entities (DTD) in app XML parser', correct: true, message: 'Very well! Blocked internal file reading via XML.' }, { text: '📂 Move /etc/passwd file to another folder', correct: false, message: 'Absurd: Operating system requires that file to function.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-82', description: 'Golden Ticket activity allowing total persistence in Active Directory domain.', actions: [ { text: '🚨 Invalidate KRBTGT service account twice consecutively and force global reset', correct: true, message: 'Flawless! Invalidated domain master key forcing attacker expulsion.' }, { text: '💻 Restart domain DNS server', correct: false, message: 'Insufficient: Golden Ticket relies on compromised KRBTGT key.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-83', description: 'Session hijacking via traffic analysis and encrypted auth cookie theft.', actions: [ { text: '🔒 Invalidate session tokens on server, force re-authentication, and require robust 2FA', correct: true, message: 'Correct! Halted active identity impersonation.' }, { text: '🍪 Ask users to clear cookies manually', correct: false, message: 'Slow and ineffective against ongoing coordinated attack.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-84', description: 'Server-Side Template Injection (SSTI) attack.', actions: [ { text: '🛡️ Fix template engine rendering logic and isolate environment', correct: true, message: 'Excellent! Prevented remote code execution via templates.' }, { text: '🎨 Change site visual CSS template', correct: false, message: 'Incabel of solving security flaw in backend engine.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-85', description: 'Insecure Object Reference (BOLA / IDOR) manipulation in financial API.', actions: [ { text: '🔒 Implement strict object authorization controls in API endpoints', correct: true, message: 'Flawless! Prevented unauthorized access to other user data.' }, { text: '🌐 Shut down all company servers', correct: false, message: 'Unnecessary extreme measure halting legitimate operation.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-86', description: 'HTTP Response Splitting / Smuggling header injection attack.', actions: [ { text: '🛡️ Normalize HTTP requests in reverse proxy and patch parsing discrepancies', correct: true, message: 'Very well! Prevented cache contamination and security bypass.' }, { text: '🔌 Disconnect main network cable', correct: false, message: 'Ineffective against HTTP protocol parsing vulnerabilities.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-87', description: 'Attacker found to have modified legitimate system binaries via hash manipulation.', actions: [ { text: '🚨 Isolate host, verify integrity using official signed copies, and restore system', correct: true, message: 'Flawless! Restored trust in operating system binaries.' }, { text: '💻 Update user web browser', correct: false, message: 'Insufficient: Base operating system was deeply altered.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-88', description: 'Stealth fragmented exfiltration through ICMP covert channels (Ping covert channel).', actions: [ { text: '🛑 Block non-essential outgoing ICMP traffic and isolate emitting host', correct: true, message: 'Excellent! Cut clandestine ping communication tunnel.' }, { text: '📶 Restart office Wi-Fi modem', correct: false, message: 'Ineffective: Internal host is generating targeted anomalous traffic.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-89', description: 'Dependency injection attack in compiler or CI/CD build environment.', actions: [ { text: '🚨 Halt CI/CD pipelines, audit compiled artifacts, and clean agents', correct: true, message: 'Flawless! Protected production software build chain.' }, { text: '📢 Send motivational email to developers', correct: false, message: 'Inadequate against direct compromise in deployment infrastructure.' } ] },
    { level: 'Avanzado', alertCode: 'SOC-90', description: 'Advanced denial of service attack targeting time synchronization NTP protocol.', actions: [ { text: '🛡️ Harden NTP servers with query restrictions and amplification mitigation', correct: true, message: 'Correct! Restored secure infrastructure time synchronization.' }, { text: '⏰ Manually change time on all office clocks', correct: false, message: 'Insufficient for critical log synchronization and server auth.' } ] }
  ];

  currentChallenge!: Challenge;
  challengeAnswered = false;
  isCorrect = false;
  feedbackMessage = '';

  currentIncident!: Incident;
  incidentReported = false;
  incidentCorrect = false;
  incidentFeedbackMsg = '';
  currentTip = '';

  constructor(private translate: TranslateService, private router: Router, private lang: LanguageService, private navCtrl: NavController) {

    this.translate.setTranslation('es', {
      'DAYS_LABEL': 'días',
      'LEVEL_LABEL': 'Nivel',
      'CONTROL_PANEL': 'Panel de Control',
      'WELCOME_TITLE': '¡Hola, {{name}}!',
      'WELCOME_DESC': 'Tu escudo protector está activo. Listo para una nueva sesión de análisis táctico.',
      'TACTICAL_DIFFICULTY': 'Nivel de Dificultad Táctico',
      'DIFF_PRINCIPIANTE': 'Principiante',
      'DIFF_INTERMEDIO': 'Intermedio',
      'DIFF_AVANZADO': 'Avanzado',
      'TACTICAL_TIP_TITLE': 'Consejo Táctico de Ciberseguridad',
      'NEXT_TIP_BTN': 'Ver otro consejo ➔',
      'DAILY_MISSIONS_TITLE': 'Misiones Diarias',
      'COMPLETED_SUFFIX': 'completadas',
      'MISSION_1': 'Completar 1 Reto Flash',
      'MISSION_2': 'Resolver 1 Incidente en el Simulador',
      'MISSION_3': 'Revisar un módulo de aprendizaje',
      'CYCLE_PROGRESS_TITLE': 'Progreso del Ciclo',
      'CYCLE_PROGRESS_DESC': '3 de 5 módulos de ciberseguridad completados.',
      'STUDY_MISSION_TITLE': 'Misión de Estudio',
      'IN_PROGRESS_PILL': 'En curso',
      'STUDY_MISSION_DESC': 'Tu racha de estudio se mantiene firme. Continúa resolviendo casos prácticos.',
      'CONTINUE_LEARNING_BTN': 'Continuar Aprendiendo',
      'FLASH_CHALLENGE_TITLE': 'Reto Flash Diario',
      'NEXT_CHALLENGE_BTN': 'Siguiente reto ➔',
      'SOC_SIMULATOR_TITLE': 'Simulador SOC',
      'ACTIVE_PRACTICE_BADGE': 'Práctica Activa',
      'SOC_SIMULATOR_DESC': 'Analiza la siguiente alerta del sistema y decide el protocolo de defensa:',
      'ANALYZE_OTHER_ALERT_BTN': 'Analizar otra alerta ➔',
      'EARNED_BADGES_TITLE': 'Insignias Obtenidas',
      'BADGE_PHISHING_TITLE': 'Analista Phishing',
      'BADGE_PHISHING_DESC': 'Casos superados',
      'BADGE_STREAK_TITLE': 'Racha',
      'BADGE_STREAK_DESC': 'días seguidos',
      'SHORTCUTS_TITLE': 'Accesos Directos',
      'MENU_MODULES_TITLE': 'Módulos',
      'MENU_MODULES_DESC': 'Lecciones interactivas.',
      'MENU_GAMES_TITLE': 'Zona Retos',
      'MENU_GAMES_DESC': 'Pon a prueba tu lógica.'
    }, true);

    this.translate.setTranslation('en', {
      'DAYS_LABEL': 'days',
      'LEVEL_LABEL': 'Level',
      'CONTROL_PANEL': 'Control Panel',
      'WELCOME_TITLE': 'Hello, {{name}}!',
      'WELCOME_DESC': 'Your protective shield is active. Ready for a new tactical analysis session.',
      'TACTICAL_DIFFICULTY': 'Tactical Difficulty Level',
      'DIFF_PRINCIPIANTE': 'Beginner',
      'DIFF_INTERMEDIO': 'Intermediate',
      'DIFF_AVANZADO': 'Advanced',
      'TACTICAL_TIP_TITLE': 'Cybersecurity Tactical Tip',
      'NEXT_TIP_BTN': 'View another tip ➔',
      'DAILY_MISSIONS_TITLE': 'Daily Missions',
      'COMPLETED_SUFFIX': 'completed',
      'MISSION_1': 'Complete 1 Flash Challenge',
      'MISSION_2': 'Solve 1 Incident in the Simulator',
      'MISSION_3': 'Review a learning module',
      'CYCLE_PROGRESS_TITLE': 'Cycle Progress',
      'CYCLE_PROGRESS_DESC': '3 of 5 cybersecurity modules completed.',
      'STUDY_MISSION_TITLE': 'Study Mission',
      'IN_PROGRESS_PILL': 'In progress',
      'STUDY_MISSION_DESC': 'Your study streak remains strong. Continue solving practical cases.',
      'CONTINUE_LEARNING_BTN': 'Continue Learning',
      'FLASH_CHALLENGE_TITLE': 'Daily Flash Challenge',
      'NEXT_CHALLENGE_BTN': 'Next challenge ➔',
      'SOC_SIMULATOR_TITLE': 'SOC Simulator',
      'ACTIVE_PRACTICE_BADGE': 'Active Practice',
      'SOC_SIMULATOR_DESC': 'Analyze the following system alert and decide the defense protocol:',
      'ANALYZE_OTHER_ALERT_BTN': 'Analyze another alert ➔',
      'EARNED_BADGES_TITLE': 'Earned Badges',
      'BADGE_PHISHING_TITLE': 'Phishing Analyst',
      'BADGE_PHISHING_DESC': 'Cases passed',
      'BADGE_STREAK_TITLE': 'Streak',
      'BADGE_STREAK_DESC': 'consecutive days',
      'SHORTCUTS_TITLE': 'Shortcuts',
      'MENU_MODULES_TITLE': 'Modules',
      'MENU_MODULES_DESC': 'Interactive lessons.',
      'MENU_GAMES_TITLE': 'Challenges Zone',
      'MENU_GAMES_DESC': 'Test your logic.'
    }, true);

    this.translate.use('es');
  }

  onLanguageChanged() {
    this.loadNextTip();
    this.loadRandomChallenge();
    this.loadRandomIncident();
    this.speakWelcome();
  }

  ngOnInit() {
    // Escuchar cambios de idioma
    this.lang.changes$
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onLanguageChanged());

    // Cargar datos del usuario
    this.loadUserData();

    // Cargar contenido de la vista
    this.loadNextTip();
    this.loadRandomChallenge();
    this.loadRandomIncident();
    
    // 🎯 CARGAR LAS MISIONES DIARIAS AQUÍ
    this.loadDailyMissions();

    // Bienvenida por voz
    this.speakWelcome();

    this.loadUserStreak();
    this.loadCycleProgress();
  }

  private loadUserData(): void {
    // Buscar en 'userNickname' primero, si no existe revisar en 'user_session'
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      this.userNickname = savedNickname;
      return;
    }

    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data?.nickname) {
          this.userNickname = data.nickname;
        }
      } catch (e) {
        console.error('Error al parsear la sesión del usuario', e);
      }
    }
  }

  ngOnDestroy() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  loadDailyMissions(): void {
    const lastDate = localStorage.getItem('last_mission_date');
    const today = new Date().toDateString();

    // Si es el mismo día, recuperamos las misiones como estaban guardadas
    if (lastDate === today) {
      const savedState = localStorage.getItem('daily_missions_state');
      if (savedState) {
        try {
          this.dailyMissions = JSON.parse(savedState);
        } catch (e) {
          console.error('Error al cargar el estado de las misiones', e);
        }
      }
    } else {
      // Si es un día nuevo, las reiniciamos todas a false
      this.dailyMissions.forEach(m => m.completed = false);
      this.saveMissionsState();
    }
  }

  openLearningModule(path: string): void {
    // 🎯 Misión 3 = "Revisar un módulo de aprendizaje"
    this.completeMission(3);

    // Navegar de forma limpia a los módulos
    this.router.navigate([path]);
  }

  // Método centralizado para completar cualquier misión diaria
  completeMission(missionId: number): void {
    const mission = this.dailyMissions.find(m => m.id === missionId);
    
    // Si la misión existe y no estaba completada todavía
    if (mission && !mission.completed) {
      mission.completed = true;

      // Sumar la recompensa de XP
      const numericXp = parseInt(mission.reward.replace(/[^0-9]/g, ''), 10) || 0;
      this.userXp += numericXp;

      // ⚠️ GUARDAR EL ESTADO INMEDIATAMENTE
      this.saveMissionsState();
    }
  }

  // Guardar misiones y XP en el almacenamiento local
  saveMissionsState(): void {
    const today = new Date().toDateString();
    localStorage.setItem('last_mission_date', today);
    localStorage.setItem('daily_missions_state', JSON.stringify(this.dailyMissions));
    localStorage.setItem('user_xp', this.userXp.toString());
  }

  // Misma navegación que usa la barra inferior, para que accesos directos y pestañas se comporten igual
  navigateTo(route: string) {
    this.navCtrl.navigateRoot(route);
  }

  speakWelcome() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 

      const isEn = this.currentLanguage === 'en';
      const textToSpeak = isEn 
        ? `Welcome to A Hui Hou Cyber, ${this.userNickname}` 
        : `Bienvenido a A Hui Hou Cyber, ${this.userNickname}`;
        
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isEn ? 'en-US' : 'es-ES';
      
      if (isEn) {
        utterance.rate = 1.0;
        utterance.pitch = 1.25;
      } else {
        utterance.rate = 0.95;
        utterance.pitch = 1.3; 
      }

      const executeSpeech = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          if (isEn) {
            this.setEnglishFemaleVoice(utterance, voices);
          } else {
            this.setSweetSpanishVoice(utterance, voices);
          }
        }
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        executeSpeech();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          executeSpeech();
        };
      }
    }
  }

  private setEnglishFemaleVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) {
    const langVoices = voices.filter(v => v.lang.toLowerCase().includes('en'));
    if (langVoices.length === 0) return;

    let selectedVoice: SpeechSynthesisVoice | undefined = undefined;
    const preferredEnglishFemale = ['zira', 'aria', 'jenny', 'samantha', 'victoria', 'hazel', 'catherine', 'karen', 'moira', 'fiona', 'susan', 'helen'];
    
    for (const keyword of preferredEnglishFemale) {
      selectedVoice = langVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (selectedVoice) break;
    }

    if (!selectedVoice) {
      const maleKeywords = ['male', 'david', 'george', 'mark', 'james', 'richard'];
      const safeVoices = langVoices.filter(v => !maleKeywords.some(mk => v.name.toLowerCase().includes(mk)));
      if (safeVoices.length > 0) selectedVoice = safeVoices[0];
    }

    if (!selectedVoice) selectedVoice = langVoices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  private setSweetSpanishVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) {
    const langVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
    if (langVoices.length === 0) return;

    let selectedVoice: SpeechSynthesisVoice | undefined = undefined;
    const sweetKeywords = ['lucia', 'sofia', 'catalina', 'valeria', 'laura', 'sara', 'paula', 'carmen', 'sabina', 'esmeralda', 'paulina', 'zuria', 'elena', 'monica', 'helena'];
    
    for (const keyword of sweetKeywords) {
      selectedVoice = langVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (selectedVoice) break;
    }

    if (!selectedVoice) {
      const maleKeywords = ['pablo', 'jorge', 'carlos', 'raul', 'alberto', 'diego', 'alvaro', 'mateo', 'tomas', 'david', 'jose', 'juan'];
      const safeVoices = langVoices.filter(v => {
        const name = v.name.toLowerCase();
        return !maleKeywords.some(mk => name.includes(mk));
      });

      if (safeVoices.length > 1) {
        selectedVoice = safeVoices[safeVoices.length - 1];
      } else if (safeVoices.length === 1) {
        selectedVoice = safeVoices[0];
      }
    }

    if (!selectedVoice) {
      selectedVoice = langVoices[langVoices.length - 1] || langVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  loadNextTip() {
    const tips = this.currentLanguage === 'en' ? this.tacticalTipsEn : this.tacticalTipsEs;
    const randomIndex = Math.floor(Math.random() * tips.length);
    this.currentTip = tips[randomIndex];
  }

  setDifficulty(diff: 'Principiante' | 'Intermedio' | 'Avanzado') {
    this.selectedDifficulty = diff;
    this.loadRandomChallenge();
    this.loadRandomIncident();
  }

  shuffleArray(array: any[]): any[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  loadRandomChallenge() {
    const list = this.currentLanguage === 'en' ? this.challengesListEn : this.challengesListEs;
    const filtered = list.filter(c => c.level === (this.selectedDifficulty as string));
    const pool = filtered.length > 0 ? filtered : list;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    
    this.currentChallenge = {
      ...selected,
      options: this.shuffleArray(selected.options)
    };

    this.challengeAnswered = false;
    this.isCorrect = false;
    this.feedbackMessage = '';
  }

  answerChallenge(correct: boolean) {
    this.challengeAnswered = true;
    this.isCorrect = correct;
    const isEn = this.currentLanguage === 'en';
    if (correct) {
      this.feedbackMessage = isEn ? `Correct! +50 XP. ${this.currentChallenge.explanation}` : `¡Correcto! +50 XP. ${this.currentChallenge.explanation}`;
      this.dailyMissions[0].completed = true;
    } else {
      this.feedbackMessage = isEn ? `Incorrect. ${this.currentChallenge.explanation}` : `Incorrecto. ${this.currentChallenge.explanation}`;
    }
  }

  loadRandomIncident() {
    const list = this.currentLanguage === 'en' ? this.incidentsListEn : this.incidentsListEs;
    const filtered = list.filter(i => i.level === (this.selectedDifficulty as string));
    const pool = filtered.length > 0 ? filtered : list;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    this.currentIncident = {
      ...selected,
      actions: this.shuffleArray(selected.actions)
    };

    this.incidentReported = false;
    this.incidentCorrect = false;
    this.incidentFeedbackMsg = '';
  }

  handleIncidentAction(action: IncidentAction) {
    this.incidentReported = true;
    this.incidentCorrect = action.correct;
    this.incidentFeedbackMsg = action.message;
    if (action.correct) {
      this.dailyMissions[1].completed = true;
    }
  }
  
  loadUserStreak() {
    // 1. Obtenemos la fecha de hoy (formato simple: "YYYY-MM-DD")
    const today = new Date().toISOString().split('T')[0];
    
    // 2. Buscamos en la memoria cuándo fue la última vez que abrió la app y qué racha tenía
    const lastLoginDate = localStorage.getItem('last_login_date');
    let savedStreak = Number(localStorage.getItem('user_streak') || '5');

    // 3. Si nunca se había guardado una fecha, o si la fecha guardada es de un día anterior:
    if (!lastLoginDate) {
      // Primera vez: guardamos la fecha de hoy y dejamos la racha base
      localStorage.setItem('last_login_date', today);
      localStorage.setItem('user_streak', savedStreak.toString());
    } else if (lastLoginDate !== today) {
      // ¡Es un nuevo día! Verificamos si entró al día siguiente exacto
      // (Aquí sumamos +1 porque mantuvo su racha al entrar hoy)
      savedStreak++; 
      
      // Guardamos la nueva fecha de hoy y la racha actualizada en la memoria
      localStorage.setItem('last_login_date', today);
      localStorage.setItem('user_streak', savedStreak.toString());
    }

    // 4. Asignamos el valor final para que se muestre en la pantalla
    this.userStreak = savedStreak;
  }

  loadCycleProgress() {
    const savedCompleted = localStorage.getItem('completed_modules_count');
    this.completedModulesCount = savedCompleted ? Number(savedCompleted) : 0;

    if (this.totalModulesCount > 0) {
      this.cycleProgressPercent = Math.round((this.completedModulesCount / this.totalModulesCount) * 100);
    } else {
      this.cycleProgressPercent = 0;
    }
  }

  

}