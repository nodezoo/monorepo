
import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
} from "react-router-dom"


import { getMain } from './setup'
import App from './App'

import './index.css'

const main = getMain()
console.log('init', main.seneca, main.store)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

