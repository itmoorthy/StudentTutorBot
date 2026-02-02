
# TutorBot 🎒

TutorBot is a friendly, patient, AI-powered educational assistant designed for grade-school students. It helps children practice Math, English, Science, and Social Studies in a safe, encouraging, and interactive environment.

## ✨ Features

- **Personalized Learning**: Adapts to the student's name and grade level.
- **Voice Interaction**: Students can speak their answers using built-in speech-to-text.
- **Categorized Practice**:
  - ➕ **Math**: Addition, subtraction, multiplication, and more.
  - 📖 **English**: Spelling and grammar challenges.
  - 🔬 **Science**: Fun and educational science facts.
  - 🧠 **Quiz Mode**: Interactive multiple-choice questions across different subjects.
- **Encouraging Persona**: Acts as "Your Personal Teacher," providing positive reinforcement.
- **Safe for Kids**: Strictly follows grade-appropriate curricula and avoids inappropriate topics.

## 🚀 Getting Started

### Prerequisites

- An API Key for the **Google Gemini API**.
- A modern web browser with Microphone permissions enabled (for voice features).

### Project Structure

This project uses standard ES6 modules and a clean React structure.

- `App.tsx`: The main application shell and UI.
- `services/geminiService.ts`: Integration with the Google Gemini API.
- `components/`: Reusable UI components for the teacher avatar and learning modes.
- `types.ts`: TypeScript definitions for the application state.

## 🛠️ Technology Stack

- **Frontend**: React (v19)
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Voice**: Web Speech API (`SpeechRecognition`)
- **Icons**: Lucide React & Custom Emojis

---

*Happy Learning with TutorBot!* 🌟

Test