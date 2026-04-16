import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.js'],
      thresholds: {
        lines: 92,
        functions: 92,
        branches: 85,
        statements: 92,
      },
    },
  },
  preview: {
    allowedHosts: ['.run.app'],
  },
})
