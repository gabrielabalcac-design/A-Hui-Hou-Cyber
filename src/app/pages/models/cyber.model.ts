export type DifficultyLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Lesson {
  id: string;
  title: string;
  caseDescription: string;
  hint?: string;                 // Pista de investigación
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  points: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  
  // --- NUEVAS PROPIEDADES PARA LAS RUTAS Y EVIDENCIAS ---
  route?: DifficultyLevel;       // Ruta a la que pertenece (Principiante, Intermedio, Avanzado)
  isUnlocked?: boolean;          // Si está desbloqueado o bloqueado
  requiredModuleId?: string;     // ID del módulo previo obligatorio (prerrequisito)
  evidenceId?: string;           // ID vinculado al escritorio de evidencias digitales
  interactiveScenario?: boolean; // Si cuenta con simulación interactiva / rol en tiempo real
  
  isTerminalChallenge?: boolean; // Indicador para minijuego de terminal
  completed?: boolean;
}

export interface UserProfile {
  name: string;
  points: number;
  streak: number;                // Rachas de días
  badges: string[];
  completedLessons: string[];
}