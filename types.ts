
export enum LearningMode {
  IDLE = 'IDLE',
  MATH = 'MATH',
  ENGLISH = 'ENGLISH',
  SCIENCE = 'SCIENCE',
  QUIZ = 'QUIZ'
}

export interface ChatMessage {
  role: 'teacher' | 'student';
  text: string;
  timestamp: Date;
}

export interface TeacherState {
  isThinking: boolean;
  currentMode: LearningMode;
  messages: ChatMessage[];
}
