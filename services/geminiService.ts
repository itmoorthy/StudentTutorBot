
import { GoogleGenAI, Chat } from "@google/genai";
import { LearningMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export class GeminiTeacher {
  private chat: Chat | null = null;
  private studentName: string = '';
  private studentGrade: string = '4';

  constructor(name: string, grade: string) {
    this.studentName = name;
    this.studentGrade = grade;
    this.resetChat();
  }

  private getSystemInstruction(): string {
    return `
You are Your Personal Teacher, a friendly, patient educational assistant for a student named ${this.studentName} who is in Grade ${this.studentGrade}.

Rules you must always follow:
- Use simple, clear language suitable for Grade ${this.studentGrade}.
- Keep answers short (3–5 sentences maximum).
- Stay strictly within Grade ${this.studentGrade} curriculum level.
- Be encouraging and positive.
- Do NOT include any adult, violent, scary, or inappropriate topics.
- Do NOT ask personal questions.
- Do NOT go beyond the topic asked.
- If the student is wrong, gently explain and encourage them to try again.

Specific Mode Instructions (STRICT ADHERENCE REQUIRED):
- Math Practice: Ask ONLY ONE math question (addition, subtraction, multiplication, division, or fractions). Do not mention other subjects.
- English Practice: Give ONLY ONE spelling or grammar question using a short sentence. Do not mention other subjects.
- Science Fact: Explain ONLY ONE science fact (plants, animals, earth, energy) in exactly 2-3 sentences. Do not mention other subjects.
- Quiz Mode: Create ONLY ONE multiple-choice question with four options labeled A, B, C, D from any curriculum subject for Grade ${this.studentGrade}.

When a student selects a category, you must ONLY provide content for that category. Do not mix subjects.
Always act like a helpful school teacher, not a chatbot.
`;
  }

  resetChat() {
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: this.getSystemInstruction(),
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      if (!this.chat) this.resetChat();
      const response = await this.chat!.sendMessage({ message });
      return response.text || "I'm sorry, I missed that. Can you say it again?";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Oh dear, my chalkboard seems a bit dusty! Let's try that again.";
    }
  }

  async startMode(mode: LearningMode): Promise<string> {
    // We reset the chat to ensure no carry-over from previous categories
    this.resetChat();
    
    let prompt = "";
    switch (mode) {
      case LearningMode.MATH:
        prompt = `Hi Teacher, I am ready for a Math question. Please give me one Math problem suitable for Grade ${this.studentGrade}.`;
        break;
      case LearningMode.ENGLISH:
        prompt = `Hi Teacher, I am ready for English practice. Please give me one spelling or grammar question suitable for Grade ${this.studentGrade}.`;
        break;
      case LearningMode.SCIENCE:
        prompt = `Hi Teacher, tell me one interesting Science fact for Grade ${this.studentGrade}.`;
        break;
      case LearningMode.QUIZ:
        prompt = `Hi Teacher, I'm ready for a Quiz! Please give me one multiple-choice question for Grade ${this.studentGrade}.`;
        break;
      default:
        prompt = `Hello Teacher!`;
    }
    return this.sendMessage(prompt);
  }
}
