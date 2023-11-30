
import React, {
  Suspense,
} from 'react'

import { useSelector, Provider } from 'react-redux'


import { getMain } from './setup'

import './App.css'

import Public from './public/Public'

const Private = React.lazy(() => import('./private/Private'))



function Loading() {
  return (<img src="/nodezoo.png" />)
}



function AppRoot() {
  let main = getMain()

  let authState = useSelector((state:any)=>state.main.auth.state)

  if('none' === authState) {
    main.seneca.act('aim:web,on:auth,load:auth,debounce$:true')
  }

  let root =
    'none' === authState ?
    <Loading />
      :

    'signedout' === authState ?
    <Suspense fallback={<Loading />}>
      <Public>
      </Public>
    </Suspense>
      :

    'signedin' === authState ?
    <Suspense fallback={<Loading />}>
      <Private>
      </Private>
    </Suspense>
      :
    <div></div>

  return root  
}



function App() {
  const main = getMain()
  console.log('app main', !!main.store)
  
  return (
    <Provider store={main.store}>
      <AppRoot></AppRoot>
    </Provider>
  )
}



export default App
