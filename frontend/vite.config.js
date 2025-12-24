import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Автоматически обновляет приложение, когда ты пушишь новый код
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Finance IQ Manager",
        short_name: "FinanceIQ",
        description: "Учет расходов и доходов с аналитикой",
        theme_color: "#570df8", // Цвет верхней полоски в телефоне (под цвет DaisyUI)
        background_color: "#ffffff",
        display: "standalone", // САМОЕ ВАЖНОЕ: запускает как апку без рамок браузера
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Чтобы иконка красиво вписывалась в круги/квадраты на Android
          },
        ],
      },
    }),
  ],
});
