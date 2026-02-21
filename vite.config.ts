
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use process.cwd() to load environment variables. We cast process to any to avoid TypeScript errors
  // in environments where the Process type might be restricted or polyfilled.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || env.API_KEY || '')
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true
    }
  };
});
