export type PodcastLang = 'es' | 'en';

export interface PodcastEpisode {
  id: number;
  title: string;
  duration: string;
  category: string;
  lang: PodcastLang;
  audioUrl: string;
}

export interface PodcastSource {
  name: string;
  type: string;
  description: string;
  lang: PodcastLang;
  url: string;
}

export const PODCASTS_LIST: PodcastEpisode[] = [
    { 
      id: 1, 
      title: 'Experto en IA ofensiva: ¿Una IA hackeó a la NSA? ¿Qué usaban Windows XP?', 
      duration: '01:12:03', 
      category: 'AI Offense', 
      lang: 'es',
      audioUrl: 'assets/Experto en IA ofensiva ¿Una IA hackeó a la NSA ¿Qué usaban Windows XP.mp3' 
    },
    { 
      id: 2, 
      title: 'Indirect Prompt Injection - La Tertulia', 
      duration: '01:14:05', 
      category: 'AI Security', 
      lang: 'es',
      audioUrl: 'assets/Indirect Prompt Injection - La Tertulia.mp3' 
    },
    { 
      id: 3, 
      title: 'Indirect Prompt Injection (English Special)', 
      duration: '01:05:30', 
      category: 'AI Security', 
      lang: 'en',
      audioUrl: 'assets/Indirect Prompt Injection.mp3' 
    },
    { 
      id: 4, 
      title: 'Salt Typhoon Threat Analysis', 
      duration: '56:21', 
      category: 'APT Threats', 
      lang: 'en',
      audioUrl: 'assets/Salt Typhoon.mp3' 
    },
    { 
      id: 5, 
      title: 'CrowdStrike Incident Breakdown', 
      duration: '34:18', 
      category: 'Incident Response', 
      lang: 'en',
      audioUrl: 'assets/CrowdStrike.mp3' 
    },
    { 
      id: 6, 
      title: 'PrintListener y CibercrimenGPT', 
      duration: '49:08', 
      category: 'Malware', 
      lang: 'es',
      audioUrl: 'assets/PrintListener y CibercrimenGPT.mp3' 
    },
    { 
      id: 7, 
      title: 'Armamento autónomo y Vulnerabilidad de medio día', 
      duration: '01:38:03', 
      category: 'Red Teaming', 
      lang: 'es',
      audioUrl: 'assets/Armamento autónomo y Vulnerabilidad de medio día.mp3' 
    },
    { 
      id: 8, 
      title: 'Miedo a la IA y Bomba USB', 
      duration: '01:10:57', 
      category: 'Social Engineering', 
      lang: 'es',
      audioUrl: 'assets/Miedo a la IA y Bomba USB.mp3' 
    },
    { 
      id: 9, 
      title: 'Google Home y WebCarHacking', 
      duration: '01:23:33', 
      category: 'IoT Security', 
      lang: 'es',
      audioUrl: 'assets/Google Home y WebCarHacking.mp3' 
    },
    { 
      id: 10, 
      title: 'Replika, WhisperGate, and Trezor One Forensics', 
      duration: '01:27:25', 
      category: 'Forensics & Crypto', 
      lang: 'en',
      audioUrl: 'assets/Replika, WhisperGate, estaciones de números y Trezor One.mp3' 
    }
];

// Directorio global dividido explícitamente por idioma ('es' / 'en') con todas las fuentes oficiales
export const PODCAST_SOURCES: PodcastSource[] = [
    // --- Fuentes en Español ---
    { name: 'Seguridad SI', type: 'YouTube', description: 'Canal especializado en divulgación y análisis de seguridad informática.', lang: 'es', url: 'https://www.seguridadsi.com' },
    { name: 'ESET Venezuela Podcast', type: 'Podcast Oficial', description: 'Análisis de amenazas regionales y tendencias de seguridad por ESET.', lang: 'es', url: 'https://www.eset.com/ve/podcast/' },
    { name: 'Podcast de CCI', type: 'Recursos CCI', description: 'Centro de Ciberseguridad Industrial: debates y ponencias especializadas.', lang: 'es', url: 'https://www.cci-es.org/recursos/podcast-de-cci/' },
    { name: 'El Tao del Hacking', type: 'Podcast Especializado', description: 'Técnicas, entrevistas y cultura hacker explicada a fondo.', lang: 'es', url: 'https://www.eltaodelhacking.com' },
    { name: 'Tierra de Hackers (Spotify 1)', type: 'Audio Stream', description: 'Episodios principales de análisis técnico y ofensivo.', lang: 'es', url: 'https://open.spotify.com/show/3aET9Y9tVXInQQchq1geUO' },
    { name: 'Tierra de Hackers (Spotify 2)', type: 'Audio Stream', description: 'Debates sobre la actualidad y laboratorios de ciberseguridad.', lang: 'es', url: 'https://open.spotify.com/show/2kiuVpBg4oH65JKlm7ABtY' },
    { name: 'Palabra de Hacker', type: 'Yolanda Corral', description: 'Entrevistas, divulgación y concienciación en seguridad digital.', lang: 'es', url: 'https://www.yolandacorral.com/palabra-de-hacker/' },
    { name: 'Cosas de Hackers', type: 'Portal de Audio', description: 'Divulgación amena sobre ciberseguridad y privacidad.', lang: 'es', url: 'https://www.cosasdehackers.es' },
    { name: 'Seguridad y Privacidad (Spotify)', type: 'Audio Stream', description: 'Espacio dedicado al resguardo de información personal y corporativa.', lang: 'es', url: 'https://open.spotify.com/show/1wNbJ8QkhZs3hb9c9Ele9r' },
    { name: 'Canal Técnico de Seguridad', type: 'YouTube', description: 'Demostraciones prácticas y conferencias de ciberseguridad.', lang: 'es', url: 'https://www.youtube.com/channel/UCGIrc1g8T4V9CvRrOoactqA' },
    { name: 'Ciberseguridad y Defensa (Spotify)', type: 'Audio Stream', description: 'Estrategias defensivas y mitigación de vectores de ataque.', lang: 'es', url: 'https://open.spotify.com/show/3TfFccTNuCHk1nWPIVm5MR' },
    { name: 'Listado de Ciberdefensa', type: 'YouTube Playlist', description: 'Recopilación audiovisual de conferencias y talleres.', lang: 'es', url: 'https://www.youtube.com/playlist?list=PLDyIJu2O4ugdB7YX4OlP_RcrViZU3z4LK' },
    { name: 'Audios de Inteligencia Ofensiva', type: 'Spotify Stream', description: 'Foco en Red Teaming y pruebas de penetración avanzadas.', lang: 'es', url: 'https://open.spotify.com/show/4XymlIUA6iFaW6IUMjYfGK' },
    { name: 'INCIBE - IA y Adolescentes', type: 'Podcast Educativo', description: 'Guías de ciberseguridad e inteligencia artificial para jóvenes y educadores.', lang: 'es', url: 'https://www.incibe.es/menores/tematicas/inteligencia-artificial/podcast-ia-adolescentes' },
    { name: 'Divulgación Tecnológica Segura', type: 'Spotify Stream', description: 'Espacio de análisis sobre incidentes cibernéticos globales.', lang: 'es', url: 'https://open.spotify.com/show/0hN43ix4foCWbQ96lfK36d' },

    // --- Fuentes en Inglés ---
    { name: 'Darknet Diaries', type: 'International Podcast', description: 'True stories from the dark side of the internet, hackers, and breaches.', lang: 'en', url: 'https://open.spotify.com/show/61c15kBzYFPyr0eMVJS2BK' },
    { name: 'The CyberWire Daily', type: 'Daily Intelligence', description: 'Daily executive summary on global threat intelligence.', lang: 'en', url: 'https://open.spotify.com/show/2eAe6x1Ps25C1ofTYhp5TA' },
    { name: 'Smashing Security', type: 'Analysis Podcast', description: 'Debates on cybersecurity, privacy, and technology scams.', lang: 'en', url: 'https://open.spotify.com/show/4cIPSwHmDVMAGd2UsFAvyl' },
    { name: 'Risky.Biz', type: 'Intelligence Briefing', description: 'Information security news and corporate-level analysis.', lang: 'en', url: 'https://open.spotify.com/show/5892yrlZCRK4B1Ns2v6zFP' },
    { name: 'Security Now', type: 'Technical Breakdown', description: 'In-depth analysis of network protocols, encryption, and current exploits.', lang: 'en', url: 'https://open.spotify.com/show/2k2xSiE0YfP69HQVaESpGp' },
    { name: 'Malicious Life', type: 'Cybercrime History', description: 'The history of cybersecurity, malware outbreaks, and notable hackers.', lang: 'en', url: 'https://open.spotify.com/show/2jzD9zn7R2d6erZz2ULLeQ' },
    { name: 'Hacker Valley Studio', type: 'Mindset & Culture', description: 'Exploring the human side of cybersecurity and leadership.', lang: 'en', url: 'https://open.spotify.com/show/6Pmp3DQKUDW6DXBlnGpxkH' },
    { name: 'SANS Internet Storm Center', type: 'Daily Briefing', description: 'Daily threat advisory and technical vulnerability updates.', lang: 'en', url: 'https://open.spotify.com/show/3pl6V7L6KnWdNR59H5dw6n' },
    { name: 'The Social-Engineer Podcast', type: 'Social Engineering', description: 'Focusing on human vulnerability, phishing, and psychology.', lang: 'en', url: 'https://open.spotify.com/show/0CnYnxrAcfRjh0YSQINAwe' },
    { name: 'GRC Weekly Analysis', type: 'Tech & Security', description: 'Expert technical commentary on internet security infrastructure.', lang: 'en', url: 'https://open.spotify.com/show/0EhUctIPJiKrxPjzqIAuDc' },
    { name: 'Cloud Security Podcast', type: 'Cloud & DevOps', description: 'Securing modern cloud environments, containers, and pipelines.', lang: 'en', url: 'https://open.spotify.com/show/7vAbYigR3zs8GYJP3EoVWw' },
    { name: 'DEF CON Pods', type: 'Offensive Security', description: 'Talks and research straight from the world’s premier hacker convention.', lang: 'en', url: 'https://open.spotify.com/show/0cIzWAEYacLz7Ag1n1YhUJ' },
    { name: 'SECurity Weekly', type: 'Weekly Roundtable', description: 'Technical discussions on enterprise security architecture and tools.', lang: 'en', url: 'https://open.spotify.com/show/5fNHU08WoIXXq5Qg0UbrLQ' },
    { name: 'Application Security Weekly', type: 'DevSecOps', description: 'Focusing on secure coding, application vulnerabilities, and defense.', lang: 'en', url: 'https://open.spotify.com/show/57wZcoxW8oNs5Mq7WZfTs7' },
    { name: 'Smash The Stack', type: 'Binary & Exploits', description: 'Deep dives into reverse engineering, malware analysis, and low-level hacking.', lang: 'en', url: 'https://open.spotify.com/show/1KHIsaZ9mX0NbzPrfId00q' },
    { name: 'Decoding Cyber', type: 'Policy & Tech', description: 'Analyzing the intersection of geopolitics, law, and cybersecurity.', lang: 'en', url: 'https://open.spotify.com/show/3J7pBxEu43nCnRTSXaan8S' },
    { name: 'Threat Intelligence Brief', type: 'APT Tracking', description: 'Tracking state-sponsored campaigns, ransomware, and indicators of compromise.', lang: 'en', url: 'https://open.spotify.com/show/49oRKtzgTPoOg3s9Y7Yuyh' }
];