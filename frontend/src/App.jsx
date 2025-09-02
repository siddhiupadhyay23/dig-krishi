import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './mainroutes/MainRouter'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
