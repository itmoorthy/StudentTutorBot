
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simplified Vite configuration. 
// Removed loadEnv which caused a 'cwd' property error on 'Process' type.
// Removed the 'define' block for API_KEY as it is automatically injected 
// into process.env.API_KEY in the execution context per guidelines.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
