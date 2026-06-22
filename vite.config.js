# FICHIER 3 : vite.config.js  (à la racine)
# ─────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})


# ─────────────────────────────────────────
# FICHIER 4 : src/main.jsx  (dans le dossier src/)
# ─────────────────────────────────────────
import React from 'react'
import ReactDOM from 'react-dom/client'
import BudgetImpactApp from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BudgetImpactApp />
  </React.StrictMode>,
)

