const Stripe = require('stripe')


function stripeWebhook({ seneca }, options) {
  const {
    stripe_webhook_endpoint_secret = null
  } = options

  if (null == stripe_webhook_endpoint_secret) {
    throw new Error('the stripe_webhook_endpoint_secret option is missing')
  }


  const {
    stripe_api_key = null
  } = options

  if (null == stripe_api_key) {
    throw new Error('the stripe_api_key option is missing')
  }

  const stripe = Stripe(stripe_api_key)

  return (req, res, next) => {
    let event

    try {
      const payload = req.body
      const sig = req.headers['stripe-signature']

      if (null == sig) {
        throw new Error('sig')
      }

      event = stripe.webhooks
        .constructEvent(payload, sig, stripe_webhook_endpoint_secret)

      // NOTE: At this point we have verified that the event has indeed
      // come from Stripe. 

    } catch (err) {
      return res.sendStatus(400)
    }


    req.stripe_event$ = event

    return next()
  }
}


module.exports = { stripeWebhook }
