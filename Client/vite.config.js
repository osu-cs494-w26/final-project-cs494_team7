import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  preview: {
    allowedHosts: [
      'gamedeals.top'
    ]
  }
  // server: {
  //   proxy: {
  //     '/wishlist': 'http://localhost:5000'
  //   },
  // },
})
