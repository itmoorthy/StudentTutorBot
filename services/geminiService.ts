import { GoogleGenAI, Chat } from "@google/genai";
import { LearningMode } from "../types";

export class GeminiTeacher {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private studentName: string = '';
  private studentGrade: string = '4';

  constructor(name: string, grade: string) {
    // Robust API Key retrieval for local Vite and production
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) ||
                   (typeof process !== 'undefined' ? (process as any).env?.API_KEY : undefined) ||
                   (typeof window !== 'undefined' ? (window as any).API_KEY : undefined);
    
    this.ai = new GoogleGenAI({ apiKey: apiKey || "" });
    this.studentName = name;
    this.studentGrade = grade;
    this.resetChat();
  }

  private getSystemInstruction(): string {
    return `
You are a friendly, patient teacher for Grade ${this.studentGrade} students. 
The student's name is ${this.studentName}.

Rules you must always follow:
- Use simple, clear language suitable for Grade ${this.studentGrade}.
- Keep answers short (3–5 sentences maximum).
- Stay strictly within Grade ${this.studentGrade} curriculum level.
- Be encouraging and positive.
- Do NOT include any adult, violent, scary, or inappropriate topics.
- Do NOT ask personal questions.
- Do NOT go beyond the topic asked.
- Use examples that are easy to understand.
- If the student is wrong, gently explain and encourage them to try again.

Subjects you can help with:
- Math (addition, subtraction, multiplication, division, fractions)
- English (spelling, grammar, reading comprehension)
- Science (basic plants, animals, earth, energy)
- Social Studies (maps, communities, history basics)

Always act like a helpful school teacher, not a chatbot.
`;
  }

  resetChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: this.getSystemInstruction(),
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      if (!this.chat) this.resetChat();
      const response = await this.chat!.sendMessage({ message });
      return response.text || "No response from AI.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Oh dear, my chalkboard seems a bit dusty! Please check if your API key is set correctly in your .env file and try again.";
    }
  }

  async startMode(mode: LearningMode): Promise<string> {
    this.resetChat();
    let prompt = "";
    switch (mode) {
      case LearningMode.MATH:
        prompt = "Ask me one 4th grade math question. Do not give the answer immediately.";
        break;
      case LearningMode.ENGLISH:
        prompt = "Give me one 4th grade spelling or grammar question using a short sentence.";
        break;
      case LearningMode.SCIENCE:
        prompt = "Explain one interesting science fact for a 4th grade student in exactly 2–3 sentences.";
        break;
      case LearningMode.QUIZ:
        prompt = "Create one multiple-choice question for 4th grade with options A, B, C, D.";
        break;
      default:
        prompt = "Hello!";
    }
    return this.sendMessage(prompt);
  }
}