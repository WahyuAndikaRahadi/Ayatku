import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 1. Import fungsi registrasi Service Worker
import { registerSW } from 'virtual:pwa-register'

// 2. Daftarkan Service Worker agar aplikasi bisa jalan offline
// registerType: 'autoUpdate' akan langsung memperbarui app saat ada perubahan
registerSW({ registerType: 'autoUpdate' })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)