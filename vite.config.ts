import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_* variables automatically. These two values are
  // intentionally embedded because a Supabase project URL and anon key are
  // public browser credentials; the service-role key is never exposed here.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __SUPABASE_URL__: JSON.stringify(env.SUPABASE_URL || ''),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.SUPABASE_ANON_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  };
});
