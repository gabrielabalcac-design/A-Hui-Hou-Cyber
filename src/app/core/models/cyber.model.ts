export interface Evidencia {
  id: string;
  titulo: string;
  contenido: string; // Payload ofuscado o fragmento forense
  pistaExplicativa: string;
}

export interface OpcionPregunta {
  id: string;
  texto: string;
  esCorrecta: boolean;
  explicacion: string;
}

export interface Expediente {
  id: string;
  numero: string;
  titulo: string;
  categoria: 'phishing' | 'malware' | 'ransomware' | 'mitm' | 'usb' | 'social';
  dificultad: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  cvssScore: number; // Ej: 9.8
  vectorCvss: string; // Ej: CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H
  resumen: string;
  evidencias: Evidencia[];
  preguntaFinal: {
    enunciado: string;
    opciones: OpcionPregunta[];
  };
  xpRecompensa: number;
  completado: boolean;
}

export interface AgentePerfil {
  nombre: string;
  rango: 'Analista SOC Tier 1' | 'Responder de Incidentes DFIR' | 'Threat Hunter' | 'Director de Ciberinteligencia';
  xp: number;
  nivelProgreso: number;
  insignias: { id: string; nombre: string; icono: string; descripcion: string; desbloqueada: boolean }[];
}

export interface LogSistema {
  timestamp: string;
  tipo: 'INFO' | 'SUCCESS' | 'ERROR' | 'ALERT_RED';
  mensaje: string;
}