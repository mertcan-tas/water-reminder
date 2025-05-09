import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from 'unplugin-fonts/vite'
import vueDevTools from "vite-plugin-vue-devtools";


import { fileURLToPath, URL } from "node:url";
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vueDevTools(),
    Vuetify(),
    Components({
      dirs: [
        'src/assets',
        'src/components',
        'src/layouts'
      ],
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['vuetify'],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        // additionalData: `@import "@/assets/Lato/font.css";`
      },
      sass: {
        api: 'modern-compiler',
      },
    },
  },
}));
