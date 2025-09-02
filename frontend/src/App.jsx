import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './mainroutes/MainRouter'
import { LanguageProvider } from './context/LanguageContext'

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
