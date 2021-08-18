
module.exports = function make_reset_pass() {
  return async function reset_pass(msg) {
    const seneca = this


    const { reset_token } = msg

    if (null == reset_token) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['reset_token'],
          why_exactly: 'required'
        }
      }
    }


    const { new_pass } = msg

    if (null == new_pass) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['new_pass'],
          why_exactly: 'required'
        }
      }
    }


    const { new_pass_confirmation } = msg

    if (null == new_pass_confirmation) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['new_pass_confirmation'],
          why_exactly: 'required'
        }
      }
    }


    if (new_pass !== new_pass_confirmation) {
      return { ok: false, why: 'please-confirm' }
    }


    const reset_token_ent = await seneca.make('nodezoo', 'pass_reset_token')
      .load$({
        value: reset_token,
        was_used: false
      })

    if (!reset_token_ent) {
      return { ok: false, why: 'bad-reset-token' }
    }


    const { user_id } = reset_token_ent

    const pass_change = await seneca.post('sys:user,change:pass',
      { user_id, pass: new_pass })

    if (!pass_change.ok) {
      console.error(pass_change)
      return { ok: false, why: 'pass-change-failed' }
    }


    await reset_token_ent
      .data$({ was_used: true })
      .save$()


    return { ok: true }
  }
}

