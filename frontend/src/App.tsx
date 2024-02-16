
import React, {
  Suspense,
  useEffect,
  useState,
} from 'react'

import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from "react-router-dom"

import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'


import { SenecaProvider } from '@seneca/redux'

import { getMain } from './setup'

import './App.css'


const Public = React.lazy(() => import('./public/Public'))
const Private = React.lazy(() => import('./private/Private'))

const main = getMain()


/*
TODO: move to notes in podmind widget
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'foo-island': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
 */


function Loading() {
  return (
    <div>
      <img src="/nodezoo.png" />
    </div>
  )
}


function buildRouter(user?: any) {
  // build from model and user
  const routes = [
    {
      path: '*',
      element: <Suspense fallback={<Loading />}><Public /></Suspense>,
    },
    user && {
      // path: '/view/:view/:subview?/:item?/:subitem?/*',
      path: '/view/:view/*',
      element: <Suspense fallback={<Loading />}><Private /></Suspense>,
    },
  ].filter(r=>null!=r)

  console.log('ROUTES', routes)
  
  const router = createBrowserRouter(routes)
  return router
}


function buildTheme(user?: any) {
  // build from model and user
  const theme = createTheme({

  })
  return theme
}


function App() {
  const { seneca, theme, router } = main
  const [ready, setReady] = useState('init')
  // const [user, setUser] = useState(null)

  useEffect(()=>{
    if('init' !== ready) {
      return
    }
    init()
    
    async function init() {
      await seneca.ready()
      const auth = await seneca.post('aim:req,on:auth,load:auth,debounce$:true')

      if(auth?.ok) {
        // These may have dependencies on the user.
        main.theme = buildTheme(auth.user)
        main.router = buildRouter(auth.user)

        // setUser(auth.user)
        setReady('done')
      }
    }
  },[])

  // <RouterProvider router={router} />

  /*
            <BrowserRouter>
            <Routes>
              <Route path="*"
                element={<Suspense fallback={<Loading />}><Public /></Suspense>} />
              { user &&
                <Route path="/view/:view/*"
                  element={<Suspense fallback={<Loading />}><Private /></Suspense>} />
              }
            </Routes>
          </BrowserRouter>

  */
  
  return (
    'done' === ready ?
    <Provider store={seneca.export('Redux/store')}>
      <SenecaProvider seneca={seneca}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </SenecaProvider>
    </Provider>
      :
    <Loading />
  )
}



export default App
