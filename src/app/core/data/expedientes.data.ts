import { Expediente, Insignia } from '../models/cyber.model';

export const INSIGNIAS_INICIALES: Insignia[] = [
  { id: 'badge-1', nombre: 'Caza-Phish', descripcion: 'Resolver un caso de suplantación de identidad.', icono: '🛡️', desbloqueada: false },
  { id: 'badge-2', nombre: 'Escudo Social', descripcion: 'Neutralizar un ataque de ingeniería social.', icono: '🧠', desbloqueada: false },
  { id: 'badge-3', nombre: 'Anti-Malware', descripcion: 'Desarticular un vector de código malicioso.', icono: '💻', desbloqueada: false },
  { id: 'badge-4', nombre: 'Cripto-Analista', descripcion: 'Contener una infección de Ransomware.', icono: '🔒', desbloqueada: false },
  { id: 'badge-5', nombre: 'Red Segura', descripcion: 'Detectar interceptación de tráfico MitM.', icono: '🌐', desbloqueada: false },
  { id: 'badge-6', nombre: 'Forense USB', descripcion: 'Analizar un dispositivo hardware comprometido.', icono: '🔌', desbloqueada: false }
];

export const EXPEDIENTES_DATA: Expediente[] = [
  {
    id: 'caso-001',
    numero: 'EXP-001',
    titulo: 'Phishing Bancario Masivo',
    categoria: 'Phishing',
    dificultad: 'Fácil',
    resumen: 'Correo masivo dirigido a empleados simulando ser el departamento de sistemas solicitando cambio de credenciales.',
    xpRecompensa: 500,
    evidencias: [
      {
        id: 'ev-101',
        tipo: 'correo',
        titulo: 'Notificación URGENTE: Restablezca su contraseña',
        contenido: 'De: soporte@soporte-bancolocal-seguro.com\nPara: empleado@empresa.com\nAsunto: Alerta de seguridad crítica\n\nEstimado usuario, su cuenta corporativa expirará hoy.',
        pistaExplicativa: 'El dominio del remitente no coincide con la organización oficial.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Cuál es el indicador definitivo de que este correo es un ataque de phishing?',
      opciones: [
        { texto: 'El uso de urgencia y mayúsculas en el asunto.', esCorrecta: false, explicacion: 'Las empresas legítimas también pueden generar urgencia.' },
        { texto: 'El dominio del remitente y la URL de destino son falsos (suplantación).', esCorrecta: true, explicacion: '¡Exacto! Dominio externo no autorizado.' },
        { texto: 'El correo fue enviado en horario laboral.', esCorrecta: false, explicacion: 'La hora no define la veracidad.' }
      ]
    }
  },
  {
    id: 'caso-002',
    numero: 'EXP-002',
    titulo: 'Llamada del Falso Soporte Técnico',
    categoria: 'Ingeniería Social',
    dificultad: 'Media',
    resumen: 'Supuesto técnico de Microsoft llama a recepción exigiendo acceso remoto inmediato por virus crítico.',
    xpRecompensa: 750,
    evidencias: [
      {
        id: 'ev-201',
        tipo: 'registro',
        titulo: 'Transcripción de Llamada Telefónica',
        contenido: '[10:14 AM] Atacante: "Hablando de soporte central de Windows. Sus servidores muestran brecha. Instale TeamViewer y déme el código."',
        pistaExplicativa: 'Los proveedores globales jamás llaman pidiendo control remoto no solicitado.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Cómo debe proceder el personal ante esta llamada?',
      opciones: [
        { texto: 'Dar el código de acceso rápido para evitar que los servidores fallen.', esCorrecta: false, explicacion: 'Grave error: entrega de control total.' },
        { texto: 'Colgar inmediatamente, verificar la identidad por canales oficiales y reportar.', esCorrecta: true, explicacion: '¡Correcto! La presión psicológica es ingeniería social.' },
        { texto: 'Pedir credencial de empleado por teléfono.', esCorrecta: false, explicacion: 'Los estafadores falsifican credenciales fácilmente.' }
      ]
    }
  },
  {
    id: 'caso-003',
    numero: 'EXP-003',
    titulo: 'Factura con Carga Oculta',
    categoria: 'Malware',
    dificultad: 'Avanzada',
    resumen: 'Departamento financiero recibió factura en PDF que ejecutó procesos extraños en segundo plano.',
    xpRecompensa: 1000,
    evidencias: [
      {
        id: 'ev-301',
        tipo: 'archivo',
        titulo: 'Metadatos del Archivo Adjunto',
        contenido: 'Nombre: Factura_Urgente_Abril.pdf.exe\nTamaño: 45 KB\nMIME: application/x-msdownload',
        pistaExplicativa: 'Doble extensión oculta (.pdf.exe), disfrazado de documento pero siendo ejecutable.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Qué tipo de amenaza representa este archivo adjunto?',
      opciones: [
        { texto: 'Un troyano o malware de ejecución automatizada oculta.', esCorrecta: true, explicacion: '¡Excelente! Doble extensión para engañar al usuario.' },
        { texto: 'Un error de codificación del sistema de facturación.', esCorrecta: false, explicacion: 'No es error de software.' },
        { texto: 'Un archivo PDF comprimido estándar.', esCorrecta: false, explicacion: 'Los PDF legítimos nunca terminan en .exe.' }
      ]
    }
  },
  {
    id: 'caso-004',
    numero: 'EXP-004',
    titulo: 'Bloqueo Criptográfico en Servidores',
    categoria: 'Ransomware',
    dificultad: 'Crítica',
    resumen: 'Los archivos de la red interna han cambiado su extensión a .locked y muestran una nota de rescate en Bitcoin.',
    xpRecompensa: 1500,
    evidencias: [
      {
        id: 'ev-401',
        tipo: 'nota',
        titulo: 'README_DECRYPT.txt',
        contenido: 'Sus bases de datos han sido cifradas con AES-256. Pague 2 BTC a la dirección wallet para obtener la llave privada.',
        pistaExplicativa: 'Cifrado masivo de archivos acompañado de nota de extorsión.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Cuál es el protocolo de contención inmediato ante un ataque de Ransomware?',
      opciones: [
        { texto: 'Pagar el rescate inmediatamente para asegurar la recuperación.', esCorrecta: false, explicacion: 'Financia cibercriminales sin garantía de recuperación.' },
        { texto: 'Desconectar la máquina infectada de la red (aíslamiento), apagar recursos afectados y restaurar desde respaldos limpios.', esCorrecta: true, explicacion: '¡Correcto! Aislar frena la propagación lateral del ransomware.' },
        { texto: 'Ejecutar un antivirus local sin desconectar el cable de red.', esCorrecta: false, explicacion: 'Permitiría que siga cifrando recursos de red compartidos.' }
      ]
    }
  },
  {
    id: 'caso-005',
    numero: 'EXP-005',
    titulo: 'Interceptación en Café Wi-Fi',
    categoria: 'MitM',
    dificultad: 'Avanzada',
    resumen: 'Se detectó tráfico anómalo redirigiendo credenciales corporativas a un nodo falso en una red pública.',
    xpRecompensa: 1200,
    evidencias: [
      {
        id: 'ev-501',
        tipo: 'red',
        titulo: 'Registro de Paquetes ARP Spoofing',
        contenido: 'Gateway IP: 192.168.1.1 | MAC Atacante suplantando puerta de enlace: AA:BB:CC:DD:EE:FF',
        pistaExplicativa: 'El atacante envenena la tabla ARP para interceptar el tráfico entre el equipo y el router.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Qué tecnología previene que las credenciales sean leídas en un ataque MitM?',
      opciones: [
        { texto: 'El uso obligatorio de VPNs corporativas cifradas y HTTPS estricto (HSTS).', esCorrecta: true, explicacion: '¡Exacto! El cifrado de extremo a extremo protege los datos incluso si la red es hostil.' },
        { texto: 'Desactivar el firewall de Windows.', esCorrecta: false, explicacion: 'Dejaría el equipo completamente desprotegido.' },
        { texto: 'Cambiar la contraseña de la sesión del navegador web.', esCorrecta: false, explicacion: 'No evita la intercepción en tránsito de los paquetes.' }
      ]
    }
  },
  {
    id: 'caso-006',
    numero: 'EXP-006',
    titulo: 'Dispositivo USB Desconocido en Planta',
    categoria: 'Forense USB',
    dificultad: 'Media',
    resumen: 'Se encontró una memoria USB abandonada en el estacionamiento corporativo y conectada a una estación de trabajo.',
    xpRecompensa: 900,
    evidencias: [
      {
        id: 'ev-601',
        tipo: 'hardware',
        titulo: 'Reporte de Enumeración de Dispositivo HID',
        contenido: 'Descriptor de Dispositivo reporta emulación de Teclado/Mouse (Rubber Ducky) inyectando comandos de PowerShell al conectarse.',
        pistaExplicativa: 'El dispositivo no es una memoria de almacenamiento convencional, sino un inyector de comandos automatizados.'
      }
    ],
    preguntaFinal: {
      enunciado: '¿Cómo se debe mitigar este riesgo físico de manera corporativa?',
      opciones: [
        { texto: 'Deshabilitar puertos USB masivamente o restringir controladores HID mediante políticas de grupo (GPO).', esCorrecta: true, explicacion: '¡Excelente! Las políticas estrictas de hardware bloquean dispositivos no autorizados.' },
        { texto: 'Formatear la memoria USB y usarla para guardar archivos personales.', esCorrecta: false, explicacion: 'Peligro inminente de infección por hardware malicioso.' },
        { texto: 'Revisar el contenido de la USB abriendo sus archivos uno por uno.', esCorrecta: false, explicacion: 'Ejecutaría automáticamente el script malicioso oculto.' }
      ]
    }
  }
];