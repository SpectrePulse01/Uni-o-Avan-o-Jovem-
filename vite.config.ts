import { defineConfig } from 'vite';
export default defineConfig({base:"./",build:{rollupOptions:{onwarn(warning,warn){
  // Client-only export uses React client components; the directive is intentionally inert.
  if(warning.code==='MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
  warn(warning);
}}}});
