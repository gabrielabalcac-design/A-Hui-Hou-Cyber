import { Component, ChangeDetectorRef, OnDestroy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NarrationService } from '../../core/services/narration.service';
import { NarrationControlsComponent } from '../../components/narration-controls/narration-controls.component';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { GAMES_LIST, GameEntry } from '../../core/data/games.data';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-games',
  template: `
  <!-- Barra superior -->
  <app-header [heading]="currentLang === 'es' ? 'Módulos de Simulación y Análisis de Incidentes' : 'Incident Simulation & Analysis Modules'"></app-header>

  <!-- Contenido principal -->
  <main class="app-content">
  <div class="games-container">

  <!-- VISTA 1: MENÚ PRINCIPAL (GRID DE JUEGOS) -->
  <div *ngIf="activeGame === 'menu'" class="menu-view">
    <div class="intro-section">
      <h3>{{ currentLang === 'es' ? 'Centro de Capacitación Avanzada en Ciberseguridad' : 'Advanced Cybersecurity Training Center' }}</h3>
      <p>{{ currentLang === 'es' ? 'Seleccione un escenario de simulación táctica.' : 'Select a tactical simulation scenario.' }}</p>
    </div>

    <div class="arcade-grid">
      <div *ngFor="let g of gamesList" class="arcade-card" (click)="selectGame(g.id)">
        <div class="card-icon" [style.background]="g.bg"><span>{{ g.icon }}</span></div>
        <div class="card-info">
          <h4>{{ currentLang === 'es' ? g.titleEs : g.titleEn }}</h4>
          <p>{{ currentLang === 'es' ? g.descEs : g.descEn }}</p>
          <span class="badge-levels">{{ currentLang === 'es' ? '10 Fases de Evaluación' : '10 Evaluation Phases' }}</span>
        </div>
        <span class="play-btn">▶</span>
      </div>
    </div>
  </div>

  <!-- VISTA GENERAL DE JUEGO ACTIVO -->
  <div *ngIf="activeGame !== 'menu'" class="game-view">
    <button class="btn-back" (click)="returnToMenu()">{{ currentLang === 'es' ? '← Volver al Panel Principal' : '← Back to Main Dashboard' }}</button>
    <div class="game-box">
      
      <!-- PANTALLA DE RESULTADO FINAL CON PUNTAJE -->
      <div *ngIf="gameCompleted" class="score-screen">
        <div class="score-icon">🏆</div>
        <h3>{{ currentLang === 'es' ? '¡Simulación Concluida con Éxito!' : 'Simulation Successfully Completed!' }}</h3>
        <p class="score-game-title">{{ currentLang === 'es' ? currentGameObj.titleEs : currentGameObj.titleEn }}</p>
        <div class="score-card">
          <span class="score-label">{{ currentLang === 'es' ? 'Calificación de Desempeño' : 'Performance Score' }}</span>
          <span class="score-value">{{ score }} / 100</span>
        </div>
        <p class="score-desc" *ngIf="score >= 80">{{ currentLang === 'es' ? 'Excelente gestión de respuesta a incidentes en los 10 niveles. Demostró competencia técnica y aplicación óptima de protocolos.' : 'Excellent incident response management across all 10 levels. Demonstrated technical competence and optimal protocol application.' }}</p>
        <p class="score-desc" *ngIf="score < 80">{{ currentLang === 'es' ? 'Simulación finalizada. Le sugerimos revisar los vectores de riesgo analizados y reintentar la evaluación.' : 'Simulation finished. We suggest reviewing the analyzed risk vectors and retrying the assessment.' }}</p>
        <button class="btn-action" (click)="returnToMenu()">{{ currentLang === 'es' ? 'Regresar al Directorio' : 'Return to Directory' }}</button>
      </div>

      <!-- JUEGO EN CURSO -->
      <div *ngIf="!gameCompleted">
        <div class="game-header-bar">
          <h3>{{ currentGameObj.icon }} {{ currentLang === 'es' ? currentGameObj.titleEs : currentGameObj.titleEn }}</h3>
          <div class="header-controls">
            <!-- Narración: escena, fase y opciones -->
            <app-narration-controls
              [compact]="true"
              [text]="gameNarrationText"
              [key]="narrationKey"
              [lang]="currentLang">
            </app-narration-controls>
            <span class="level-indicator">{{ currentLang === 'es' ? 'Fase' : 'Phase' }} {{ currentLevel }} / 10</span>
          </div>
        </div>

        <!-- 1. JUEGOS DE OPCIÓN MÚLTIPLE -->
        <div *ngIf="isChoiceGame()">
          <div class="scenario-box">
            <p><strong>{{ currentLang === 'es' ? 'Vector de Evaluación (Fase' : 'Evaluation Vector (Phase' }} {{ currentLevel }}):</strong> {{ activeChallengeText }}</p>
          </div>
          <div class="options-list">
            <button *ngFor="let opt of randomizedOptions"
              [disabled]="answerSelected"
              (click)="handleChoiceAnswer(opt.correct, opt.explanationEs, opt.explanationEn)"
              class="option-btn"
              [class.disabled-btn]="answerSelected">
              {{ currentLang === 'es' ? opt.labelEs : opt.labelEn }}
            </button>
          </div>
          <p class="feedback-msg" *ngIf="actionFeedback" [class.error-text]="isErrorFeedback">{{ actionFeedback }}</p>
        </div>

        <!-- 2. JUEGOS DE INPUT TÉCNICO -->
        <div *ngIf="isInputGame()">
          <div class="scenario-box">
            <p><strong>{{ currentLang === 'es' ? 'Requisito Técnico (Fase' : 'Technical Requirement (Phase' }} {{ currentLevel }}):</strong> {{ activeChallengeText }}</p>
          </div>
          <div class="input-group">
            <input type="text" [(ngModel)]="userInputVal" [disabled]="answerSelected" [placeholder]="currentLang === 'es' ? 'Ingrese la sintaxis o comando de mitigación...' : 'Enter mitigation syntax or command...'">
          </div>
          <button class="btn-action" [disabled]="answerSelected" (click)="handleInputSubmit()">{{ currentLang === 'es' ? 'Validar Solución' : 'Validate Solution' }}</button>
          <p class="feedback-msg" *ngIf="actionFeedback" [class.error-text]="isErrorFeedback">{{ actionFeedback }}</p>
        </div>

        <!-- 3. JUEGOS DE CONFIGURACIÓN AVANZADA (SLIDERS) -->
        <div *ngIf="isConfigGame()">
          <div class="scenario-box">
            <p><strong>{{ currentLang === 'es' ? 'Calibración de Contramedidas (Fase' : 'Countermeasure Calibration (Phase' }} {{ currentLevel }}):</strong> {{ activeChallengeText }}</p>
          </div>
          <div class="slider-group" *ngFor="let param of configParams">
            <label>{{ currentLang === 'es' ? param.nameEs : param.nameEn }}: <strong>{{ param.val }}%</strong></label>
            <input type="range" [min]="0" [max]="100" [disabled]="answerSelected" [(ngModel)]="param.val" (input)="checkConfigParams()">
          </div>
          <button class="btn-action" [disabled]="!configPassed || answerSelected" (click)="handleConfigNext()">{{ currentLang === 'es' ? 'Aplicar Políticas de Seguridad' : 'Apply Security Policies' }}</button>
          <p class="feedback-msg" *ngIf="actionFeedback">{{ actionFeedback }}</p>
        </div>

        <!-- 4. JUEGOS FORENSES (CASOS REALES CON IMAGEN) -->
        <div *ngIf="isForensicGame()">
          <div class="forensic-scene-box">
            <img [src]="currentGameObj.caseImg" alt="Evidencia de Incidente Digital" class="case-photo">
          </div>
          <div class="scenario-box">
            <p><strong>{{ currentLang === 'es' ? 'Análisis de Evidencia (Fase' : 'Evidence Analysis (Phase' }} {{ currentLevel }}):</strong> {{ activeChallengeText }}</p>
          </div>
          <div class="options-list">
            <button *ngFor="let opt of randomizedOptions"
              [disabled]="answerSelected"
              (click)="handleChoiceAnswer(opt.correct, opt.explanationEs, opt.explanationEn)"
              class="option-btn"
              [class.disabled-btn]="answerSelected">
              {{ currentLang === 'es' ? opt.labelEs : opt.labelEn }}
            </button>
          </div>
          <p class="feedback-msg" *ngIf="actionFeedback" [class.error-text]="isErrorFeedback">{{ actionFeedback }}</p>
        </div>

      </div>
    </div>
  </div>

  </div>
  </main>
  <app-footer-nav activeTab="games"></app-footer-nav>
  `,
 styles: [`
  /* ==========================================================
     ESTILOS TÁCTICOS SOC - ARCADE & SIMULADORES DE INCIDENTES
     ========================================================== */

  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: #D6C5B2;
    overflow: hidden;
  }

  /* Header Superior SOC */
  .app-header {
    background: linear-gradient(135deg, #041422 0%, #2B587D 100%);
    color: #ffffff;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 15px rgba(6, 36, 61, 0.25);
    border-bottom: 2px solid rgba(16, 185, 129, 0.3);
    z-index: 10;
  }

  .brand-container h2 {
    font-size: 15px;
    font-weight: 800;
    margin: 0;
    letter-spacing: 0.4px;
    color: #ffffff;
  }

  .app-content {
    flex: 1;
    overflow-y: auto;
    background-color: #D6C5B2;
  }

  .games-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 24px 16px 110px 16px;
  }

  .intro-section {
    margin-bottom: 20px;
    padding: 0 4px;

    h3 {
      font-size: 18px;
      font-weight: 900;
      color: #06243D;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 13px;
      color: #475569;
      margin: 0;
    }
  }

  /* ================= GRID DE TARJETAS ARCADE ================= */
  .arcade-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .arcade-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(6, 36, 61, 0.06);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    border-left: 6px solid #2B587D;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(43, 88, 125, 0.15);
      border-color: #2B587D;

      .play-btn {
        background: #06243D;
        color: #ffffff;
        transform: scale(1.08);
      }
    }
  }

  .card-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
  }

  .card-info {
    flex: 1;

    h4 {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 3px 0;
    }

    p {
      font-size: 12px;
      color: #64748b;
      margin: 0 0 8px 0;
      line-height: 1.35;
    }
  }

  .badge-levels {
    font-size: 10px;
    background: #f0fdf4;
    color: #059669;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 800;
    border: 1px solid #bbf7d0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .play-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f1f5f9;
    color: #2B587D;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  /* ================= VISTA DE JUEGO / SIMULACIÓN ================= */
  .btn-back {
    background: #06243D;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 12.5px;
    cursor: pointer;
    margin-bottom: 14px;
    padding: 8px 16px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(6, 36, 61, 0.2);
    transition: background 0.2s;

    &:hover { background: #2B587D; }
  }

  .game-box {
    background: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 30px rgba(6, 36, 61, 0.08);
    border: 1px solid #e2e8f0;
    border-left: 6px solid #10b981;
  }

  .game-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 10px;

    h3 {
      font-size: 15px;
      font-weight: 900;
      color: #06243D;
      margin: 0;
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-audio-tts {
    background: #2B587D;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(43,88,125,0.2);

    &:hover { background: #1f405c; }
  }

  .level-indicator {
    font-size: 11px;
    font-weight: 800;
    background: #f0fdf4;
    color: #059669;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #bbf7d0;
    text-transform: uppercase;
  }

  .scenario-box {
    background: #f8fafc;
    padding: 14px 16px;
    border-radius: 12px;
    border-left: 4px solid #2B587D;
    font-size: 13px;
    margin-bottom: 16px;
    line-height: 1.5;
    color: #334155;
    border: 1px solid #e2e8f0;

    strong { color: #06243D; }
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option-btn {
    width: 100%;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    text-align: left;
    font-size: 13px;
    color: #334155;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #2B587D;
      color: #0f172a;
    }
  }

  .disabled-btn {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f1f5f9 !important;
  }

  .input-group input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
    box-sizing: border-box;
    outline: none;
    margin-bottom: 14px;
    background-color: #fafbfc;
    color: #0f172a;

    &::placeholder { color: #94a3b8; }
    &:focus { border-color: #2B587D; background-color: #fff; }
    &:disabled { color: #64748b; background-color: #f2f2f2; cursor: not-allowed; }
  }

  .btn-action {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: none;
    font-weight: 800;
    font-size: 13.5px;
    cursor: pointer;
    color: white;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    transition: all 0.2s;

    &:hover { transform: translateY(-1px); }
    &:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
  }

  .feedback-msg {
    margin-top: 14px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    color: #059669;
  }

  .error-text { color: #dc2626; }

  .slider-group {
    margin-bottom: 16px;
    font-size: 12.5px;
    color: #475569;
    font-weight: 600;

    input {
      width: 100%;
      margin-top: 6px;
      accent-color: #2B587D;
    }
  }

  /* ================= PANTALLA DE RESULTADOS / VICTORIA ================= */
  .score-screen {
    text-align: center;
    padding: 16px 4px;

    .score-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 18px;
      font-weight: 900;
      color: #06243D;
      margin: 0 0 4px 0;
    }

    .score-game-title {
      font-size: 12.5px;
      color: #64748b;
      font-weight: 700;
      margin: 0 0 18px 0;
    }

    .score-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 18px;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);

      .score-label {
        display: block;
        font-size: 11px;
        color: #64748b;
        margin-bottom: 4px;
        text-transform: uppercase;
        font-weight: 700;
      }

      .score-value {
        font-size: 32px;
        font-weight: 900;
        color: #06243D;
        font-family: monospace;
      }
    }

    .score-desc {
      font-size: 13px;
      color: #475569;
      margin-bottom: 22px;
      line-height: 1.5;
    }
  }

  /* ================= FORENSE & EVIDENCIA ================= */
  .forensic-scene-box {
    margin-bottom: 14px;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid #2B587D;
    background: #000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }

  .case-photo {
    width: 100%;
    height: 150px;
    object-fit: cover;
    opacity: 0.9;
  }

  /* ================= ESCRITORIO (≥ 900px) ================= */
  @media (min-width: 900px) {
    .games-container {
      max-width: 1120px;
      padding: 32px 28px 110px 28px;
    }

    .arcade-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
    }

    .game-view {
      max-width: 800px;
      margin: 0 auto;
    }
  }
`],
  standalone: true,
  imports: [AppHeaderComponent, NarrationControlsComponent, CommonModule, FormsModule, FooterNavComponent]
})
export class GamesHubPage implements OnDestroy {
  activeGame: string = 'menu';
  currentLevel: number = 1;
  actionFeedback: string = '';
  isErrorFeedback: boolean = false;
  userInputVal: string = '';
  randomizedOptions: any[] = [];
  answerSelected: boolean = false;
  gameCompleted: boolean = false;
  score: number = 0;

  gamesList: GameEntry[] = GAMES_LIST;

  get currentGameObj() {
    return this.gamesList.find(g => g.id === this.activeGame) || this.gamesList[0];
  }

  private destroyRef = inject(DestroyRef);

  get currentLang(): 'es' | 'en' { return this.lang.current; }

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private lang: LanguageService, private narration: NarrationService) {
    // Enlaces profundos: /games?open=g21 abre ese juego/caso; /games sin parámetro muestra el menú
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('open');
      if (id && this.gamesList.some(g => g.id === id)) {
        this.selectGame(id);
      } else if (!id && this.activeGame !== 'menu') {
        this.returnToMenu();
      }
    });
    this.lang.changes$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onLanguageChanged());
  }

  ngOnDestroy() {
    this.narration.stop();
  }

  onLanguageChanged() {
    this.loadLevelData();
    this.cdr.detectChanges();
  }

  selectGame(id: string) {
    this.narration.stop();
    this.activeGame = id;
    this.currentLevel = 1;
    this.actionFeedback = '';
    this.userInputVal = '';
    this.answerSelected = false;
    this.gameCompleted = false;
    this.score = 0;
    this.loadLevelData();
  }

  returnToMenu() {
    this.narration.stop();
    this.activeGame = 'menu';
  }

  isChoiceGame() { return this.currentGameObj.type === 'choice'; }
  isInputGame() { return this.currentGameObj.type === 'input'; }
  isConfigGame() { return this.currentGameObj.type === 'config'; }
  isForensicGame() { return this.currentGameObj.type === 'forensic'; }

  // ---------------------------------------------------------------- Narración
  // La voz la gestiona NarrationService (pausa, velocidad, mejor voz, progreso).

  get narrationKey(): string {
    return `game-${this.activeGame}-${this.currentLevel}`;
  }

  /** Escena del caso + fase + reto + opciones (en el orden en que se muestran). */
  get gameNarrationText(): string {
    const en = this.currentLang === 'en';
    const g = this.currentGameObj;
    const title = en ? g.titleEn : g.titleEs;
    const desc = en ? g.descEn : g.descEs;
    const phase = en ? `Phase ${this.currentLevel} of 10.` : `Fase ${this.currentLevel} de 10.`;

    let text = `${title}. ${desc} ${phase} ${this.activeChallengeText}`;

    if (this.isChoiceGame() || this.isForensicGame()) {
      const label = en ? 'Option' : 'Opción';
      const opts = this.randomizedOptions
        .map((o, i) => `${label} ${i + 1}: ${en ? o.labelEn : o.labelEs}.`)
        .join(' ');
      text += ` ${en ? 'Options' : 'Opciones'}: ${opts}`;
    } else if (this.isInputGame()) {
      text += en ? ' Type the mitigation command in the field.' : ' Escribe el comando de mitigación en el campo.';
    } else if (this.isConfigGame()) {
      text += en ? ' Adjust the sliders above the required threshold.' : ' Ajusta los controles por encima del umbral exigido.';
    }
    return text;
  }

  get activeChallengeText(): string {
    const title = this.currentLang === 'es' ? this.currentGameObj.titleEs : this.currentGameObj.titleEn;
    const lvl = this.currentLevel;
    if (this.currentLang === 'en') {
      return `Analyzing telemetry report and evidence for "${title}" in operating phase #${lvl} (of 10). Identify the risk vector and determine the proper mitigation procedure.`;
    }
    return `Analizando el reporte de telemetría y evidencia para "${title}" en su fase operativa #${lvl} (de 10). Identifique el vector de riesgo y determine el procedimiento de mitigación adecuado.`;
  }

  loadLevelData() {
    this.narration.stop();
    if (!this.isChoiceGame() && !this.isForensicGame() && !this.isInputGame()) return;

    const optionsPool = [
      { 
        labelEs: 'Aislar el segmento afectado y aplicar protocolo de contención inmediata', 
        labelEn: 'Isolate the affected segment and apply immediate containment protocol', 
        correct: true, 
        explanationEs: 'Respuesta acertada: Se contuvo la brecha antes de daño mayor.', 
        explanationEn: 'Correct answer: The breach was contained before major damage.' 
      },
      { 
        labelEs: 'Reiniciar los servicios de red principales sin verificar las tablas de enrutamiento', 
        labelEn: 'Restart primary network services without verifying routing tables', 
        correct: false, 
        explanationEs: 'Error operativo: Esto provocó mayor inestabilidad en el clúster.', 
        explanationEn: 'Operational error: This caused further instability in the cluster.' 
      },
      { 
        labelEs: 'Ignorar la traza temporal y dejar que el sistema operativo purgue el caché', 
        labelEn: 'Ignore the timestamp trace and let the operating system purge cache', 
        correct: false, 
        explanationEs: 'Error grave: El vector malicioso sigue activo en memoria.', 
        explanationEn: 'Serious error: The malicious vector remains active in memory.' 
      },
      { 
        labelEs: 'Otorgar privilegios de superusuario temporal al proceso afectado para diagnóstico', 
        labelEn: 'Grant temporary superuser privileges to the affected process for diagnostics', 
        correct: false, 
        explanationEs: 'Error crítico: Esto escaló los privilegios del atacante.', 
        explanationEn: 'Critical error: This escalated the attacker privileges.' 
      }
    ];

    this.randomizedOptions = [...optionsPool].sort(() => Math.random() - 0.5);
    this.cdr.detectChanges();
  }

  handleChoiceAnswer(isCorrect: boolean, explanationEs: string, explanationEn: string) {
    this.answerSelected = true;
    this.narration.stop();
    const explanation = this.currentLang === 'es' ? explanationEs : explanationEn;
    if (isCorrect) {
      this.isErrorFeedback = false;
      this.actionFeedback = this.currentLang === 'es' ? `Fase ${this.currentLevel} superada con éxito. ${explanation}` : `Phase ${this.currentLevel} successfully passed. ${explanation}`;
      this.score += 10;
    } else {
      this.isErrorFeedback = true;
      this.actionFeedback = this.currentLang === 'es' ? `Respuesta incorrecta: ${explanation} Avanzando de fase...` : `Incorrect answer: ${explanation} Advancing phase...`;
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.actionFeedback = '';
      if (this.currentLevel < 10) {
        this.currentLevel++;
        this.answerSelected = false;
        this.loadLevelData();
      } else {
        this.gameCompleted = true;
        this.cdr.detectChanges();
      }
    }, 1500);
  }

  handleInputSubmit() {
    if (this.userInputVal.trim().length > 2) {
      this.answerSelected = true;
      this.narration.stop();
      this.isErrorFeedback = false;
      this.actionFeedback = this.currentLang === 'es' ? `Comando procesado correctamente en la Fase ${this.currentLevel}.` : `Command processed successfully in Phase ${this.currentLevel}.`;
      this.score += 10;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.actionFeedback = '';
        this.userInputVal = '';
        if (this.currentLevel < 10) {
          this.currentLevel++;
          this.answerSelected = false;
          this.cdr.detectChanges();
        } else {
          this.gameCompleted = true;
          this.cdr.detectChanges();
        }
      }, 1400);
    } else {
      this.isErrorFeedback = true;
      this.actionFeedback = this.currentLang === 'es' ? 'Por favor, ingrese una solución o sintaxis válida.' : 'Please enter a valid solution or syntax.';
      this.cdr.detectChanges();
    }
  }

  configParams = [
    { nameEs: 'Nivel de Blindaje Perimetral', nameEn: 'Perimeter Shielding Level', val: 30 },
    { nameEs: 'Protocolo de Cifrado Activo', nameEn: 'Active Encryption Protocol', val: 40 }
  ];
  configPassed = false;

  checkConfigParams() {
    this.configPassed = this.configParams.every(p => p.val >= 75);
    this.actionFeedback = this.configPassed ? 
      (this.currentLang === 'es' ? 'Parámetros óptimos alcanzados.' : 'Optimal parameters reached.') : 
      (this.currentLang === 'es' ? 'Eleve los valores para superar el umbral de seguridad exigido.' : 'Raise values to exceed the required security threshold.');
  }

  handleConfigNext() {
    this.answerSelected = true; 
    this.narration.stop();
    this.score += 10;
    if (this.currentLevel < 10) {
      this.currentLevel++;
      this.actionFeedback = '';
      this.configPassed = false;
      this.configParams.forEach(p => p.val = 40);
      this.answerSelected = false;
      this.cdr.detectChanges();
    } else {
      this.gameCompleted = true;
      this.cdr.detectChanges();
    }
  }
}