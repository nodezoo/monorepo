const Express = require('express')
const Stripe = require('stripe')


const { authenticate } = require('./middlewares/authenticate')
const { stripeWebhook } = require('./middlewares/stripe_webhook')


function makeStripeApi({ seneca }, options) {
  const {
    stripe_api_key = null
  } = options

  if (null == stripe_api_key) {
    throw new Error('the stripe_api_key option is missing')
  }

  const stripe = Stripe(stripe_api_key)


  const { nodezoo_app_url = null } = options

  if (null == nodezoo_app_url) {
    throw new Error('the NODEZOO_APP_URL option is missing')
  }


  const api = new Express.Router()


  api.post('/create-premium-membership-checkout-session',

    Express.json(),

    authenticate({ seneca }),

    async (req, res, next) => {
      const { user: { id: user_id } } = req.auth$

      try {
        const stripe_session = await stripe.checkout.sessions.create({
          metadata: {
            user_id
          },

          line_items: [
            {
              quantity: 1,

              price_data: {
                unit_amount: 2700,
                currency: 'USD',

                product_data: {
                  name: 'Nodezoo Premium'
                }
              }
            }
          ],

          payment_method_types: [
            'card',
          ],

          mode: 'payment',

          success_url: `${nodezoo_app_url}/account`,
          cancel_url: `${nodezoo_app_url}/account`,
        })


        return res.json({ stripe_session_url: stripe_session.url })
      } catch (err) {
        return next(err)
      }
    })


  api.post('/premium-membership-checkout-webhook',

    Express.raw({ type: 'application/json' }),

    stripeWebhook({ seneca }, options),

    async (req, res, next) => {
      const { stripe_event$: event } = req

      console.dir('premium membership stripe webhook: incoming')
      console.dir(`premium membership stripe webhook: ${event.type}`)

      if ('checkout.session.completed' === event.type) {
        const session = event.data.object

        if ('paid' === session.payment_status) {
          try {
            await fulfillOrder(session)

            return res.sendStatus(200)
          } catch (err) {
            return next(err)
          }
        }
      }

      return res.sendStatus(200)
    })


  async function fulfillOrder(stripe_session) {
    const { user_id } = stripe_session.metadata

    console.dir('fulfilling the order...')
    console.dir(`promoting the user with id ${user_id} to premium`)


    await seneca.post('add:user,role:group', {
      user_id,
      code: 'PremiumUsers'
    })
  }


  return api
}


module.exports = makeStripeApi
