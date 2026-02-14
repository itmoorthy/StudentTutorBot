import React, { useState, useEffect, useRef } from 'react';
import { LearningMode, ChatMessage } from './types';
import { GeminiTeacher } from './services/geminiService';
import { TeacherAvatar } from './components/TeacherAvatar';
import { ModeCard } from './components/ModeCard';

const App: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('4');
  
  const [mode, setMode] = useState<LearningMode>(LearningMode.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  
  const teacherRef = useRef<GeminiTeacher | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables.");
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.API_KEY) {
      setApiKeyError(true);
      return;
    }
    if (studentName.trim()) {
      try {
        teacherRef.current = new GeminiTeacher(studentName, studentGrade);
        setIsOnboarded(true);
        setMessages([
          {
            role: 'teacher',
            text: `Hello ${studentName}! I'm Your Personal Teacher. I'm so happy to help you learn today. What would you like to study in Grade ${studentGrade}?`,
            timestamp: new Date()
          }
        ]);
      } catch (err) {
        setApiKeyError(true);
      }
    }
  };

  const handleModeSelect = async (selectedMode: LearningMode) => {
    setMode(selectedMode);
    setMessages([]);
    setIsThinking(true);
    
    if (teacherRef.current) {
      const response = await teacherRef.current.startMode(selectedMode);
      setMessages([{
        role: 'teacher',
        text: response,
        timestamp: new Date()
      }]);
    }
    setIsThinking(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const studentMessage: ChatMessage = {
      role: 'student',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, studentMessage]);
    setInputText('');
    setIsThinking(true);
    if (isListening) recognitionRef.current?.stop();

    if (teacherRef.current) {
      const response = await teacherRef.current.sendMessage(inputText);
      setMessages(prev => [...prev, {
        role: 'teacher',
        text: response,
        timestamp: new Date()
      }]);
    }
    setIsThinking(false);
  };

  const resetToHome = () => {
    setMode(LearningMode.IDLE);
    setMessages([
      {
        role: 'teacher',
        text: `Welcome back, ${studentName}! Which subject should we try next?`,
        timestamp: new Date()
      }
    ]);
  };

  if (apiKeyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-200 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">API Key Missing</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            I can't start the lesson without my teaching materials! Please make sure you have created a <b>.env</b> file in your project folder with your <b>API_KEY</b>.
          </p>
          <button 
            onClick={() => setApiKeyError(false)}
            className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-300">
          <div className="text-center mb-8">
            <TeacherAvatar />
            <h1 className="text-4xl font-bold text-blue-600 mt-4 tracking-tight font-display">TutorBot</h1>
            <p className="text-slate-500 mt-2">Your Personal Teacher is ready to meet you!</p>
          </div>
          <form onSubmit={handleOnboard} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What is your name?</label>
              <input 
                required
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Type your name here..."
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-yellow-400 focus:bg-white outline-none transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What grade are you in?</label>
              <select 
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-yellow-400 focus:bg-white outline-none transition-all text-lg appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-4 rounded-2xl text-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              Start Learning! 🎒
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto shadow-2xl bg-white overflow-hidden border-x border-slate-100">
      {/* Header */}
      <header className="bg-yellow-400 p-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-4">
          <TeacherAvatar isThinking={isThinking} />
          <div>
            <h1 className="text-2xl font-bold text-yellow-900 leading-tight tracking-wide font-display">TutorBot</h1>
            <p className="text-sm font-medium text-yellow-800">Your Personal Teacher</p>
            <div className="mt-2 inline-flex items-center bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-yellow-900 shadow-sm space-x-2">
              <span>🌟</span>
              <span className="tracking-wider">{studentName}</span>
              <span className="opacity-40">|</span>
              <span>Grade {studentGrade}</span>
            </div>
          </div>
        </div>
        {mode !== LearningMode.IDLE && (
          <button 
            onClick={resetToHome}
            className="bg-white/80 hover:bg-white text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm transition-all text-sm active:scale-95"
          >
            Home 🏠
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        {mode === LearningMode.IDLE ? (
          <div className="p-8 flex-1 overflow-y-auto">
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-8 tracking-wide px-4 leading-normal font-display">
              What shall we study, <span className="inline-block px-1 text-yellow-600">{studentName}</span>?
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <ModeCard 
                mode={LearningMode.MATH} 
                icon="➕" 
                title="Math" 
                color="bg-orange-400" 
                onClick={handleModeSelect} 
              />
              <ModeCard 
                mode={LearningMode.ENGLISH} 
                icon="📖" 
                title="English" 
                color="bg-blue-400" 
                onClick={handleModeSelect} 
              />
              <ModeCard 
                mode={LearningMode.SCIENCE} 
                icon="🔬" 
                title="Science" 
                color="bg-green-500" 
                onClick={handleModeSelect} 
              />
              <ModeCard 
                mode={LearningMode.QUIZ} 
                icon="🧠" 
                title="Quiz" 
                color="bg-purple-500" 
                onClick={handleModeSelect} 
              />
            </div>
            
            <div className="mt-12 p-8 bg-yellow-50 rounded-3xl border-4 border-dashed border-yellow-200 text-center float-animation">
              <p className="text-yellow-700 font-bold italic text-lg">
                "Keep going, {studentName}! You're doing great!" 🌟
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'teacher' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-lg leading-relaxed ${
                      msg.role === 'teacher' 
                        ? 'bg-white text-slate-800 border-l-8 border-yellow-400 rounded-tl-none' 
                        : 'bg-blue-500 text-white rounded-br-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none border-l-8 border-yellow-400 animate-pulse text-slate-400 flex items-center gap-2">
                    <span className="text-xl">✏️</span>
                    <span>Teacher is writing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form with Speech */}
            <div className="p-4 bg-white border-t-2 border-slate-100 shadow-lg">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? "I'm listening..." : "Type your answer here..."}
                    className={`w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 transition-all text-lg outline-none ${
                      isListening ? 'border-red-400 bg-red-50 ring-4 ring-red-100' : 'border-slate-100 focus:border-yellow-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 p-2 rounded-xl transition-all ${
                      isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title="Speak your answer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isThinking || !inputText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-6 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-md flex-shrink-0"
                >
                  Send 🚀
                </button>
              </form>
              {isListening && (
                <div className="flex items-center gap-2 mt-2 px-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Recording... Speak clearly!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white p-4 text-center text-sm text-slate-400 border-t border-slate-100">
        TutorBot Classroom • Grade {studentGrade} • Friendly Learning Environment
      </footer>
    </div>
  );
};

export default App;