import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sora'
import '@fontsource/pacifico/latin-400.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
