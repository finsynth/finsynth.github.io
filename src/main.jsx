import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Agentation } from "agentation";

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <App /> {import.meta.env.DEV && <Agentation />}
    </BrowserRouter>
  </StrictMode>,
)
