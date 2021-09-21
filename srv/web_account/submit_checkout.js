const Shared = require('../../lib/shared')
const { pick } = Shared


module.exports = function make_submit_checkout() {
  return async function submit_checkout(msg, meta) {
    const seneca = this


    const user_id = meta.custom?.principal?.user?.id

    if (null == user_id) {
      return {
        ok: false,
        why: 'unauthorized'
      }
    }


    const payment_res = await seneca
      .post('role:payment,process:payment', { user_id })

    if (!payment_res.ok) {
      return { ok: false, why: 'checkout-failed' }
    }


    const premium_res = await seneca
      .post('role:user,join:premium', { user_id })

    if (!premium_res.ok) {
      return { ok: false, why: 'checkout-failed' }
    }


    try {
      const user = await seneca.make('sys', 'user')
        .load$(user_id)

      const { email } = user

      await sendWelcomingEmail({ email }, { seneca })
    } catch (err) {
      console.error(err)
      /* ignore errors by the mailer */
    }


    return { ok: true }
  }
}


// TODO: Tidy up.
//
async function sendWelcomingEmail(args, ctx) {
  const { email } = args
  const { seneca } = ctx

  await seneca.post('sys:mail,send:mail', {
    to: email,

    from: 'noreply@voxgig.com',

    subject: 'Thank you for choosing Nodezoo Premium',

    text: 'Thank you for choosing Nodezoo Premium!' +
      " We understand it's a big decision who you premium with," +
      ' and we are priviliged to have been chosen!',

    html: `
      <html>
        <head>
          <p>
            Thank you for choosing Nodezoo Premium! We understand it's a big decision who you premium with, and we are priviliged to have been chosen!
          </p>
        </head>
      </html>
    `
  })
}

