
import React, { useState } from 'react';
import { Key, X, Save } from 'lucide-react';
import { apiKeyService } from '../services/apiKeyService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [key, setKey] = useState(apiKeyService.getKey() || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    apiKeyService.saveKey(key.trim());
    onSave(key.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-400 animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Key size={24} />
            </div>
            <h2 className="text-2xl font-bold font-display">Set API Key</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <p className="text-slate-600 leading-relaxed">
            To use TutorBot, you need a Gemini API key. You can get one for free from the 
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 font-bold hover:underline mx-1"
            >
              Google AI Studio
            </a>.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Your API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError('');
              }}
              placeholder="Paste your key here..."
              className={`w-full p-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all text-lg ${
                error ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-blue-400 focus:bg-white'
              }`}
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
