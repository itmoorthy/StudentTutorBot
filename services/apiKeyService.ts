
const API_KEY_STORAGE_KEY = 'tutorbot_gemini_api_key';

export const apiKeyService = {
  saveKey: (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  },
  getKey: (): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },
  clearKey: () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },
  hasKey: (): boolean => {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    return !!key && key.trim().length > 0;
  }
};
