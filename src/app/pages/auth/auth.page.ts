import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { AnalyticsService } from '../../services/analytics';

// 1. Importaciones de Firebase Auth y Realtime Database
import { sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../../firebase/firebase.config';

@Component({
  selector: 'app-auth',
  template: `
    <div class="auth-container">
      <div class="auth-card" [class.register-mode]="!isLogin">
        
        <!-- Selector de Idioma Minimalista -->
        <div class="language-selector">
          <button type="button" class="lang-btn" (click)="switchLanguage('es')">ES 🇪🇸</button>
          <span class="divider">|</span>
          <button type="button" class="lang-btn" (click)="switchLanguage('en')">EN 🇺🇸</button>
        </div>

        <div class="auth-header">
          <div class="logo-wrapper">
            <img src="assets/A Hui Hou Cyber...jpg" alt="A Hui Hou Cyber Logo" class="logo-img">
          </div>
          
          <div class="title-image-wrapper">
            <img src="assets/A Hui Hou Cyber;.jpg" alt="A Hui Hou Cyber" class="title-img">
          </div>
          
          <p>{{ 'SUBTITLE' | translate }}</p>
        </div>

        <div class="tabs">
          <button [class.active]="isLogin" (click)="isLogin = true">{{ 'LOGIN' | translate }}</button>
          <button [class.active]="!isLogin" (click)="isLogin = false">{{ 'REGISTER' | translate }}</button>
        </div>

        <form (ngSubmit)="onSubmit()">
          
          <!-- CAMPOS EXCLUSIVOS PARA CREAR CUENTA -->
          <ng-container *ngIf="!isLogin">
            <div class="input-group">
              <label>{{ 'FULL_NAME' | translate }}</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" [placeholder]="'PLACEHOLDER_FULL_NAME' | translate" required>
            </div>

            <div class="input-row">
              <div class="input-group half">
                <label>{{ 'SUBNAME' | translate }}</label>
                <input type="text" [(ngModel)]="subname" name="subname" [placeholder]="'PLACEHOLDER_SUBNAME' | translate" required>
              </div>
              <div class="input-group half">
                <label>{{ 'EMAIL' | translate }}</label>
                <input type="email" [(ngModel)]="email" name="email" [placeholder]="'PLACEHOLDER_EMAIL_FORMAT' | translate" required>
              </div>
            </div>

            <div class="input-group">
              <label>{{ 'DEGREE' | translate }}</label>
              <input type="text" [(ngModel)]="degree" name="degree" [placeholder]="'PLACEHOLDER_DEGREE' | translate" required>
            </div>

            <div class="input-row">
              <div class="input-group half">
                <label>{{ 'UNIVERSITY' | translate }}</label>
                <input type="text" [(ngModel)]="university" name="university" [placeholder]="'PLACEHOLDER_UNIVERSITY' | translate" required>
              </div>
              <div class="input-group half">
                <label>{{ 'SEMESTER' | translate }}</label>
                <input type="text" [(ngModel)]="semester" name="semester" [placeholder]="'PLACEHOLDER_SEMESTER' | translate" required>
              </div>
            </div>
          </ng-container>

          <!-- CAMPOS PARA LOGIN -->
          <ng-container *ngIf="isLogin">
            <div class="input-group">
              <label>{{ 'SUBNAME_LOGIN' | translate }}</label>
              <input type="text" [(ngModel)]="subname" name="subname" [placeholder]="'PLACEHOLDER_SUBNAME' | translate" required>
            </div>
          </ng-container>

          <!-- Contraseña -->
          <div class="input-group">
            <label>{{ 'PASSWORD' | translate }}</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>

          <!-- ENLACE DE RECUPERACIÓN DE CONTRASEÑA -->
          <div class="forgot-password-container" *ngIf="isLogin">
            <a type="button" class="forgot-password-link" (click)="openForgotModal()">
              {{ 'FORGOT_PASSWORD' | translate }}
            </a>
          </div>

          <button type="submit" class="btn-submit">
            {{ isLogin ? ('SUBMIT_LOGIN' | translate) : ('SUBMIT_REGISTER' | translate) }}
          </button>

        </form>

        <p class="footer-note">{{ 'FOOTER_NOTE' | translate }}</p>

      </div>
    </div>

    <!-- MODAL CYBER-SOC PROFESIONAL Y ESTILIZADO -->
    <div class="custom-modal-backdrop" *ngIf="showForgotModal">
      <div class="custom-modal-card">
        
        <!-- BARRA SUPERIOR TECNOLÓGICA TIPO SOC -->
        <div class="soc-top-bar">
          <div class="soc-status">
            <span class="pulse-dot"></span>
            <span class="soc-text">SECURE PROTOCOL // SSL-256</span>
          </div>
          <button type="button" class="soc-close-btn" (click)="closeForgotModal()">✕</button>
        </div>

        <div class="modal-body-content">
          <div class="modal-icon-header">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B587D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          
          <h3>{{ isSpanish ? 'Restauración de Credenciales' : 'Credential Restoration' }}</h3>
          <p>{{ isSpanish ? 'Ingrese su dirección de correo institucional para recibir el token de recuperación cifrado.' : 'Enter your institutional email address to receive the encrypted recovery token.' }}</p>

          <!-- Mensaje de éxito -->
          <div class="success-banner" *ngIf="resetSuccess">
            ✓ {{ isSpanish ? 'Instrucciones enviadas exitosamente a tu correo.' : 'Instructions successfully sent to your email.' }}
          </div>

          <!-- Mensaje de error -->
          <div class="error-banner" *ngIf="resetError">
            ⚠ {{ isSpanish ? 'Ocurrió un error o el correo no está registrado.' : 'An error occurred or the email is not registered.' }}
          </div>

          <div class="input-group" style="text-align: left; margin-bottom: 20px;" *ngIf="!resetSuccess">
            <label style="display: block; font-size: 11px; font-weight: 700; color: #2B587D; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
              {{ isSpanish ? 'Correo Electrónico' : 'Email Address' }}
            </label>
            <input type="email" [(ngModel)]="forgotEmail" [placeholder]="isSpanish ? 'usuario@universidad.edu' : 'user@university.edu'">
          </div>

          <div class="modal-buttons" *ngIf="!resetSuccess">
            <button type="button" class="btn-cancel" (click)="closeForgotModal()">
              {{ isSpanish ? 'Cancelar' : 'Cancel' }}
            </button>
            <button type="button" class="btn-confirm" (click)="submitForgotPassword()">
              {{ isSpanish ? 'Enviar Instrucciones' : 'Send Instructions' }}
            </button>
          </div>

          <div class="modal-buttons" *ngIf="resetSuccess">
            <button type="button" class="btn-confirm" style="width: 100%; flex: none;" (click)="closeForgotModal()">
              {{ isSpanish ? 'Entendido' : 'Got it' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      background-color: #D6C5B2;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
      padding: 15px 0;
    }
    .auth-container {
      width: 100%;
      max-width: 480px;
      padding: 16px;
    }
    .auth-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 22px 28px 26px 28px;
      box-shadow: 0 12px 35px rgba(43,88,125,0.18);
      border-top: 6px solid #2B587D;
      position: relative;
      transition: all 0.3s ease;
    }
    .auth-card.register-mode {
      max-height: 90vh;
      overflow-y: auto;
      padding-right: 18px;
    }
    .auth-card.register-mode::-webkit-scrollbar {
      width: 5px;
    }
    .auth-card.register-mode::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }

    .language-selector {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-bottom: 6px;
    }
    .lang-btn {
      background: transparent;
      border: none;
      font-size: 11px;
      font-weight: 700;
      color: #2B587D;
      cursor: pointer;
      padding: 2px 4px;
    }
    .lang-btn:hover {
      text-decoration: underline;
    }
    .divider {
      font-size: 11px;
      color: #ccc;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 12px;
    }
    .logo-wrapper {
      width: 110px;
      height: 90px;
      margin: 0 auto 4px auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .title-image-wrapper {
      width: 100%;
      max-height: 38px;
      margin: 2px 0 2px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title-img {
      width: 100%;
      max-height: 34px;
      object-fit: contain;
    }
    .auth-header p {
      font-size: 11px;
      color: #666;
      margin: 2px 0 0 0;
    }
    .tabs {
      display: flex;
      background: #f4f6f8;
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 14px;
    }
    .tabs button {
      flex: 1;
      background: transparent;
      border: none;
      padding: 7px;
      font-size: 12.5px;
      font-weight: 600;
      color: #666;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tabs button.active {
      background: #2B587D;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(43,88,125,0.2);
    }
    .input-group {
      margin-bottom: 9px;
    }
    .input-row {
      display: flex;
      gap: 10px;
    }
    .input-group.half {
      flex: 1;
    }
    .input-group label {
      display: block;
      font-size: 10.5px;
      font-weight: 700;
      color: #333;
      margin-bottom: 2px;
    }
    .input-group input {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      background-color: #fafbfc;
      color: #2B3A4A;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .input-group input::placeholder {
      color: #94a3b8;
    }
    .input-group input:focus {
      border-color: #2B587D;
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(43,88,125,0.1);
    }
    .forgot-password-container {
      text-align: right;
      margin-top: 2px;
      margin-bottom: 10px;
    }
    .forgot-password-link {
      font-size: 11.5px;
      color: #2B587D;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }
    .forgot-password-link:hover {
      text-decoration: underline;
    }
    .btn-submit {
      width: 100%;
      background: #2B7C59;
      color: #ffffff;
      border: none;
      border-radius: 11px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 4px;
      box-shadow: 0 4px 12px rgba(43,124,89,0.3);
      padding: 11px;
      transition: opacity 0.2s;
    }
    .btn-submit:hover {
      opacity: 0.95;
    }
    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #888;
      margin-top: 10px;
      margin-bottom: 0;
    }

    /* MODAL CYBER-SOC AVANZADO */
    .custom-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(11, 19, 32, 0.75);
      backdrop-filter: blur(6px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 16px;
    }
    .custom-modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 440px;
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(6, 36, 61, 0.4);
      border-top: 6px solid #2B587D;
      overflow: hidden;
      position: relative;
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .soc-top-bar {
      background: #06101B;
      padding: 9px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(43, 88, 125, 0.2);
    }
    .soc-status {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background-color: #2B7C59;
      border-radius: 50%;
      box-shadow: 0 0 8px #2B7C59;
      animation: pulseAnim 1.5s infinite;
    }
    @keyframes pulseAnim {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
      100% { opacity: 1; transform: scale(1); }
    }
    .soc-text {
      font-size: 10px;
      font-weight: 700;
      color: #7AA77A;
      letter-spacing: 0.8px;
      font-family: monospace;
    }
    .soc-close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.2s;
    }
    .soc-close-btn:hover {
      color: #ffffff;
    }

    .modal-body-content {
      padding: 28px 28px 30px 28px;
      background: #ffffff;
    }

    .modal-icon-header {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, rgba(43,88,125,0.08), rgba(43,124,89,0.08));
      border: 1px solid rgba(43,88,125,0.15);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }
    .custom-modal-card h3 {
      color: #06243D;
      font-size: 19px;
      font-weight: 700;
      text-align: center;
      margin: 0 0 8px 0;
      letter-spacing: -0.3px;
    }
    .custom-modal-card p {
      color: #64748b;
      font-size: 13px;
      text-align: center;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .success-banner {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 20px;
    }

    .error-banner {
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 16px;
    }

    .custom-modal-card input {
      width: 100%;
      height: 46px;
      padding: 0 16px;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      font-size: 13.5px;
      background-color: #f8fafc;
      color: #06243D;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    .custom-modal-card input:focus {
      border-color: #2B587D;
      background-color: #ffffff;
      box-shadow: 0 0 0 4px rgba(43, 88, 125, 0.12);
    }
    .modal-buttons {
      display: flex;
      gap: 12px;
      margin-top: 6px;
    }
    .btn-cancel {
      flex: 1;
      height: 46px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-cancel:hover {
      background: #e2e8f0;
    }
    .btn-confirm {
      flex: 1.3;
      height: 46px;
      background: #2B7C59;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(43, 124, 89, 0.3);
      transition: opacity 0.2s;
    }
    .btn-confirm:hover {
      opacity: 0.94;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe]
})
export class AuthPage {
  isLogin = true;
  
  // Campos del formulario
  fullName = '';
  subname = '';
  email = '';
  degree = '';
  university = '';
  semester = '';
  password = '';

  // Modal de recuperación
  showForgotModal = false;
  forgotEmail = '';
  resetSuccess = false;
  resetError = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private navCtrl: NavController,
    private analytics: AnalyticsService
  ) {
    // Traducción Español
    this.translate.setTranslation('es', {
      'SUBTITLE': 'Plataforma educativa de ciberseguridad',
      'LOGIN': 'Iniciar Sesión',
      'REGISTER': 'Crear Cuenta',
      'FULL_NAME': 'Nombres y Apellidos Completos',
      'PLACEHOLDER_FULL_NAME': 'Ej. User',
      'SUBNAME': 'Subnombre (Apodo)',
      'SUBNAME_LOGIN': 'Subnombre de Acceso',
      'PLACEHOLDER_SUBNAME': 'Ej. User123',
      'EMAIL': 'Correo Electrónico',
      'PLACEHOLDER_EMAIL_FORMAT': 'Ej. User@gmail.com',
      'DEGREE': 'Carrera / Titulación',
      'PLACEHOLDER_DEGREE': 'Ej. Ingeniería de Sistemas',
      'UNIVERSITY': 'Universidad',
      'PLACEHOLDER_UNIVERSITY': 'Ej. Universidad Libre',
      'SEMESTER': 'Semestre',
      'PLACEHOLDER_SEMESTER': 'Ej. 7° Semestre',
      'PASSWORD': 'Contraseña',
      'FORGOT_PASSWORD': '¿Olvidaste tu contraseña?',
      'SUBMIT_LOGIN': 'Entrar al Sistema',
      'SUBMIT_REGISTER': 'Registrarse y Empezar',
      'FOOTER_NOTE': 'Seguridad y cifrado académico local.'
    }, true);

    // Traducción Inglés
    this.translate.setTranslation('en', {
      'SUBTITLE': 'Educational cybersecurity platform',
      'LOGIN': 'Log In',
      'REGISTER': 'Create Account',
      'FULL_NAME': 'Full Name and Last Name',
      'PLACEHOLDER_FULL_NAME': 'Ex. User',
      'SUBNAME': 'Subname (Nickname)',
      'SUBNAME_LOGIN': 'Access Subname',
      'PLACEHOLDER_SUBNAME': 'Ex. User123',
      'EMAIL': 'Email Address',
      'PLACEHOLDER_EMAIL_FORMAT': 'Ex. user@gmail.com',
      'DEGREE': 'Academic Degree / Major',
      'PLACEHOLDER_DEGREE': 'Ex. Systems Engineering',
      'UNIVERSITY': 'University',
      'PLACEHOLDER_UNIVERSITY': 'Ex. Libre University',
      'SEMESTER': 'Semester',
      'PLACEHOLDER_SEMESTER': 'Ex. 7th Semester',
      'PASSWORD': 'Password',
      'FORGOT_PASSWORD': 'Forgot your password?',
      'SUBMIT_LOGIN': 'Enter System',
      'SUBMIT_REGISTER': 'Register & Start',
      'FOOTER_NOTE': 'Local academic security and encryption.'
    }, true);

    this.translate.use('es');
  }

  get isSpanish(): boolean {
    const lang = this.translate.currentLang;
    return (typeof lang === 'function' ? lang() : lang) === 'es';
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  openForgotModal() {
    this.forgotEmail = '';
    this.resetSuccess = false;
    this.resetError = false;
    this.showForgotModal = true;
  }

  closeForgotModal() {
    this.showForgotModal = false;
  }

  // Método de envío para recuperar contraseña desde Firebase
  async submitForgotPassword() {
    if (this.forgotEmail && this.forgotEmail.trim() !== '') {
      this.resetError = false;
      
      try {
        await sendPasswordResetEmail(auth, this.forgotEmail.trim());

        this.analytics.trackEvent(
          'password_reset_request',
          'Authentication',
          `Email: ${this.forgotEmail}`
        );

        this.resetSuccess = true;
      } catch (error: any) {
        console.error('Error enviando correo de recuperación desde Firebase:', error);
        this.resetError = true;
      }

    } else {
      this.resetError = true;
    }
  }

  // Método principal de Login y Registro
  async onSubmit() {
    // Limpiamos el apodo ingresado quitando cualquier '@' adicional
    const cleanSubname = this.subname.replace('@', '').trim();

    if (this.isLogin) {
      if (cleanSubname && this.password) {
        localStorage.setItem('userName', cleanSubname);
        localStorage.setItem('userNickname', cleanSubname);
        
        const existingSession = localStorage.getItem('user_session');
        let sessionData: any = existingSession ? JSON.parse(existingSession) : {};

        localStorage.setItem('user_session', JSON.stringify({
          ...sessionData,
          name: sessionData.name || cleanSubname,
          nickname: cleanSubname,
          role: sessionData.role || 'Ingeniería de Sistemas / Ciberseguridad',
          university: sessionData.university || 'Universidad Libre / Ingeniería de Sistemas'
        }));

        this.analytics.trackEvent(
          'user_login',
          'Authentication',
          `Subnombre: ${cleanSubname}`
        );

        this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });
      } else {
        alert('Por favor ingresa tu subnombre y contraseña.');
      }
    } else {
      // PROCESO DE REGISTRO
      if (
        this.fullName.trim() && 
        cleanSubname && 
        this.email.trim() && 
        this.degree.trim() && 
        this.university.trim() && 
        this.semester.trim() && 
        this.password
      ) {
        try {
          // 🚀 1. Registramos el usuario en Firebase Authentication y obtenemos su UID
          const userCredential = await createUserWithEmailAndPassword(auth, this.email.trim(), this.password);
          const uid = userCredential.user.uid;

          // 📂 2. Guardamos los datos detallados del perfil en Realtime Database
          await set(ref(db, 'users/' + uid), {
            fullName: this.fullName.trim(),
            subname: cleanSubname,
            email: this.email.trim(),
            degree: this.degree.trim(),
            university: this.university.trim(),
            semester: this.semester.trim(),
            createdAt: new Date().toISOString()
          });

          // 3. Guardamos la sesión localmente sin el carácter '@'
          localStorage.removeItem('completed_course_ids');
          localStorage.removeItem('completed_modules_count');
          localStorage.setItem('user_streak', '0');

          localStorage.setItem('userName', this.fullName);
          localStorage.setItem('userNickname', cleanSubname);
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userDegree', this.degree);
          localStorage.setItem('userUniversity', this.university);
          localStorage.setItem('userSemester', this.semester);

          const institutionFull = `${this.university} / ${this.degree}`;
          const dynamicRole = `${this.degree} / Ciberseguridad`;

          localStorage.setItem('user_session', JSON.stringify({
            name: this.fullName,
            nickname: cleanSubname,
            email: this.email,
            degree: this.degree,
            university: institutionFull,
            semester: this.semester,
            role: dynamicRole
          }));

          this.analytics.trackEvent(
            'user_sign_up',
            'Authentication',
            `Carrera: ${this.degree} | Universidad: ${this.university}`
          );

          // 4. Redirigimos al Home
          this.navCtrl.navigateRoot('/home', { animationDirection: 'forward' });

        } catch (error: any) {
          console.error('Error al registrar usuario en Firebase:', error);
          if (error.code === 'auth/email-already-in-use') {
            alert('Este correo electrónico ya se encuentra registrado.');
          } else if (error.code === 'auth/weak-password') {
            alert('La contraseña debe tener al menos 6 caracteres.');
          } else {
            alert('Ocurrió un error al crear la cuenta. Inténtalo de nuevo.');
          }
        }
      } else {
        alert('Por favor completa todos los campos requeridos para crear tu cuenta.');
      }
    }
  }
}