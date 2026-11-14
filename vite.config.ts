import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey =
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_API_KEY ||
    process.env.API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    env.VITE_GOOGLE_API_KEY ||
    env.GOOGLE_API_KEY ||
    env.VITE_API_KEY ||
    env.API_KEY ||
    '';

  return {
    base: './',
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
