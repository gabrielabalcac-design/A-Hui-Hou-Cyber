import { Injectable } from '@angular/core';

interface LessonOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface Lesson {
  id: string;
  title: string;
  caseDescription: string;
  hint: string;
  question: string;
  options: LessonOption[];
  points: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  isTerminalChallenge?: boolean;
  lessons: Lesson[];
}

interface UserProfile {
  name: string;
  points: number;
  streak: number;
  badges: string[];
  completedLessons: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private modules: Module[] = [
    {
      id: 'mod-1',
      title: 'Phishing Cotidiano',
      description: 'Aprende a identificar correos sospechosos de supuestas entidades bancarias.',
      icon: 'mail-unread-outline',
      lessons: [
        {
          id: 'les-1',
          title: 'El correo urgente del banco',
          caseDescription: 'Recibes un correo de "Soporte-BancoSeguro" indicando que tu cuenta será bloqueada en 24 horas si no haces clic en el enlace adjunto para verificar tus datos.',
          hint: 'Observa detenidamente la dirección del remitente y busca faltas de ortografía o urgencia excesiva.',
          question: '¿Qué acción deberías tomar inmediatamente?',
          options: [
            { text: 'Hacer clic rápido en el enlace para evitar que bloqueen mi cuenta.', isCorrect: false, feedback: 'Incorrecto. Los ciberdelincuentes usan la urgencia para que actúes sin pensar.' },
            { text: 'Ignorar el enlace del correo y entrar a la banca en línea escribiendo la dirección oficial en el navegador.', isCorrect: true, feedback: '¡Correcto! Verificar directamente en la plataforma oficial evita caer en sitios clonados.' },
            { text: 'Responder al correo pidiendo más explicaciones.', isCorrect: false, feedback: 'Incorrecto. Esto solo confirma a los atacantes que tu cuenta de correo está activa.' }
          ],
          points: 10
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Contraseñas Seguras',
      description: 'Descubre por qué las claves sencillas ponen en riesgo tu información personal.',
      icon: 'key-outline',
      lessons: [
        {
          id: 'les-2',
          title: 'La contraseña de toda la vida',
          caseDescription: 'Utilizas la misma contraseña con tu fecha de nacimiento y tu nombre en tu correo, redes sociales y aplicaciones de trabajo.',
          hint: 'Piensa en qué ocurre si una plataforma pequeña e insecure sufre una brecha de datos.',
          question: '¿Cuál es el principal riesgo de esta práctica?',
          options: [
            { text: 'Ninguno, es muy fácil de recordar.', isCorrect: false, feedback: 'Incorrecto. La facilidad de memoria expone demasiada información personal.' },
            { text: 'Si un servicio menor sufre una filtración, los atacantes podrán acceder a todas tus demás cuentas (efecto dominó).', isCorrect: true, feedback: '¡Correcto! El uso de credenciales reutilizadas facilita ataques masivos.' },
            { text: 'Las computadoras tardan años en adivinar fechas de nacimiento.', isCorrect: false, feedback: 'Incorrecto. Los algoritmos actuales prueban millones de combinaciones en segundos.' }
          ],
          points: 10
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Ingeniería Social',
      description: 'Aprende a reconocer tácticas de manipulación psicológica utilizadas por atacantes.',
      icon: 'people-outline',
      lessons: [
        {
          id: 'les-3',
          title: 'La llamada de soporte técnico',
          caseDescription: 'Recibes una llamada telefónica de alguien que afirma ser del departamento de sistemas de tu universidad, solicitando tu contraseña temporalmente para "actualizar el servidor".',
          hint: 'Los departamentos de TI reales nunca necesitan tu contraseña personal para hacer mantenimiento.',
          question: '¿Cómo debes proceder ante esta solicitud?',
          options: [
            { text: 'Proporcionar la contraseña porque suena como un procedimiento oficial.', isCorrect: false, feedback: 'Incorrecto. Ningún departamento de TI legítimo te pedirá jamás tu contraseña por teléfono.' },
            { text: 'Colgar inmediatamente y reportar el incidente al canal oficial de la institución.', isCorrect: true, feedback: '¡Correcto! Los atacantes suplantan autoridad para presionar a las víctimas.' },
            { text: 'Pedirle su número de empleado y darle la contraseña a cambio.', isCorrect: false, feedback: 'Incorrecto. Las credenciales de acceso son estrictamente personales.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Malware y Descargas',
      description: 'Identifica los peligros ocultos en archivos adjuntos y software no verificado.',
      icon: 'bug-outline',
      lessons: [
        {
          id: 'les-4',
          title: 'El software "gratis" y crackeado',
          caseDescription: 'Encuentras un sitio web que ofrece una versión de pago de un programa de edición muy costoso de manera totalmente gratuita y con un archivo "crack.exe" incluido.',
          hint: 'Nadie regala software de alto coste sin agregar código oculto.',
          question: '¿Qué riesgo principal representa descargar e instalar este archivo?',
          options: [
            { text: 'Ninguno, es una gran ventaja económica.', isCorrect: false, feedback: 'Incorrecto. Los programas modificados suelen venir empaquetados con troyanos o ransomware.' },
            { text: 'Podría instalar software malicioso oculto que robe información personal o cifre tus archivos.', isCorrect: true, feedback: '¡Correcto! El software no oficial de fuentes dudosas es un vector principal de infección.' },
            { text: 'El único problema es que la aplicación dejará de recibir actualizaciones legales.', isCorrect: false, feedback: 'Incorrecto. El riesgo de seguridad va mucho más allá de las actualizaciones.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-5',
      title: 'Redes WiFi Públicas',
      description: 'Navega de forma segura cuando te conectas a redes abiertas en cafeterías o aeropuertos.',
      icon: 'wifi-outline',
      lessons: [
        {
          id: 'les-5',
          title: 'El WiFi libre de la cafetería',
          caseDescription: 'Te encuentras en una cafetería y te conectas a una red WiFi abierta sin contraseña para realizar transacciones bancarias urgentes en línea.',
          hint: 'En redes abiertas, los datos viajan sin cifrado robusto a menos que uses HTTPS estricto o VPN.',
          question: '¿Por qué representa un peligro realizar operaciones sensibles en esta red?',
          options: [
            { text: 'Porque el internet suele ser muy lento.', isCorrect: false, feedback: 'Incorrecto. La velocidad no es el problema crítico de seguridad.' },
            { text: 'Cualquier persona en la misma red abierta podría interceptar el tráfico no cifrado o realizar ataques de intermediario (MitM).', isCorrect: true, feedback: '¡Correcto! Las redes públicas no cifradas permiten capturar datos si no se toman precauciones.' },
            { text: 'No hay ningún riesgo si la cafetería es un lugar conocido.', isCorrect: false, feedback: 'Incorrecto. La legitimidad del establecimiento no garantiza la seguridad de su red.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-6',
      title: 'Privacidad Digital',
      description: 'Controla qué información personal compartes en redes sociales y servicios digitales.',
      icon: 'eye-off-outline',
      lessons: [
        {
          id: 'les-6',
          title: 'La ubicación en tiempo real',
          caseDescription: 'Antes de iniciar un viaje de vacaciones, publicas en tus redes sociales abiertas una foto de tu boleto de avión con todos los detalles y tu ubicación exacta.',
          hint: 'Piensa quién puede ver tus publicaciones y qué deducciones pueden hacer sobre tu hogar vacío.',
          question: '¿Qué implicaciones de seguridad tiene esta publicación?',
          options: [
            { text: 'Demuestra a todos mis contactos lo bien que la estoy pasando.', isCorrect: false, feedback: 'Incorrecto. Aunque parezca inofensivo, expone información delicada.' },
            { text: 'Alerta a personas malintencionadas sobre tu ausencia prolongada del hogar y expone datos personales sensibles.', isCorrect: true, feedback: '¡Correcto! Compartir excesiva información personal y de ubicación facilita robos y suplantación.' },
            { text: 'Las redes sociales protegen automáticamente todos los datos que publicamos.', isCorrect: false, feedback: 'Incorrecto. Los perfiles públicos exponen la información a cualquier usuario.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-7',
      title: 'Seguridad en Dispositivos Móviles',
      description: 'Aprende a gestionar permisos de aplicaciones y descargas en tu teléfono celular.',
      icon: 'phone-portrait-outline',
      lessons: [
        {
          id: 'les-7',
          title: 'La linterna que pide acceso a contactos',
          caseDescription: 'Descargas una aplicación gratuita de linterna muy básica, pero al abrirla por primera vez solicita permisos para acceder a tus contactos, ubicación GPS y almacenamiento completo.',
          hint: 'Evalúa la funcionalidad real de la aplicación frente a los permisos solicitados.',
          question: '¿Qué deberías hacer ante esta solicitud de permisos?',
          options: [
            { text: 'Concederlos todos para que la aplicación funcione correctamente.', isCorrect: false, feedback: 'Incorrecto. Una linterna no necesita acceder a tus contactos ni ubicación.' },
            { text: 'Rechazar los permisos innecesarios o desinstalar la aplicación por sospecha de recolección abusiva de datos.', isCorrect: true, feedback: '¡Correcto! El principio de mínimo privilegio indica que una app solo debe pedir acceso a lo necesario.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-8',
      title: 'Enlaces Cortos y Redirecciones',
      description: 'Identifica los riesgos de hacer clic en URLs abreviadas sin conocer su destino real.',
      icon: 'link-outline',
      lessons: [
        {
          id: 'les-8',
          title: 'El paquete misterioso por SMS',
          caseDescription: 'Recibes un mensaje de texto corto (SMS) que dice: "Su paquete está retenido. Haga clic aquí para entregarlo: bit.ly/3xYz9", sin haber pedido ninguna compra.',
          hint: 'Los acortadores de enlaces ocultan el dominio auténtico de la página web.',
          question: '¿Por qué este tipo de enlaces cortos representan una amenaza?',
          options: [
            { text: 'Ocultan la dirección web (URL) real de destino, redirigiendo frecuentemente a sitios trampa o de phishing.', isCorrect: true, feedback: '¡Correcto! Los acortadores ocultan el dominio legítimo, dificultando saber a dónde te diriges.' },
            { text: 'Son completamente seguros porque vienen en un mensaje de texto oficial.', isCorrect: false, feedback: 'Incorrecto. Los atacantes utilizan pasarelas de SMS para enviar enlaces fraudulentos.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-9',
      title: 'Copias de Seguridad (Backup)',
      description: 'Protege tu información valiosa frente a pérdida de equipos o ataques de ransomware.',
      icon: 'cloud-upload-outline',
      lessons: [
        {
          id: 'les-9',
          title: 'La importancia del respaldo',
          caseDescription: 'Llevas años guardando todas las fotos familiares, tareas y documentos importantes únicamente en el disco duro de tu computadora personal, sin respaldos en la nube o discos externos.',
          hint: 'Piensa qué sucedería si el equipo deja de encender hoy mismo.',
          question: '¿Cuál es el principal riesgo de depender de una sola ubicación de almacenamiento?',
          options: [
            { text: 'Ninguno, los discos duros modernos duran para siempre.', isCorrect: false, feedback: 'Incorrecto. Los discos pueden fallar físicamente en cualquier momento.' },
            { text: 'Si el equipo sufre un daño irreparable, es infectado por ransomware o es robado, perderás toda tu información irremediablemente.', isCorrect: true, feedback: '¡Correcto! La regla de respaldo es fundamental para garantizar que tus datos sobrevivan a incidentes.' }
          ],
          points: 15
        }
      ]
    },
    {
      id: 'mod-10',
      title: 'Actualizaciones de Software',
      description: 'Comprende por qué mantener tus sistemas al día previene vulnerabilidades conocidas.',
      icon: 'refresh-circle-outline',
      lessons: [
        {
          id: 'les-10',
          title: 'El aviso de actualización molesto',
          caseDescription: 'Tu teléfono y computadora no paran de mostrar notificaciones pidiendo reiniciar para instalar actualizaciones de seguridad, pero prefieres posponerlo indefinidamente para no perder tiempo.',
          hint: 'Los parches de seguridad corrigen fallos críticos descubiertos por investigadores.',
          question: '¿Qué implicaciones tiene ignorar constantemente las actualizaciones de seguridad?',
          options: [
            { text: 'Mejora el rendimiento general del equipo.', isCorrect: false, feedback: 'Incorrecto. Ignorar actualizaciones deja el sistema vulnerable.' },
            { text: 'Dejas tu dispositivo expuesto a vulnerabilidades conocidas que los ciberdelincuentes ya saben cómo explotar.', isCorrect: true, feedback: '¡Correcto! Los parches corrigen fallos de seguridad críticos descubiertos recientemente.' }
          ],
          points: 15
        }
      ]
    },
    // NUEVO: Módulo con Simulador de Terminal Interactiva
    {
      id: 'mod-terminal',
      title: 'Simulador de Diagnóstico (Terminal)',
      description: 'Ejecuta comandos de diagnóstico rápido para identificar anomalías de red y procesos sospechosos.',
      icon: 'terminal-outline',
      isTerminalChallenge: true,
      lessons: [
        {
          id: 'les-term',
          title: 'Caso Exprés: Análisis de Red en Servidor',
          caseDescription: 'Un equipo en el laboratorio de cómputo presenta tráfico inusual saliendo hacia una IP externa desconocida. Debes seleccionar el comando de diagnóstico adecuado para verificar las conexiones activas.',
          hint: 'Busca el comando clásico de red utilizado para listar conexiones de red activas y sockets abiertos.',
          question: '¿Qué comando de terminal debes ejecutar para listar las conexiones de red activas en el sistema?',
          options: [
            { text: 'netstat -ano (o ss -tulnp para verificar sockets y conexiones activas)', isCorrect: true, feedback: '¡Correcto! Permite identificar qué puertos y conexiones remotas están activas en el equipo.' },
            { text: 'format c: /q para limpiar el disco duro de inmediato', isCorrect: false, feedback: '¡Error crítico! Esto borraría por completo el sistema operativo.' },
            { text: 'ping 127.0.0.1 para reiniciar el adaptador de red local', isCorrect: false, feedback: 'Incorrecto. Ping solo verifica latencia hacia el bucle local, no lista conexiones activas externas.' }
          ],
          points: 20
        }
      ]
    }
  ];

  private userProfile: UserProfile = {
    name: 'Estudiante G&G',
    points: 0,
    streak: 3, // Racha activa de 3 días
    badges: ['Iniciado en Ciberseguridad'],
    completedLessons: []
  };

  constructor() {
    this.loadProgress();
  }

  getModules(): Module[] {
    return this.modules;
  }

  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  completeLesson(lessonId: string, pointsEarned: number) {
    if (!this.userProfile.completedLessons.includes(lessonId)) {
      this.userProfile.completedLessons.push(lessonId);
      this.userProfile.points += pointsEarned;
      
      if (this.userProfile.points >= 50 && !this.userProfile.badges.includes('Defensor Digital')) {
        this.userProfile.badges.push('Defensor Digital');
      }
      if (this.userProfile.points >= 100 && !this.userProfile.badges.includes('Experto G&G')) {
        this.userProfile.badges.push('Experto G&G');
      }

      this.saveProgress();
    }
  }

  private saveProgress() {
    localStorage.setItem('ahuihou_profile', JSON.stringify(this.userProfile));
  }

  private loadProgress() {
    const saved = localStorage.getItem('ahuihou_profile');
    if (saved) {
      this.userProfile = JSON.parse(saved);
    }
  }
}