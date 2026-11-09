import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-profile',
  template: `
    <!-- Barra superior con Título y Selector de Idioma Desplegable -->
    <app-header [heading]="currentLanguage === 'en' ? 'Operator Profile' : 'Perfil del Operador'"></app-header>

    <!-- MODAL TÁCTICO NIVEL SOC (CONFIGURACIÓN GUARDADA) -->
    <div class="soc-modal-backdrop" *ngIf="showToast">
      <div class="soc-modal-card">
        <div class="soc-modal-header">
          <div class="soc-modal-title-group">
            <span class="soc-modal-status-dot"></span>
            <span class="soc-modal-tag">SECURE_TELEMETRY // SYNC_COMPLETED</span>
          </div>
          <span class="soc-modal-subtag">NODE: 2026-X9</span>
        </div>
        
        <div class="soc-modal-body">
          <div class="soc-modal-icon-container">
            <div class="soc-icon-glow"></div>
            <svg class="soc-shield-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#2B587D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(43, 88, 125, 0.1)"/>
              <path d="M9 12L11 14L15 10" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="soc-modal-text-content">
            <div class="soc-eyebrow-wrapper">
              <span class="soc-success-badge">ESTADO: 200 OK</span>
              <span class="soc-success-eyebrow">ENCRYPTED COMMIT</span>
            </div>
            <h3>{{ currentLanguage === 'en' ? 'Configuration Synchronized' : 'Configuración Sincronizada' }}</h3>
            <p>{{ toastMessage }}</p>
          </div>
        </div>

        <div class="soc-modal-footer">
          <div class="soc-footer-info">
            <span class="soc-protocol-id">SECURE_CHANNEL // ACTIVE</span>
          </div>
          <button class="soc-modal-btn" (click)="closeModal()">
            {{ currentLanguage === 'en' ? 'accept and continue' : 'Aceptar y Continuar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE PREVISUALIZACIÓN DEL CERTIFICADO SOC -->
    <div class="cert-modal-backdrop" *ngIf="showCertificateModal">
      <div class="cert-modal-container">
        <!-- BARRA SUPERIOR PROFESIONAL TIPO SOC -->
        <div class="cert-modal-toolbar">
          <div class="cert-toolbar-title-group">
            <span class="cert-pulse-dot"></span>
            <span class="cert-toolbar-title">SECURE_CERT // A HUI HOU CYBER</span>
          </div>
          <div class="cert-toolbar-actions">
            <button class="cert-btn-print" (click)="printCertificate()">
              <svg class="cert-print-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
              Descargar / Imprimir PDF
            </button>
            <button class="cert-btn-close" (click)="closeCertificateModal()" title="Cerrar ventana">✕</button>
          </div>
        </div>

        <!-- PLANTILLA DEL CERTIFICADO PROFESIONAL -->
        <div class="certificate-sheet" id="printableCertificate">
          <!-- Logotipo integrado como marca de agua en el fondo -->
          <div class="cert-bg-logo-container">
            <img src="assets/A Hui Hou Cyber...jpg" alt="Watermark Logo" class="cert-bg-logo">
          </div>

          <div class="cert-header">
            <img src="assets/A Hui Hou Cyber...jpg" alt="Logo A Hui Hou Cyber" class="cert-logo-prominent">
            <h2>A HUI HOU CYBER</h2>
            <p class="cert-subtitle">CENTRO DE ENTRENAMIENTO Y OPERACIONES EN CIBERSEGURIDAD</p>
          </div>

          <div class="cert-body">
            <p class="cert-intro">En cumplimiento de los estándares internacionales de formación técnica y ciberseguridad</p>
            <p class="cert-makes-known">El presente documento certifica que el operador / estudiante:</p>
            
            <h1 class="cert-student-name">{{ operator.name }}</h1>
            
            <p class="cert-id-info">Identificado(a) con ID SOC / Cédula: <span class="cert-highlight">{{ operator.idCode }}</span></p>
            
            <p class="cert-action-text">Ha cursado y aprobado satisfactoriamente la acción de formación especializada:</p>
            
            <!-- Título oficial limpio del curso -->
            <h3 class="cert-course-title">{{ selectedCertificateModule }}</h3>
            
            <p class="cert-hours">con un nivel de competencia equivalente a <strong>5 horas</strong> de laboratorios prácticos y simulaciones SOC.</p>
            
            <p class="cert-date-text">Dada en la República de Colombia, a los siete (7) días del mes de noviembre de 2026.</p>
          </div>

          <div class="cert-footer">
            <!-- Bloque de Firma Oficial Mejorada -->
            <div class="cert-signature-area">
              <div class="cert-signature-image-container">
                <svg class="cert-handwritten-signature" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Rúbrica elegante estilo trazo de pluma ejecutiva -->
                  <path d="M18 52 C 22 25, 30 10, 48 18 C 58 22, 52 55, 68 35 C 82 15, 90 48, 110 22 C 122 8, 138 42, 155 20 C 170 5, 185 38, 218 12" stroke="#06243D" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M35 42 Q 80 62, 130 38 T 210 32" stroke="#2B587D" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="4 2"/>
                </svg>
              </div>
              <div class="cert-signature-line"></div>
              <p class="cert-signatory-name">A HUI HOU CYBER</p>
              <p class="cert-signatory-role">Formación Técnica en Ciberseguridad</p>
            </div>

            <!-- Área de Verificación Técnica -->
            <div class="cert-verification-area">
              <span class="cert-app-brand">A Hui Hou Cyber</span>
              <span class="cert-app-sub">Sistema de Acreditación</span>
              <span class="cert-hash-code">HASH: SOC-9510003593670CC</span>
              <span class="cert-date-reg">REGISTRO: 07/11/2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <main class="app-content">
      <div class="profile-container">

        <!-- TARJETA DE INFORMACIÓN DEL USUARIO (SOC PANEL) -->
        <div class="profile-card profile-full-width soc-accent-card">
          <div class="profile-avatar-img-wrapper">
            <img src="assets/A Hui Hou Cyber...jpg" alt="Logo A Hui Hou Cyber" class="profile-avatar-img">
          </div>
          <div class="profile-info">
            <div class="profile-header-row">
              <div>
                <h3>{{ operator.name }}</h3>
                <span class="operator-handle">@{{ operator.nickname }}</span>
              </div>
              <div class="terminal-badge-wrapper">
                <span class="terminal-label">ID SOC</span>
                <span class="terminal-badge">{{ operator.idCode }}</span>
              </div>
            </div>

            <div class="profile-meta-grid">
              <div class="meta-item">
                <span class="meta-label">Email:</span>
                <span class="meta-val">{{ operator.email }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Rol:</span>
                <span class="meta-val">{{ operator.role }}</span>
              </div>
            </div>

            <div class="profile-status-row">
              <span class="badge-status">
                <span class="status-dot"></span> 
                {{ currentLanguage === 'en' ? 'Status: Active Secure Session' : 'Estado: Sesión Segura Activa' }}
              </span>
            </div>
          </div>
        </div>

        <!-- CREDENCIALES Y ESPECIALIZACIÓN -->
        <div class="section-box soc-accent-card">
          <h4>{{ currentLanguage === 'en' ? 'Credentials and Specialization' : 'Credenciales y Especialización' }}</h4>
          <div class="credentials-grid">
            <div class="cred-item">
              <span class="cred-title"><span class="cred-icon">■</span> {{ currentLanguage === 'en' ? 'Institution / Degree' : 'Institución / Carrera' }}</span>
              <span class="cred-desc terminal-text">{{ operator.university }}</span>
            </div>
            <div class="cred-item">
              <span class="cred-title"><span class="cred-icon">■</span> {{ currentLanguage === 'en' ? 'Authorization Level' : 'Nivel de Autorización' }}</span>
              <span class="cred-desc terminal-text">{{ getDynamicClearanceLevel() }}</span>
            </div>
            <div class="cred-item">
              <span class="cred-title"><span class="cred-icon">■</span> {{ currentLanguage === 'en' ? 'Last Tactical Access' : 'Último Acceso Táctico' }}</span>
              <span class="cred-desc terminal-text">{{ operator.lastAccess }}</span>
            </div>
          </div>
        </div>

        <!-- PROGRESO EN EL CENTRO DE ENTRENAMIENTO -->
        <div class="section-box center-content-box soc-accent-card">
          <h4>{{ currentLanguage === 'en' ? 'Training Center Progress' : 'Progreso en el Centro de Entrenamiento' }}</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">50</span>
              <span class="stat-label">{{ currentLanguage === 'en' ? 'Total Modules' : 'Módulos Totales' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">250</span>
              <span class="stat-label">{{ currentLanguage === 'en' ? 'Evaluated Phases' : 'Fases Evaluadas' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ getCompletionPercentage() }}%</span>
              <span class="stat-label">{{ currentLanguage === 'en' ? 'Tactical Availability' : 'Disponibilidad Táctica' }}</span>
            </div>
          </div>
        </div>

        <!-- SECCIÓN DE LOS 50 MÓDULOS -->
        <div class="section-box profile-full-width soc-accent-card">
          <div class="modules-command-header">
            <div>
              <h4 style="margin: 0; border: none; padding: 0;">
                {{ currentLanguage === 'en' ? 'Modules Telemetry & Progress' : 'Telemetría y Progreso de Módulos' }}
              </h4>
              <p class="modules-subtitle">{{ currentLanguage === 'en' ? 'Security clearance and tactical authorization matrix' : 'Matriz de autorización táctica y de seguridad' }}</p>
            </div>
            <div class="telemetry-pills-counter">
              <span class="tele-val">{{ completedModulesCount }}/50</span>
              <span class="tele-lbl">UNLOCKED</span>
            </div>
          </div>

          <div class="soc-progress-wrapper">
            <div class="soc-progress-info">
              <span>Sync Status</span>
              <span class="soc-progress-pct">{{ getCompletionPercentage() }}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="getCompletionPercentage()"></div>
            </div>
          </div>

        <div class="badges-grid-container">
  <div *ngFor="let badge of badges" 
       class="module-badge-card"
       [class.unlocked]="isUnlocked(badge.requiredModules)"
       [class.locked]="!isUnlocked(badge.requiredModules)">
    <div class="badge-card-left">
      <span class="badge-icon-status">{{ isUnlocked(badge.requiredModules) ? '🟢' : '🔒' }}</span>
      <span class="badge-id-code">#{{ badge.id < 10 ? '0' + badge.id : badge.id }}</span>
    </div>
    <span class="badge-title-text" [title]="currentLanguage === 'en' ? badge.titleEn : badge.titleEs">
      {{ currentLanguage === 'en' ? badge.titleEn : badge.titleEs }}
    </span>
              <button *ngIf="isUnlocked(badge.requiredModules)" class="btn-cert-mini" (click)="openCertificate(currentLanguage === 'en' ? badge.titleEn : badge.titleEs)" title="Ver Certificado">
  📜 Certificado
</button>
            </div>
          </div>
        </div>

        <!-- PREFERENCIAS DEL SISTEMA -->
        <div class="section-box profile-full-width soc-accent-card config-command-box">
          <div class="config-header-flex">
            <h4>{{ currentLanguage === 'en' ? 'System Preferences' : 'Preferencias del Sistema' }}</h4>
            <span class="config-secure-tag">SECURE_CHANNEL</span>
          </div>
          
          <div class="config-item-advanced">
            <div class="config-text">
              <div class="config-title-row">
                <span class="config-title">🔊 {{ currentLanguage === 'en' ? 'Voice Synthesis (Auto Audio)' : 'Síntesis de Voz (Audio Automático)' }}</span>
                <span class="config-status-indicator" [class.active]="audioEnabled">
                  {{ audioEnabled ? (currentLanguage === 'en' ? 'ONLINE' : 'ACTIVO') : (currentLanguage === 'en' ? 'MUTED' : 'SILENCIADO') }}
                </span>
              </div>
              <p class="config-desc">
                {{ currentLanguage === 'en' ? 'Plays telemetry reports out loud when entering forensic cases.' : 'Reproduce en voz alta los reportes de telemetría al ingresar a los casos forenses.' }}
              </p>
            </div>
            <label class="switch">
              <input type="checkbox" [(ngModel)]="audioEnabled">
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <!-- ACCIONES DE GESTIÓN -->
        <div class="actions-box profile-full-width">
          <button class="btn-action" (click)="saveProfileChanges()">{{ currentLanguage === 'en' ? 'Save Preferences' : 'Guardar Preferencias' }}</button>
          <button class="btn-danger" (click)="logoutSession()">{{ currentLanguage === 'en' ? 'Close Secure Session' : 'Cerrar Sesión Segura' }}</button>
        </div>

      </div>
    </main>

    <app-footer-nav activeTab="profile"></app-footer-nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      background-color: #D6C5B2;
      overflow: hidden;
      position: relative;
    }

    .soc-accent-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.06);
      border-left: 6px solid #2B587D;
      position: relative;
    }

    .btn-cert-mini {
      background: #06243D;
      color: #10b981;
      border: 1px solid #10b981;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      cursor: pointer;
      margin-left: 6px;
      transition: all 0.2s ease;
    }
    .btn-cert-mini:hover {
      background: #10b981;
      color: #ffffff;
    }

    /* MODAL DE CERTIFICADO */
    .cert-modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(11, 19, 30, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 10px;
    }
    .cert-modal-container {
      background: #ffffff;
      width: 100%;
      max-width: 960px;
      height: 94vh;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
    }

    /* BARRA SUPERIOR PROFESIONAL (TOOLBAR SOC) */
    .cert-modal-toolbar {
      background: linear-gradient(135deg, #041422 0%, #06243D 100%);
      color: #ffffff;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 2px solid rgba(16, 185, 129, 0.3);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .cert-toolbar-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cert-pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse-glow 2s infinite;
    }
    @keyframes pulse-glow {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 14px #10b981; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .cert-toolbar-title {
      font-family: monospace;
      font-size: 12px;
      font-weight: 800;
      color: #10b981;
      letter-spacing: 1.2px;
    }
    .cert-toolbar-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .cert-btn-print {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: #ffffff;
      border: none;
      padding: 7px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 11.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
      transition: all 0.2s ease;
    }
    .cert-btn-print:hover {
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
    }
    .cert-print-icon {
      width: 14px;
      height: 14px;
    }
    .cert-btn-close {
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.15);
      width: 30px; 
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .cert-btn-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.4);
      transform: scale(1.05);
    }

    /* HOJA DE CERTIFICADO ESTILO CORPORATIVO ÉLITE CON LOGO DE FONDO */
    .certificate-sheet {
      background: #ffffff;
      padding: 25px 45px;
      margin: 15px auto;
      width: 100%;
      max-width: 900px;
      height: calc(100% - 30px);
      border: 6px double #06243D;
      outline: 2px solid #2B587D;
      outline-offset: -10px;
      position: relative;
      text-align: center;
      font-family: 'Times New Roman', serif;
      color: #1e293b;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    /* ESTILOS DEL LOGO DE FONDO (MARCA DE AGUA) */
    .cert-bg-logo-container {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 360px;
      height: 360px;
      z-index: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cert-bg-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0.05;
      mix-blend-mode: multiply;
    }

    .cert-header {
      position: relative;
      z-index: 1;
      border-bottom: 2px solid #2B587D;
      padding-bottom: 4px;
    }
    .cert-logo-prominent {
      width: 95px;
      height: 95px;
      object-fit: contain;
      mix-blend-mode: multiply;
      background: transparent;
      border: none;
      box-shadow: none;
      margin-bottom: 2px;
      display: inline-block;
    }
    .cert-header h2 {
      font-size: 19px;
      font-weight: 900;
      color: #06243D;
      margin: 0 0 2px 0;
      letter-spacing: 2.5px;
      text-transform: uppercase;
    }
    .cert-subtitle {
      font-size: 8.5px;
      font-family: monospace;
      color: #2B587D;
      margin: 0;
      letter-spacing: 2px;
      font-weight: 700;
    }
    .cert-body {
      position: relative;
      z-index: 1;
      margin: 2px 0;
    }
    .cert-intro, .cert-makes-known, .cert-action-text {
      font-size: 11.5px;
      font-style: italic;
      color: #475569;
      margin: 2px 0;
    }
    .cert-student-name {
      font-size: 23px;
      font-weight: 900;
      color: #06243D;
      margin: 5px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      border-bottom: 1px solid #e2e8f0;
      display: inline-block;
      padding: 0 25px;
    }
    .cert-id-info {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 3px;
    }
    .cert-highlight {
      font-family: monospace;
      font-weight: bold;
      color: #2B587D;
    }
    .cert-course-title {
      font-size: 15px;
      font-weight: 800;
      color: #2B587D;
      margin: 5px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cert-hours {
      font-size: 11px;
      color: #475569;
      margin-bottom: 4px;
    }
    .cert-date-text {
      font-size: 10px;
      font-style: italic;
      color: #64748b;
      margin: 0;
    }
    .cert-footer {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      margin-top: 2px;
    }
    .cert-signature-area {
      text-align: center;
      width: 230px;
    }
    .cert-signature-image-container {
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: -4px;
    }
    .cert-handwritten-signature {
      width: 170px;
      height: 42px;
    }
    .cert-signature-line {
      border-top: 1px solid #1e293b;
      margin-bottom: 3px;
    }
    .cert-signatory-name {
      font-size: 8.5px;
      font-weight: bold;
      color: #06243D;
      margin: 0;
    }
    .cert-signatory-role {
      font-size: 7.5px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .cert-verification-area {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: monospace;
      font-size: 7.5px;
      color: #64748b;
      line-height: 1.2;
    }
    .cert-app-brand {
      font-weight: bold;
      color: #06243D;
      font-size: 8.5px;
    }
    .cert-app-sub {
      color: #2B587D;
    }

    /* ESTILOS MODAL SOC */
    .soc-modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(11, 19, 30, 0.8); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .soc-modal-card {
      background: #ffffff; width: 90%; max-width: 520px;
      border-radius: 20px; border: 1.5px solid #2B587D;
      box-shadow: 0 25px 65px -15px rgba(6, 36, 61, 0.5); overflow: hidden;
    }
    .soc-modal-header {
      background: #06243D; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2B587D;
    }
    .soc-modal-title-group { display: flex; align-items: center; gap: 10px; }
    .soc-modal-status-dot { width: 9px; height: 9px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
    .soc-modal-tag { font-family: monospace; font-size: 11.5px; font-weight: 800; color: #10b981; letter-spacing: 1px; }
    .soc-modal-subtag { font-family: monospace; font-size: 10.5px; color: #94a3b8; font-weight: 700; }
    .soc-modal-body { padding: 32px 28px; display: flex; align-items: center; gap: 22px; }
    .soc-modal-icon-container {
      width: 68px; height: 68px; background: #f8fafc; border-radius: 18px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; position: relative;
    }
    .soc-icon-glow { position: absolute; inset: -3px; background: linear-gradient(135deg, rgba(43,88,125,0.25), rgba(16,185,129,0.25)); border-radius: 20px; filter: blur(6px); }
    .soc-shield-icon { width: 36px; height: 36px; position: relative; z-index: 1; }
    .soc-modal-text-content { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .soc-eyebrow-wrapper { display: flex; align-items: center; gap: 8px; }
    .soc-success-badge { font-family: monospace; font-size: 9px; background: #f0fdf4; color: #10b981; padding: 2px 6px; border-radius: 4px; font-weight: 800; border: 1px solid #bbf7d0; }
    .soc-success-eyebrow { font-family: monospace; font-size: 9.5px; font-weight: 800; color: #64748b; }
    .soc-modal-text-content h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }
    .soc-modal-text-content p { font-size: 13px; color: #475569; margin: 0; line-height: 1.5; }
    .soc-modal-footer { background: #f8fafc; padding: 18px 28px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
    .soc-protocol-id { font-family: monospace; font-size: 10px; color: #64748b; font-weight: 700; }
    .soc-modal-btn {
      background-color: #2B587D; color: #ffffff; border: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 6px 18px rgba(43, 88, 125, 0.35);
    }
    .soc-modal-btn:hover { background-color: #204461; transform: translateY(-1px); }

    /* ESTILOS DE PERFIL */
    .app-header { background-color: #2B587D; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; z-index: 10; }
    .app-content { flex: 1; overflow-y: auto; background-color: #D6C5B2; }
    .profile-container { max-width: 1000px; margin: 0 auto; padding: 20px 16px 100px 16px; display: flex; flex-direction: column; gap: 16px; }
    .profile-card { padding: 22px; display: flex; align-items: center; gap: 18px; }
    
    /* Contenedor del Logo en Perfil */
    .profile-avatar-img-wrapper { 
      width: 84px; 
      height: 84px; 
      background: #ffffff; 
      border-radius: 14px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      overflow: hidden; 
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(43, 88, 125, 0.12);
      flex-shrink: 0;
    }
    .profile-avatar-img { 
      width: 100%; 
      height: 100%; 
      object-fit: contain; 
      padding: 4px;
    }

    .profile-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .profile-header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    .profile-info h3 { font-size: 16px; font-weight: 800; color: #1e293b; margin: 0; }
    .operator-handle { font-size: 11px; color: #2B587D; font-weight: 600; }
    .terminal-badge-wrapper { display: flex; flex-direction: column; align-items: flex-end; }
    .terminal-label { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; }
    .terminal-badge { background: #06243D; color: #2B7C59; padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; border: 1px solid #2B587D; }
    .profile-meta-grid { display: flex; flex-direction: column; gap: 3px; font-size: 11.5px; }
    .meta-item { display: flex; gap: 6px; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-val { color: #334155; font-weight: 500; }
    .profile-status-row { display: flex; align-items: center; margin-top: 2px; }
    .badge-status { font-size: 10px; background: #f0fdf4; color: #10b981; padding: 3px 10px; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #bbf7d0; }
    .status-dot { width: 6px; height: 6px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 6px #10b981; }
    .section-box { padding: 18px 20px; display: flex; flex-direction: column; }
    .center-content-box { justify-content: flex-start; gap: 14px; }
    .section-box h4 { font-size: 13px; font-weight: 700; color: #2B587D; margin: 0 0 14px 0; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .credentials-grid { display: flex; flex-direction: column; gap: 10px; }
    .cred-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 11px 14px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #2B587D; font-size: 11px; }
    .cred-icon { color: #2B587D; font-size: 8px; margin-right: 6px; }
    .cred-title { font-weight: 600; color: #475569; display: flex; align-items: center; }
    .cred-desc { color: #2B587D; font-weight: 700; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; }
    .stat-item { background: #f8fafc; padding: 14px 8px; border-radius: 12px; border: 1px solid #e2e8f0; border-top: 3px solid #2B587D; }
    .stat-value { display: block; font-size: 17px; font-weight: 800; color: #2B587D; margin-bottom: 3px; }
    .stat-label { font-size: 10px; color: #64748b; font-weight: 600; }
    .modules-command-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .modules-subtitle { font-size: 10.5px; color: #64748b; margin: 2px 0 0 0; }
    .telemetry-pills-counter { background: #06243D; padding: 4px 10px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; border: 1px solid #2B587D; }
    .tele-val { font-size: 11px; font-weight: 800; color: #10b981; font-family: monospace; }
    .tele-lbl { font-size: 7.5px; color: #94a3b8; font-weight: 700; }
    .soc-progress-wrapper { background: #f8fafc; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 14px; }
    .soc-progress-info { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 700; color: #475569; margin-bottom: 6px; }
    .soc-progress-pct { color: #2B587D; font-family: monospace; }
    .progress-bar-container { width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #2B587D, #10b981); }
    .badges-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; max-height: 250px; overflow-y: auto; padding-right: 4px; }
    .module-badge-card { padding: 9px 12px; border-radius: 10px; font-size: 10.5px; font-weight: 600; border: 1.2px solid; display: flex; align-items: center; gap: 10px; }
    .badge-card-left { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .badge-id-code { font-family: monospace; font-size: 10px; font-weight: 700; color: #64748b; }
    .module-badge-card.unlocked { background: #f0fdf4; color: #065f46; border-color: #10b981; }
    .module-badge-card.locked { background: #f8fafc; color: #64748b; border-color: #e2e8f0; opacity: 0.75; }
    .badge-title-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
    .config-header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 14px; }
    .config-secure-tag { font-size: 9px; font-family: monospace; background: #06243D; color: #2B7C59; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
    .config-item-advanced { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 12px 14px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .config-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 3px; }
    .config-title { font-size: 12px; font-weight: 700; color: #1e293b; }
    .config-status-indicator { font-size: 8.5px; font-family: monospace; font-weight: 800; padding: 1px 6px; border-radius: 4px; background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
    .config-status-indicator.active { background: #f0fdf4; color: #10b981; border-color: #bbf7d0; }
    .config-desc { font-size: 10.5px; color: #64748b; margin: 0; }
    .switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 22px; }
    .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    input:checked + .slider { background-color: #2B587D; }
    input:checked + .slider:before { transform: translateX(18px); }
    .actions-box { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
    .btn-action { width: 100%; padding: 13px; border-radius: 12px; border: none; font-weight: 700; font-size: 12px; cursor: pointer; color: white; background-color: #2B587D; box-shadow: 0 4px 12px rgba(43, 88, 125, 0.25); }
    .btn-danger { width: 100%; padding: 12px; border-radius: 12px; border: none; font-weight: 700; font-size: 12px; cursor: pointer; color: #C13B3B; background-color: rgba(193, 59, 59, 0.1); }

    /* ESTILOS DE IMPRESIÓN PDF PROFESIONAL */
    @media print {
      @page {
        size: A4 landscape;
        margin: 0;
      }
      
      body, html, ion-app, app-root, .app-content, .profile-container, app-header, app-footer-nav {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      .cert-modal-backdrop {
        position: fixed !important;
        inset: 0 !important;
        background: #ffffff !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        visibility: visible !important;
        backdrop-filter: none !important;
      }

      .cert-modal-container {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        box-shadow: none !important;
        border: none !important;
        background: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        visibility: visible !important;
      }

      .cert-modal-toolbar {
        display: none !important;
      }

      #printableCertificate, #printableCertificate * {
        visibility: visible !important;
      }

      #printableCertificate {
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: 287mm !important;
        height: 200mm !important;
        margin: auto !important;
        border: 6px double #06243D !important;
        box-shadow: none !important;
        padding: 10mm 15mm !important;
        background: #ffffff !important;
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    @media (min-width: 900px) {
      .profile-container {
        max-width: 1000px;
        padding: 28px 28px 100px 28px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px 22px;
        align-items: start;
      }
      .profile-container > * { margin: 0 !important; }
      .profile-container > .profile-full-width { grid-column: 1 / -1; }
    }
  `],
  standalone: true,
  imports: [AppHeaderComponent, CommonModule, FormsModule, FooterNavComponent]
})
export class ProfilePage implements OnInit {
  audioEnabled: boolean = true;
  completedModulesCount: number = 0;
  
  showToast: boolean = false;
  toastMessage: string = '';

  showCertificateModal: boolean = false;
  selectedCertificateModule: string = '';

  get currentLanguage(): string { return this.lang.current; }

  operator = {
    name: 'Gabriela Balcazar C',
    nickname: 'Gaby',
    email: 'gabybalca15@gmail.com',
    role: 'Ingeniería de Sistemas / Ciberseguridad',
    idCode: 'SOC-2026-X9',
    university: 'Universidad Libre / Ingeniería de Sistemas',
    lastAccess: 'Sesión Activa - Hoy'
  };

  badges = [
    { 
      id: 1, 
      titleEs: 'Phishing Cotidiano y Suplantación SMTP', 
      titleEn: 'Everyday Phishing & SMTP Spoofing', 
      requiredModules: 1 
    },
    { 
      id: 2, 
      titleEs: 'Contraseñas Seguras y Credential Stuffing', 
      titleEn: 'Secure Passwords & Credential Stuffing', 
      requiredModules: 2 
    },
    { 
      id: 3, 
      titleEs: 'Ingeniería Social y Manipulación Conductual', 
      titleEn: 'Social Engineering & Behavioral Manipulation', 
      requiredModules: 3 
    },
    { 
      id: 4, 
      titleEs: 'Análisis de Malware y Software Malicioso', 
      titleEn: 'Malware Analysis & Malicious Software', 
      requiredModules: 4 
    },
    { 
      id: 5, 
      titleEs: 'Seguridad en Redes WiFi Públicas e Inalámbricas', 
      titleEn: 'Public & Wireless WiFi Network Security', 
      requiredModules: 5 
    },
    { 
      id: 6, 
      titleEs: 'Seguridad en Dispositivos Móviles y Endpoints', 
      titleEn: 'Mobile Device & Endpoint Security', 
      requiredModules: 6 
    },
    { 
      id: 7, 
      titleEs: 'Privacidad en Redes Sociales y OSINT Defensivo', 
      titleEn: 'Social Media Privacy & Defensive OSINT', 
      requiredModules: 7 
    },
    { 
      id: 8, 
      titleEs: 'Seguridad en Redes Domésticas y Dispositivos IoT', 
      titleEn: 'Home Network & IoT Device Security', 
      requiredModules: 8 
    },
    { 
      id: 9, 
      titleEs: 'Autenticación Multifactor (MFA) y Resistencia a Phishing', 
      titleEn: 'Multi-Factor Authentication (MFA) & Phishing Resistance', 
      requiredModules: 9 
    },
    { 
      id: 10, 
      titleEs: 'Defensa Integral contra Ransomware', 
      titleEn: 'Comprehensive Ransomware Defense', 
      requiredModules: 10 
    },
    { 
      id: 11, 
      titleEs: 'Privacidad, Túneles VPN y Protocolos Seguros', 
      titleEn: 'Privacy, VPN Tunnels & Secure Protocols', 
      requiredModules: 11 
    },
    { 
      id: 12, 
      titleEs: 'Criptografía Aplicada y Gestión de Claves', 
      titleEn: 'Applied Cryptography & Key Management', 
      requiredModules: 12 
    },
    { 
      id: 13, 
      titleEs: 'Seguridad en Correo Electrónico Corporativo (SPF, DKIM, DMARC)', 
      titleEn: 'Corporate Email Security (SPF, DKIM, DMARC)', 
      requiredModules: 13 
    },
    { 
      id: 14, 
      titleEs: 'Respuesta a Incidentes y Análisis Forense Digital', 
      titleEn: 'Incident Response & Digital Forensics', 
      requiredModules: 14 
    },
    { 
      id: 15, 
      titleEs: 'Hacking Ético y Pruebas de Penetración (Pentesting)', 
      titleEn: 'Ethical Hacking & Penetration Testing (Pentesting)', 
      requiredModules: 15 
    },
    { 
      id: 16, 
      titleEs: 'Modelado de Amenazas (Threat Modeling) y STRIDE', 
      titleEn: 'Threat Modeling & STRIDE', 
      requiredModules: 16 
    },
    { 
      id: 17, 
      titleEs: 'Gobernanza, Riesgo, Cumplimiento y Normativas (GRC)', 
      titleEn: 'Governance, Risk, Compliance & Regulations (GRC)', 
      requiredModules: 17 
    },
    { 
      id: 18, 
      titleEs: 'Seguridad en Biometría e Identidad Digital', 
      titleEn: 'Biometrics & Digital Identity Security', 
      requiredModules: 18 
    },
    { 
      id: 19, 
      titleEs: 'Análisis Forense en Navegadores Web y Artefactos de Usuario', 
      titleEn: 'Web Browser Forensics & User Artifacts', 
      requiredModules: 19 
    },
    { 
      id: 20, 
      titleEs: 'Resiliencia, Continuidad de Negocio y Recuperación ante Desastres (BCP/DRP)', 
      titleEn: 'Resilience, Business Continuity & Disaster Recovery (BCP/DRP)', 
      requiredModules: 20 
    },
    { 
      id: 21, 
      titleEs: 'Seguridad en Contenedores y Orquestación (Docker & Kubernetes)', 
      titleEn: 'Container Security & Orchestration (Docker & Kubernetes)', 
      requiredModules: 21 
    },
    { 
      id: 22, 
      titleEs: 'Arquitectura de Redes Seguras y Segmentación (Firewalls & IDS/IPS)', 
      titleEn: 'Secure Network Architecture & Segmentation (Firewalls & IDS/IPS)', 
      requiredModules: 22 
    },
    { 
      id: 23, 
      titleEs: 'Seguridad en APIs y Microservicios', 
      titleEn: 'API & Microservices Security', 
      requiredModules: 23 
    },
    { 
      id: 24, 
      titleEs: 'Seguridad en la Nube (Cloud Security & IAM)', 
      titleEn: 'Cloud Security & IAM', 
      requiredModules: 24 
    },
    { 
      id: 25, 
      titleEs: 'Seguridad en Bases de Datos y Prevención de SQL Injection', 
      titleEn: 'Database Security & SQL Injection Prevention', 
      requiredModules: 25 
    },
    { 
      id: 26, 
      titleEs: 'Vulnerabilidades Web OWASP Top 10: XSS e Inyección de Código', 
      titleEn: 'OWASP Top 10 Web Vulnerabilities: XSS & Code Injection', 
      requiredModules: 26 
    },
    { 
      id: 27, 
      titleEs: 'Seguridad en Tecnologías Operativas (OT) e Infraestructuras Críticas', 
      titleEn: 'Operational Technology (OT) & Critical Infrastructure Security', 
      requiredModules: 27 
    },
    { 
      id: 28, 
      titleEs: 'Seguridad en Cadenas de Suministro de Software y SBOM', 
      titleEn: 'Software Supply Chain Security & SBOM', 
      requiredModules: 28 
    },
    { 
      id: 29, 
      titleEs: 'Seguridad en Arquitecturas Serverless y FaaS', 
      titleEn: 'Serverless & FaaS Architecture Security', 
      requiredModules: 29 
    },
    { 
      id: 30, 
      titleEs: 'Seguridad en Ciberinteligencia (Threat Intelligence) y SOC', 
      titleEn: 'Threat Intelligence & SOC Security', 
      requiredModules: 30 
    },
    { 
      id: 31, 
      titleEs: 'Ingeniería Inversa y Análisis Dinámico de Binarios', 
      titleEn: 'Reverse Engineering & Dynamic Binary Analysis', 
      requiredModules: 31 
    },
    { 
      id: 32, 
      titleEs: 'Seguridad en Desarrollo Seguro y DevSecOps', 
      titleEn: 'Secure Development & DevSecOps Security', 
      requiredModules: 32 
    },
    { 
      id: 33, 
      titleEs: 'Seguridad en Sistemas Operativos Windows y Active Directory', 
      titleEn: 'Windows OS Security & Active Directory', 
      requiredModules: 33 
    },
    { 
      id: 34, 
      titleEs: 'Seguridad en Criptomonedas, Blockchain y Smart Contracts', 
      titleEn: 'Cryptocurrency, Blockchain & Smart Contract Security', 
      requiredModules: 34 
    },
    { 
      id: 35, 
      titleEs: 'Seguridad en Inteligencia Artificial y Machine Learning', 
      titleEn: 'Artificial Intelligence & Machine Learning Security', 
      requiredModules: 35 
    },
    { 
      id: 36, 
      titleEs: 'Seguridad en Redes Inalámbricas Avanzadas (WPA3 y Enterprise)', 
      titleEn: 'Advanced Wireless Network Security (WPA3 & Enterprise)', 
      requiredModules: 36 
    },
    { 
      id: 37, 
      titleEs: 'Forense en Memoria RAM y Análisis de Volatilidad', 
      titleEn: 'RAM Memory Forensics & Volatility Analysis', 
      requiredModules: 37 
    },
    { 
      id: 38, 
      titleEs: 'Ciberseguridad en Entornos Financieros y Pasarelas de Pago', 
      titleEn: 'Cybersecurity in Financial Environments & Payment Gateways', 
      requiredModules: 38 
    },
    { 
      id: 39, 
      titleEs: 'Ciberseguridad en Redes 5G y Telecomunicaciones', 
      titleEn: 'Cybersecurity in 5G Networks & Telecommunications', 
      requiredModules: 39 
    },
    { 
      id: 40, 
      titleEs: 'Vulnerabilidades Web: CSRF y SSRF', 
      titleEn: 'Web Vulnerabilities: CSRF & SSRF', 
      requiredModules: 40 
    },
    { 
      id: 41, 
      titleEs: 'Ciberseguridad en Entornos Multicloud y Zero Trust Architecture', 
      titleEn: 'Cybersecurity in Multicloud Environments & Zero Trust Architecture', 
      requiredModules: 41 
    },
    { 
      id: 42, 
      titleEs: 'Ciberseguridad en Sistemas Embebidos y Dispositivos Médicos (IoMT)', 
      titleEn: 'Cybersecurity in Embedded Systems & Medical Devices (IoMT)', 
      requiredModules: 42 
    },
    { 
      id: 43, 
      titleEs: 'Hacking de Radiofrecuencia, SDR y Redes Satelitales', 
      titleEn: 'Radio Frequency Hacking, SDR & Satellite Networks', 
      requiredModules: 43 
    },
    { 
      id: 44, 
      titleEs: 'Análisis de Vulnerabilidades en Firmware y Dispositivos de Red', 
      titleEn: 'Firmware & Network Device Vulnerability Analysis', 
      requiredModules: 44 
    },
    { 
      id: 45, 
      titleEs: 'Hacking de Virtualización y Escape de Hipervisores', 
      titleEn: 'Virtualization Hacking & Hypervisor Escape', 
      requiredModules: 45 
    },
    { 
      id: 46, 
      titleEs: 'Seguridad en Sistemas Operativos Linux (Hardening)', 
      titleEn: 'Linux OS Security (Hardening)', 
      requiredModules: 46 
    },
    { 
      id: 47, 
      titleEs: 'Evasión de Antivirus, EDR y Ofuscación de Payloads', 
      titleEn: 'Antivirus Evasion, EDR & Payload Obfuscation', 
      requiredModules: 47 
    },
    { 
      id: 48, 
      titleEs: 'Seguridad en Arquitecturas de Identidad y SSO (SAML, OAuth2, OIDC)', 
      titleEn: 'Identity Architecture & SSO Security (SAML, OAuth2, OIDC)', 
      requiredModules: 48 
    },
    { 
      id: 49, 
      titleEs: 'Seguridad en Criptografía Post-Cuántica e Infraestructura PKI', 
      titleEn: 'Post-Quantum Cryptography & PKI Infrastructure Security', 
      requiredModules: 49 
    },
    { 
      id: 50, 
      titleEs: 'Tendencias Emergentes, Guerra Digital y Ciberseguridad Futura', 
      titleEn: 'Emerging Trends, Digital Warfare & Future Cybersecurity', 
      requiredModules: 50 
    }
  ];

  constructor(private router: Router, private lang: LanguageService) {}

  ngOnInit() {
    const savedName = localStorage.getItem('userName');
    const savedNickname = localStorage.getItem('userNickname');
    
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.name) this.operator.name = data.name;
        if (data.nickname) this.operator.nickname = data.nickname;
        if (data.email) this.operator.email = data.email;
        // 🎯 MEJORA: Cargamos el rol y la institución/universidad desde la sesión real del usuario
        if (data.role) this.operator.role = data.role;
        if (data.university) this.operator.university = data.university;
      } catch (e) {}
    }

    if (savedName) this.operator.name = savedName;
    if (savedNickname) this.operator.nickname = savedNickname;

    // También verificamos si están guardados en llaves individuales independientes
    const savedRole = localStorage.getItem('userDegree');
    if (savedRole) {
      this.operator.role = `${savedRole} / Ciberseguridad`;
    }

    const savedUniversity = localStorage.getItem('userUniversity');
    const savedDegree = localStorage.getItem('userDegree');
    if (savedUniversity && savedDegree) {
      this.operator.university = `${savedUniversity} / ${savedDegree}`;
    }

    const savedAudioSetting = localStorage.getItem('audioEnabled');
    if (savedAudioSetting !== null) {
      this.audioEnabled = savedAudioSetting === 'true';
    }

    this.loadUserProgress();
  }

  loadUserProgress() {
    const savedCompleted = localStorage.getItem('completed_modules_count');
    this.completedModulesCount = savedCompleted ? Number(savedCompleted) : 0;
  }

  isUnlocked(requiredModules: number): boolean {
    return this.completedModulesCount >= requiredModules;
  }

  getDynamicClearanceLevel(): string {
    if (this.completedModulesCount >= 45) return 'Nivel Élite (SOC Master)';
    if (this.completedModulesCount >= 30) return 'Nivel 3 (Avanzado)';
    if (this.completedModulesCount >= 15) return 'Nivel 2 (Intermedio)';
    if (this.completedModulesCount >= 1) return 'Nivel 1 (Fundamentos)';
    return 'Acceso Inicial (0 Módulos)';
  }

  getCompletionPercentage(): number {
    return Math.round((this.completedModulesCount / 50) * 100);
  }

  saveProfileChanges() {
    localStorage.setItem('audioEnabled', String(this.audioEnabled));
    localStorage.setItem('userName', this.operator.name);
    localStorage.setItem('userNickname', this.operator.nickname);
    
    // 🎯 MEJORA: Mantenemos el rol y la universidad intactos al guardar cambios en el perfil
    localStorage.setItem('user_session', JSON.stringify({
      name: this.operator.name,
      nickname: this.operator.nickname,
      email: this.operator.email,
      role: this.operator.role,
      university: this.operator.university,
      idCode: this.operator.idCode,
      clearance: this.getDynamicClearanceLevel()
    }));

    this.toastMessage = this.currentLanguage === 'en' 
      ? 'Your progress, secure telemetry, and audio preferences have been saved successfully.' 
      : 'Tu proceso, la telemetría segura y las preferencias de audio se han guardado correctamente.';
    
    this.showToast = true;
  }

  closeModal() {
    this.showToast = false;
  }

  openCertificate(moduleTitle: string) {
    this.selectedCertificateModule = moduleTitle;
    this.showCertificateModal = true;
  }

  closeCertificateModal() {
    this.showCertificateModal = false;
  }

  printCertificate() {
    window.print();
  }

  logoutSession() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDegree');
    localStorage.removeItem('userUniversity');
    localStorage.removeItem('userSemester');
    localStorage.removeItem('user_session');
    localStorage.removeItem('audioEnabled');
    
    this.router.navigate(['/auth'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }
}
