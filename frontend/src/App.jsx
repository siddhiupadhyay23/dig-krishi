import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './mainroutes/MainRouter'

const App = () => {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  )
}

export default App
