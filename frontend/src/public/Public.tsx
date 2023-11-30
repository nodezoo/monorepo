import React from 'react'

import { getMain } from '../setup'

import { BasicAuth } from '@voxgig/model-react'

const main = getMain()

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca
})

const specdef: any = {
  auth: {
    frame: 'public',
    title: 'Sign in',
    img: {
      logo: '/nodezoo.png'
    },
    handle: {}
  }
}

specdef.auth.handle.signin = function signin (
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)

  main.seneca.act(
    'aim:web,on:auth,signin:user',
    {
      email: data.get('email'),
      password: data.get('password')
    },
    function (err: any, out: any) {
      if (out.ok) {
        document.location.href =
          document.location.origin + '/view/content/index'
      }
    }
  )
}

function Public (props: any) {
  const main = getMain()

  return (
    <div className='Public'>
      <BasicAuth spec={specdef.auth} />
    </div>
  )
}

export default Public
