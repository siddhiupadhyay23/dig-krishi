import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './mainroutes/MainRouter'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import LanguageBodyClass from './components/LanguageBodyClass'
import './styles/LanguageStyles.scss'

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <BrowserRouter>
            <LanguageBodyClass />
            <MainRouter />
          </BrowserRouter>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
