import "./styles/global.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Rotas from "./rotas.jsx";

import { AuthProvider } from "./pages/login/AuthProvider.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Rotas />
  </AuthProvider>
)
