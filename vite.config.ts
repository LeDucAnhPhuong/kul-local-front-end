import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false, // giảm kích thước build
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor_react';
            if (id.includes('quill')) return 'vendor_quill';
            if (id.includes('lodash')) return 'vendor_lodash';
            if (id.includes('framer-motion')) return 'vendor_motion';
            if (id.includes('@radix-ui')) return 'vendor_radix';
            if (id.includes('zod')) return 'vendor_zod';
            if (id.includes('date-fns')) return 'vendor_date';
            if (id.includes('uuid')) return 'vendor_uuid';
            if (id.includes('recharts')) return 'vendor_chart';
            if (id.includes('axios')) return 'vendor_axios';
            if (id.includes('react-router')) return 'vendor_router';
            if (id.includes('clsx')) return 'vendor_clsx';
            if (id.includes('html-to-text')) return 'vendor_html';
            if (id.includes('@dnd-kit')) return 'vendor_dnd';
            if (id.includes('@reduxjs')) return 'vendor_redux';
            if (id.includes('react-hook-form')) return 'vendor_rhf';
            return 'vendor_misc'; // phần còn lại chưa bắt được
          }
        },
      },
    },
  },
});
