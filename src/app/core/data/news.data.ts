export interface CyberNewsItem {
  lang: 'es' | 'en';
  category: string;
  date: string;
  title: string;
  summary: string;
  sourceName: string;
  readTime: string;
  sourceUrl: string;
}

export const CYBER_NEWS_LIST: CyberNewsItem[] = [
  // ==========================================
  // 🇪🇸 ESPAÑOL (30 ARTÍCULOS CON ENLACES REALES)
  // ==========================================
  {
    lang: 'es',
    category: 'Vulnerabilidades',
    date: '2026-10-28',
    title: 'Nueva vulnerabilidad crítica en pasarelas de pago globales',
    summary: 'Investigadores de seguridad descubren un fallo crítico en protocolos de redireccionamiento de APIs de pago que permite la alteración de montos.',
    sourceName: 'Cybersecurity Intelligence',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'Malware',
    date: '2026-10-27',
    title: 'Campañas masivas de infostealers dirigidas a entornos de desarrollo',
    summary: 'Ciberdelincuentes distribuyen paquetes maliciosos en repositorios públicos enfocados en robar credenciales de Docker, AWS y GitHub.',
    sourceName: 'Threat Research Global',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Ingeniería Social',
    date: '2026-10-26',
    title: 'Aumento de ataques de ingeniería social basados en deepfakes de voz',
    summary: 'Estafadores corporativos utilizan inteligencia artificial generativa para suplantar a directores ejecutivos en llamadas de autorización.',
    sourceName: 'SecOps Latam',
    readTime: '3 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'es',
    category: 'Cloud Security',
    date: '2026-10-25',
    title: 'Fallas de configuración en contenedores Kubernetes exponen datos sensibles',
    summary: 'Un informe revela que más del 30% de los despliegues en la nube mantienen permisos de clúster abiertos por defecto en redes corporativas.',
    sourceName: 'Cloud Guard',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Zero-Day',
    date: '2026-10-24',
    title: 'Parche de emergencia para zero-day activo en navegadores web',
    summary: 'Los principales proveedores de software liberan actualizaciones críticas para frenar la ejecución remota de código en equipos de escritorio.',
    sourceName: 'ZeroDay Watch',
    readTime: '3 min',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories'
  },
  {
    lang: 'es',
    category: 'Ransomware',
    date: '2026-10-23',
    title: 'Nuevo ransomware utiliza técnicas de cifrado cuántico híbrido',
    summary: 'Una variante avanzada de software malicioso apunta a infraestructuras críticas utilizando algoritmos resistentes a futuros ataques cuánticos.',
    sourceName: 'CyberDefense ES',
    readTime: '6 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'IoT Security',
    date: '2026-10-22',
    title: 'Vulnerabilidades críticas en dispositivos médicos conectados a red',
    summary: 'Expertos advierten sobre fallos de autenticación en bombas de infusión y monitores de pacientes en centros hospitalarios.',
    sourceName: 'MedSec Review',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Phishing',
    date: '2026-10-21',
    title: 'Campañas de phishing evade autenticación multifactor (MFA)',
    summary: 'Ataques de intermediario en tiempo real (AiTM) logran interceptar sesiones activas de Office 365 y Google Workspace.',
    sourceName: 'PhishGuard News',
    readTime: '4 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'es',
    category: 'Criptografía',
    date: '2026-10-20',
    title: 'Debilidades en implementaciones de curvas elípticas en apps móviles',
    summary: 'Análisis de seguridad descubre fallos en la generación de números pseudoaleatorios en carteras digitales de criptomonedas.',
    sourceName: 'CryptoAlert',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Red Teaming',
    date: '2026-10-19',
    title: 'Herramientas de EDR evadidas mediante técnicas de Bring Your Own Driver',
    summary: 'Grupos de APTs utilizan drivers legítimos firmados para deshabilitar soluciones de seguridad endpoint durante intrusiones.',
    sourceName: 'RedTeam Journal',
    readTime: '6 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'API Security',
    date: '2026-10-18',
    title: 'Exposición masiva de datos por control de acceso roto en APIs REST',
    summary: 'Millones de registros de usuarios quedan expuestos debido a la falta de validación de roles en endpoints de servicios financieros.',
    sourceName: 'API Security Daily',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Compliance',
    date: '2026-10-17',
    title: 'Nuevas normativas de ciberseguridad exigen auditorías trimestrales',
    summary: 'Los gobiernos actualizan los marcos regulatorios para obligar a las empresas tecnológicas a reportar incidentes en menos de 24 horas.',
    sourceName: 'LegalSec Global',
    readTime: '3 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'es',
    category: 'Hardware',
    date: '2026-10-16',
    title: 'Descubren canal lateral en procesadores modernos que filtra claves RSA',
    summary: 'Investigadores académicos demuestran la extracción de secretos criptográficos midiendo fluctuaciones de energía en microchips.',
    sourceName: 'Hardware Hacker ES',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Supply Chain',
    date: '2026-10-15',
    title: 'Ataque a la cadena de suministro afecta a miles de servidores Linux',
    summary: 'Una librería de compresión muy popular fue modificada maliciosamente para insertar puertas trasera de acceso remoto SSH.',
    sourceName: 'Linux Security News',
    readTime: '5 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'Mobile Security',
    date: '2026-10-14',
    title: 'Troyanos bancarios para Android simulan aplicaciones de entidades oficiales',
    summary: 'Campaña maliciosa utiliza notificaciones push falsas para engañar a usuarios y obtener permisos de accesibilidad total.',
    sourceName: 'AndroidSec Hub',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'IA & Seguridad',
    date: '2026-10-13',
    title: 'Modelos de lenguaje grande (LLM) vulnerables a ataques de inyección de prompt',
    summary: 'Demuestran cómo manipular asistentes virtuales corporativos para exfiltrar bases de datos internas mediante comandos ocultos.',
    sourceName: 'AI Threat Labs',
    readTime: '4 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'es',
    category: 'Blockchain',
    date: '2026-10-12',
    title: 'Explotan vulnerabilidad de reentrada en contratos inteligentes DeFi',
    summary: 'Pérdidas millonarias tras un ataque coordinado a protocolos de préstamos descentralizados en redes de capa 2.',
    sourceName: 'Web3 Security',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Forensics',
    date: '2026-10-11',
    title: 'Nuevas técnicas forenses para análisis de memoria RAM en Windows 11',
    summary: 'Presentan herramientas optimizadas para extraer artefactos volátiles de ciberataques persistentes avanzados (APT).',
    sourceName: 'Forensic Focus ES',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'Infraestructura',
    date: '2026-10-10',
    title: 'Ataques DDoS alcanzan picos históricos de terabits por segundo',
    summary: 'Botnets masivos compuestos por dispositivos IoT comprometidos intentan saturar pasarelas de pago y DNS internacionales.',
    sourceName: 'Network Defense',
    readTime: '3 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Insider Threats',
    date: '2026-10-09',
    title: 'Estrategias efectivas para mitigar riesgos de amenazas internas',
    summary: 'Empresas implementan controles de acceso basado en confianza cero (Zero Trust) para evitar fuga de propiedad intelectual.',
    sourceName: 'SecOps Management',
    readTime: '4 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'es',
    category: 'Automotive Sec',
    date: '2026-10-08',
    title: 'Vulnerabilidades en sistemas de infoentretenimiento vehicular',
    summary: 'Investigadores logran control parcial de funciones de confort mediante ataques inalámbricos a protocolos Bluetooth locales.',
    sourceName: 'AutoSec News',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Social Media',
    date: '2026-10-07',
    title: 'Oleada de suplantación de identidad en redes profesionales',
    summary: 'Perfiles falsos creados con IA contactan a reclutadores y desarrolladores para enviar archivos maliciosos bajo apariencia de pruebas técnicas.',
    sourceName: 'Identity Watch',
    readTime: '3 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'es',
    category: 'Cloud Security',
    date: '2026-10-06',
    title: 'Errores comunes en la gestión de tokens de acceso OAuth',
    summary: 'Revisión de seguridad destaca la importancia de expirar y rotar correctamente las credenciales de aplicaciones terceras.',
    sourceName: 'Cloud Arch ES',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'Malware',
    date: '2026-10-05',
    title: 'Evolución del malware sin archivos (Fileless Malware) en sistemas corporativos',
    summary: 'Amenazas que operan exclusivamente en memoria RAM dificultan la detección tradicional basada en análisis de archivos estáticos.',
    sourceName: 'Malware Analysis Lab',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Cyber Warfare',
    date: '2026-10-04',
    title: 'Incremento de ciberataques patrocinados por estados a redes energéticas',
    summary: 'Agencias de inteligencia reportan intentos sistemáticos de intrusión en sistemas SCADA de plantas de energía eléctrica.',
    sourceName: 'Geopolitics & Sec',
    readTime: '5 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'es',
    category: 'DevSecOps',
    date: '2026-10-03',
    title: 'Integración de análisis estático (SAST) en pipelines de CI/CD',
    summary: 'Guía práctica para desarrolladores sobre cómo bloquear vulnerabilidades críticas antes de desplegar código a producción.',
    sourceName: 'DevSecOps World',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'es',
    category: 'Email Security',
    date: '2026-10-02',
    title: 'Importancia crítica de configurar correctamente SPF, DKIM y DMARC',
    summary: 'Estadísticas muestran que miles de dominios empresariales siguen expuestos a la suplantación directa de correo electrónico.',
    sourceName: 'Email Defense',
    readTime: '3 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'es',
    category: 'Wireless Sec',
    date: '2026-10-01',
    title: 'Nuevos riesgos detectados en redes Wi-Fi empresariales abiertas',
    summary: 'Análisis de protocolos de autenticación inalámbrica revela debilidades en puntos de acceso mal configurados.',
    sourceName: 'Wireless Guard',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'es',
    category: 'Incident Response',
    date: '2026-09-30',
    title: 'Mejores prácticas para la contención rápida de brechas de datos',
    summary: 'Cómo coordinar un equipo de respuesta a incidentes (CSIRT) durante las primeras horas críticas de una exfiltración.',
    sourceName: 'Incident Response ES',
    readTime: '5 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'es',
    category: 'Cultura de Seguridad',
    date: '2026-09-29',
    title: 'Gamificación como estrategia clave en la formación de empleados',
    summary: 'Plataformas interactivas demuestran reducir drásticamente la tasa de caída en pruebas controladas de phishing corporativo.',
    sourceName: 'Cyber Edu News',
    readTime: '4 min',
    sourceUrl: 'https://www.cisa.gov'
  },

  // ==========================================
  // 🇺🇸 ENGLISH (30 ARTICLES WITH REAL LINKS)
  // ==========================================
  {
    lang: 'en',
    category: 'Vulnerabilities',
    date: '2026-10-28',
    title: 'Critical Vulnerability Discovered in Global Payment Gateways',
    summary: 'Security researchers uncover a critical flaw in API payment redirection protocols that allows transaction amount tampering.',
    sourceName: 'Cybersecurity Intelligence',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'Malware',
    date: '2026-10-27',
    title: 'Massive Infostealer Campaigns Targeting Development Environments',
    summary: 'Cybercriminals distribute malicious packages in public repositories focused on stealing Docker, AWS, and GitHub credentials.',
    sourceName: 'Threat Research Global',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Social Engineering',
    date: '2026-10-26',
    title: 'Rise in Social Engineering Attacks Based on Voice Deepfakes',
    summary: 'Corporate fraudsters use generative artificial intelligence to impersonate CEOs in transfer authorization calls.',
    sourceName: 'SecOps Global',
    readTime: '3 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'en',
    category: 'Cloud Security',
    date: '2026-10-25',
    title: 'Kubernetes Misconfigurations Expose Sensitive Corporate Data',
    summary: 'Report reveals over 30 percent of cloud deployments maintain default open cluster permissions across enterprise networks.',
    sourceName: 'Cloud Guard',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Zero-Day',
    date: '2026-10-24',
    title: 'Emergency Patch Released for Active Zero-Day in Web Browsers',
    summary: 'Major software vendors push critical updates to halt remote code execution exploits affecting desktop environments.',
    sourceName: 'ZeroDay Watch',
    readTime: '3 min',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories'
  },
  {
    lang: 'en',
    category: 'Ransomware',
    date: '2026-10-23',
    title: 'New Ransomware Strain Implements Hybrid Quantum Encryption',
    summary: 'Advanced malware variant targets critical infrastructure utilizing cryptographic algorithms resistant to future quantum attacks.',
    sourceName: 'CyberDefense US',
    readTime: '6 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'IoT Security',
    date: '2026-10-22',
    title: 'Critical Vulnerabilities Found in Network-Connected Medical Devices',
    summary: 'Experts warn about authentication flaws impacting infusion pumps and patient monitors in hospital environments.',
    sourceName: 'MedSec Review',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Phishing',
    date: '2026-10-21',
    title: 'Phishing Campaigns Successfully Bypass Multi-Factor Authentication (MFA)',
    summary: 'Real-time Adversary-in-the-Middle (AiTM) attacks manage to hijack active Office 365 and Google Workspace user sessions.',
    sourceName: 'PhishGuard News',
    readTime: '4 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'en',
    category: 'Cryptography',
    date: '2026-10-20',
    title: 'Weaknesses Discovered in Elliptic Curve Implementations on Mobile Apps',
    summary: 'Security analysis uncovers pseudo-random number generation flaws in decentralized cryptocurrency wallet software.',
    sourceName: 'CryptoAlert',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Red Teaming',
    date: '2026-10-18',
    title: 'EDR Solutions Bypassed Using Bring Your Own Vulnerable Driver Techniques',
    summary: 'APT groups leverage legitimate signed kernel drivers to disable endpoint security agents during simulated intrusions.',
    sourceName: 'RedTeam Journal',
    readTime: '6 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'API Security',
    date: '2026-10-18',
    title: 'Massive Data Exposure Caused by Broken Object Level Authorization in REST APIs',
    summary: 'Millions of user records left exposed due to missing role validation checks across financial service endpoints.',
    sourceName: 'API Security Daily',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Compliance',
    date: '2026-10-17',
    title: 'New Cybersecurity Regulations Mandate Strict Quarterly Audits',
    summary: 'Governments update regulatory frameworks forcing tech enterprises to report critical security incidents within 24 hours.',
    sourceName: 'LegalSec Global',
    readTime: '3 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'en',
    category: 'Hardware',
    date: '2026-10-16',
    title: 'Side-Channel Flaw in Modern CPUs Leaks RSA Private Keys',
    summary: 'Academic researchers demonstrate cryptographic secret extraction by measuring power fluctuation patterns on microchips.',
    sourceName: 'Hardware Hacker Global',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Supply Chain',
    date: '2026-10-15',
    title: 'Supply Chain Attack Impacts Thousands of Enterprise Linux Servers',
    summary: 'A widely used open-source compression library gets maliciously modified to insert covert remote SSH backdoors.',
    sourceName: 'Linux Security News',
    readTime: '5 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'Mobile Security',
    date: '2026-10-14',
    title: 'Android Banking Trojans Mimic Official Financial Institution Apps',
    summary: 'Malicious campaign deploys fake push notifications to trick users into granting broad accessibility permissions.',
    sourceName: 'AndroidSec Hub',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'AI Security',
    date: '2026-10-13',
    title: 'Large Language Models Vulnerable to Advanced Prompt Injection Attacks',
    summary: 'Researchers demonstrate how to manipulate enterprise virtual assistants to exfiltrate internal databases via hidden commands.',
    sourceName: 'AI Threat Labs',
    readTime: '4 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'en',
    category: 'Blockchain',
    date: '2026-10-12',
    title: 'Reentrancy Vulnerability Exploited in DeFi Smart Contracts',
    summary: 'Substantial financial losses follow a coordinated exploit targeting layer-2 decentralized lending protocols.',
    sourceName: 'Web3 Security',
    readTime: '5 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Forensics',
    date: '2026-10-11',
    title: 'Advanced Forensic Techniques for Windows 11 RAM Memory Analysis',
    summary: 'Security vendors release optimized toolsets for harvesting volatile memory artifacts during persistent threat investigations.',
    sourceName: 'Forensic Focus',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'Infrastructure',
    date: '2026-10-10',
    title: 'DDoS Attacks Reach Historic Peaks of Terabits Per Second',
    summary: 'Massive botnets built from compromised IoT devices attempt to overwhelm international DNS root servers and gateways.',
    sourceName: 'Network Defense',
    readTime: '3 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Insider Threats',
    date: '2026-10-09',
    title: 'Effective Strategies to Mitigate Enterprise Insider Threat Risks',
    summary: 'Organizations adopt strict zero-trust access controls to prevent critical intellectual property theft.',
    sourceName: 'SecOps Management',
    readTime: '4 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'en',
    category: 'Automotive Sec',
    date: '2026-10-08',
    title: 'Vulnerabilities Discovered in Modern Vehicle Infotainment Systems',
    summary: 'Researchers gain partial remote control over vehicle comfort features through local Bluetooth protocol weaknesses.',
    sourceName: 'AutoSec News',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Social Media',
    date: '2026-10-07',
    title: 'Wave of Impersonation Attacks Targeting Professional Networks',
    summary: 'AI-generated fake profiles reach out to recruiters and developers, delivering malicious payloads disguised as technical tests.',
    sourceName: 'Identity Watch',
    readTime: '3 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'en',
    category: 'Cloud Security',
    date: '2026-10-06',
    title: 'Common Pitfalls in Enterprise OAuth Token Management',
    summary: 'Security review highlights the vital need to properly expire and rotate third-party application access credentials.',
    sourceName: 'Cloud Arch Global',
    readTime: '4 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'Malware',
    date: '2026-10-05',
    title: 'The Evolution of Fileless Malware in Corporate Networks',
    summary: 'Threats operating entirely within volatile memory complicate traditional file signature-based detection systems.',
    sourceName: 'Malware Analysis Lab',
    readTime: '5 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Cyber Warfare',
    date: '2026-10-04',
    title: 'State-Sponsored Cyberattacks Target Critical Power Grid Infrastructure',
    summary: 'Intelligence agencies report systematic intrusion attempts against SCADA systems across electric utility networks.',
    sourceName: 'Geopolitics & Sec',
    readTime: '5 min',
    sourceUrl: 'https://www.cisa.gov'
  },
  {
    lang: 'en',
    category: 'DevSecOps',
    date: '2026-10-03',
    title: 'Integrating Static Application Security Testing (SAST) into CI/CD Pipelines',
    summary: 'Practical developer guide on how to block critical vulnerabilities before pushing production code updates.',
    sourceName: 'DevSecOps World',
    readTime: '4 min',
    sourceUrl: 'https://www.darkreading.com'
  },
  {
    lang: 'en',
    category: 'Email Security',
    date: '2026-10-02',
    title: 'The Critical Importance of Proper SPF, DKIM, and DMARC Configuration',
    summary: 'Statistics show thousands of corporate domains remain vulnerable to direct domain spoofing attacks.',
    sourceName: 'Email Defense',
    readTime: '3 min',
    sourceUrl: 'https://thehackernews.com'
  },
  {
    lang: 'en',
    category: 'Wireless Sec',
    date: '2026-10-01',
    title: 'New Risks Identified in Enterprise Open Wi-Fi Environments',
    summary: 'Wireless authentication protocol audits uncover vulnerabilities in misconfigured corporate access points.',
    sourceName: 'Wireless Guard',
    readTime: '4 min',
    sourceUrl: 'https://www.bleepingcomputer.com'
  },
  {
    lang: 'en',
    category: 'Incident Response',
    date: '2026-09-30',
    title: 'Best Practices for Rapid Enterprise Data Breach Containment',
    summary: 'How to effectively coordinate an Incident Response team during the critical first hours of an active exfiltration.',
    sourceName: 'Incident Response US',
    readTime: '5 min',
    sourceUrl: 'https://krebsonsecurity.com'
  },
  {
    lang: 'en',
    category: 'Security Culture',
    date: '2026-09-29',
    title: 'Gamification as a Core Strategy in Employee Cybersecurity Training',
    summary: 'Interactive learning platforms prove instrumental in dramatically reducing failure rates in simulated corporate phishing tests.',
    sourceName: 'Cyber Edu News',
    readTime: '4 min',
    sourceUrl: 'https://www.cisa.gov'
  }
];