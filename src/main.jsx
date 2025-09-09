import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './hook/useLanguage'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider initial="en">
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
