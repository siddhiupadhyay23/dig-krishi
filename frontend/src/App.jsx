import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './mainroutes/MainRouter'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <BrowserRouter>
            <MainRouter />
          </BrowserRouter>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
