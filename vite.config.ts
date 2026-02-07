import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Defines process.env for the geminiService to work without crashing, 
    // though in production you should rely on import.meta.env or Cloudflare environment variables properly.
    // For this specific setup, we map process.env to a safe object.
    'process.env': {} 
  }
});