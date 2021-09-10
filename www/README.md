# basic

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Notes
For Stripe to work, our webhook needs to be registered. Upon live deployment
this needs be done on the Stripe dashboard. For local dev deployments, you
only need a Stripe CLI. Once you run the project via `npm run local`, run
this command in a separate terminal:

```
stripe listen --f forward-to $LOCALHOST:9000/api/stripe/premium-membership-checkout-webhook
```

