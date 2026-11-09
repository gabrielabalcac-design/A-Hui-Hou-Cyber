export type NavIconName = 'home' | 'courses' | 'games' | 'podcast' | 'news' | 'profile';

export interface NavItem {
  id: 'home' | 'modules' | 'games' | 'podcast' | 'news' | 'profile';
  path: string;
  es: string;
  en: string;
  icon: NavIconName;
}

/** Navegación principal: la comparten la barra inferior (móvil) y el menú lateral (PC). */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home',    path: '/home',    es: 'Hogar',   en: 'Home',    icon: 'home' },
  { id: 'modules', path: '/modules', es: 'Cursos',  en: 'Courses', icon: 'courses' },
  { id: 'games',   path: '/games',   es: 'Juegos',  en: 'Games',   icon: 'games' },
  { id: 'podcast', path: '/podcast', es: 'Podcast', en: 'Podcast', icon: 'podcast' },
  { id: 'news', path: '/news', es: 'Noticias', en: 'News', icon: 'news' },
  { id: 'profile', path: '/profile', es: 'Perfil',  en: 'Profile', icon: 'profile' }
];
