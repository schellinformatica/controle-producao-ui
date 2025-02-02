import "./styles/global.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Rotas from "./rotas.jsx";

createRoot(document.getElementById('root')).render(
    <Rotas />
)
