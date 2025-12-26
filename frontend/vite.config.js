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
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Finance IQ Manager",
        short_name: "FinanceIQ",
        description: "Учет расходов и доходов с аналитикой",
        theme_color: "#570df8",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "logo.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo.jpg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Чтобы иконка красиво вписывалась в круги/квадраты на Android
          },
        ],
      },
    }),
  ],
});
