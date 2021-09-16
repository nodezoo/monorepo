const Uuid = require('uuid')


module.exports = function make_pass_reset() {
  return async function pass_reset(msg) {
    const seneca = this


    if (null == typeof msg.email) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['email'],
          why_exactly: 'required'
        }
      }
    }

    const { email } = msg


    // TODO: QUESTION: Use @seneca/user to fetch the user?
    //
    const nodezoo_user = await seneca.make('sys', 'user')
      .load$({ email })


    if (nodezoo_user) {
      /* NOTE: WARNING: As a security precaution, we are not going to
       * inform the user (who may potentially be a hacker) of whether
       * an account with the given email exists or not.
       */

      const { id: user_id } = nodezoo_user

      const reset_token_ent = await seneca
        .make('nodezoo', 'pass_reset_token')
        .data$({
          user_id,
          value: Uuid.v4(),
          was_used: false
        })
        .save$()


      const { value: reset_token } = reset_token_ent

      await sendRecoveryLinkEmail({ email, reset_token }, { seneca })
    }


    return { ok: true }
  }
}


// TODO: Tidy up.
//
async function sendRecoveryLinkEmail(args, ctx) {
  if (null == process.env.EMAILS_ENABLED) {
    return
  }

  const { email, reset_token } = args
  const { seneca } = ctx

  // TODO: Do not hardcode this.
  //
  const reset_link = `http://localhost:8080/resetpass?token=${reset_token}`

  await seneca.post('sys:mail,send:mail', {
    to: email,

    from: 'noreply@voxgig.com',

    subject: 'Your Nodezoo password reset',

    text: 'You are receiving this because you or someone else' +
      ' has requested a password reset. Please paste the link' +
      ' below into your browser to complete the process:' +
      '\n' + reset_link,

    html: '<html><body><p>' +
      'You are receiving this because you or someone else' +
      ' has requested a password reset. Please paste the link' +
      ' below into your browser to complete the process:' +
      `\n<a href="${reset_link}"'>${reset_link}</a>` +
      '</p></body></html>',
  })
}
