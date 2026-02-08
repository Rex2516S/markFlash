import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // This helps when running locally with .env files or on Cloudflare with Environment Variables.
  // We explicitly cast process to any to avoid TS errors if Node types are missing/incomplete
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This is crucial: It replaces 'process.env.API_KEY' in your client code 
      // with the actual string value of the key from the build environment.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      
      // Prevents "process is not defined" errors for libraries that might expect Node.js globals
      'process.env': {} 
    }
  };
});