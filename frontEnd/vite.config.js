import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist', // Ensure the output directory is set correctly
    sourcemap: true, // Optional: Helps with debugging in production
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Splitting vendor code
          }
        }
      }
    }
  }
});
