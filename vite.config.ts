import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey =
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
