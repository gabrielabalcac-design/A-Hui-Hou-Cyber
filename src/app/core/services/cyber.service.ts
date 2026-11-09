import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  name: string;
  alias: string;
  level: string;
  xp: number;
  streak: number;
  casesCompleted: number;
  badges: { title: string; icon: string; unlocked: boolean }[];
}

export interface CyberCase {
  id: string;
  title: string;
  category: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  completed: boolean;
  evidence: { type: 'email' | 'log' | 'chat'; content: string }[];
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CyberService {
  private userProfileKey = 'ahh_user_profile';
  private casesKey = 'ahh_cases_data';

  private profileSubject = new BehaviorSubject<UserProfile>(this.loadProfile());
  public profile$ = this.profileSubject.asObservable();

  private cases: CyberCase[] = [
    {
      id: 'case-1',
      title: 'El Falso Soporte de TI (Phishing)',
      category: 'Phishing',
      difficulty: 'Básico',
      description: 'Un empleado recibió un correo urgente supuestamente del departamento de sistemas solicitando actualizar credenciales bajo amenaza de suspender su cuenta.',
      completed: false,
      evidence: [
        { type: 'email', content: 'De: soporte-it@micros0ft-security.com\nAsunto: URGENTE: Restablezca su contraseña\n\nEstimado usuario, su cuenta expirará hoy. Haga clic aquí para mantenerla activa.' }
      ],
      questions: [
        {
          prompt: '¿Cuál es el indicador más evidente de que este correo es un ataque de phishing?',
          options: [
            'El uso de la palabra "urgente".',
            'El dominio del remitente ("micros0ft-security.com" con cero en lugar de o).',
            'Que el correo fue enviado en horario laboral.'
          ],
          correctIndex: 1,
          explanation: 'Los atacantes suelen usar typosquatting (dominio falso que imita a una marca legítima) para engañar al usuario.'
        }
      ]
    },
    {
      id: 'case-2',
      title: 'La Llamada al Director (Ingeniería Social)',
      category: 'Ingeniería Social',
      difficulty: 'Intermedio',
      description: 'Una persona llamó a la recepción haciéndose pasar por el Director General exigiendo las llaves de acceso al servidor de bases de datos.',
      completed: false,
      evidence: [
        { type: 'chat', content: 'Atacante: "Hola, habla el Director. Estoy en una junta urgente y necesito que me dictes el código de acceso temporal de la VPN ya mismo."' }
      ],
      questions: [
        {
          prompt: '¿Qué protocolo de seguridad debió aplicar el recepcionista ante esta llamada?',
          options: [
            'Dar el código inmediatamente por respeto a la jerarquía.',
            'Colgar y verificar la identidad llamando de vuelta por canales oficiales internos.',
            'Publicar el incidente en redes sociales.'
          ],
          correctIndex: 1,
          explanation: 'La verificación de identidad mediante un canal secundario oficial neutraliza los ataques de suplantación telefónica (Vishing).'
        }
      ]
    }
  ];

  constructor() {
    if (!localStorage.getItem(this.casesKey)) {
      localStorage.setItem(this.casesKey, JSON.stringify(this.cases));
    } else {
      this.cases = JSON.parse(localStorage.getItem(this.casesKey)!);
    }
  }

  private loadProfile(): UserProfile {
    const saved = localStorage.getItem(this.userProfileKey);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
      name: '',
      alias: '',
      level: 'Novato en Ciberseguridad',
      xp: 0,
      streak: 1,
      casesCompleted: 0,
      badges: [
        { title: 'Primer Analista', icon: 'shield-checkmark', unlocked: false },
        { title: 'Cazador de Phishing', icon: 'mail-unread', unlocked: false }
      ]
    };
  }

  saveProfile(name: string, alias: string) {
    const profile = this.profileSubject.value;
    profile.name = name;
    profile.alias = alias;
    localStorage.setItem(this.userProfileKey, JSON.stringify(profile));
    this.profileSubject.next(profile);
  }

  addXpAndCompleteCase(caseId: string) {
    const profile = this.profileSubject.value;
    profile.xp += 150;
    profile.casesCompleted += 1;
    if (profile.xp >= 300) profile.level = 'Analista SOC Junior';
    
    // Desbloquear medallas
    if (profile.casesCompleted >= 1) profile.badges[0].unlocked = true;
    if (profile.casesCompleted >= 2) profile.badges[1].unlocked = true;

    localStorage.setItem(this.userProfileKey, JSON.stringify(profile));
    this.profileSubject.next(profile);

    // Marcar caso como completado
    const target = this.cases.find(c => c.id === caseId);
    if (target) target.completed = true;
    localStorage.setItem(this.casesKey, JSON.stringify(this.cases));
  }

  getCases(): CyberCase[] {
    return JSON.parse(localStorage.getItem(this.casesKey) || JSON.stringify(this.cases));
  }
}