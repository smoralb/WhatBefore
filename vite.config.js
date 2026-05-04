import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/WhatBefore/',
  build: {
    outDir: 'docs'
  },
  server: {
    host: true,
    port: 5173
  }
})
