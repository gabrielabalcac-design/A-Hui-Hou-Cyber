import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth/auth.page';
import { HomePage } from './pages/home/home.page';
import { ModulesPage } from './pages/modules/modules.page';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { GamesHubPage } from './pages/games/games.page';
import { ProfilePage } from './pages/profile/profile.page';
import { PodcastPage } from './pages/podcast/podcast.page';
import { NewsPage } from './pages/news/news.page'; // <--- 1. Importa la página de noticias

export const routes: Routes = [
  // Pantalla de Autenticación inicial
  { path: 'auth', component: AuthPage },

  // Pantalla de Inicio / Dashboard principal
  { path: 'home', component: HomePage },

  // Zona de Juegos y Retos (Arcade)
  { path: 'games', component: GamesHubPage },

  // Sección de Podcasts en Ciberseguridad
  { path: 'podcast', component: PodcastPage },

  // Sección de Noticias e Inteligencia de Ciberseguridad
  { path: 'news', component: NewsPage }, // <--- 2. Añade la ruta aquí

  // Perfil del Operador / Usuario
  { path: 'profile', component: ProfilePage },

  // Lista general de módulos interactivos (DEBE IR ANTES de la ruta con :id)
  { path: 'modules', component: ModulesPage },

  // Detalle dinámico del curso (DEBE IR DESPUÉS de la ruta estática)
  { path: 'modules/:id', component: CourseDetailComponent }, 

  // Ruta por defecto al abrir la aplicación
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  // Comodín para redirigir rutas no encontradas
  { path: '**', redirectTo: 'auth' },

];