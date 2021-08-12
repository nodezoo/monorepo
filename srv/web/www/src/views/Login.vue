<template>
  <v-form @submit.prevent="loginUser">
    <v-text-field
      v-model="email"
      type="email"
      label="Email"
    ></v-text-field>

    <v-text-field
      v-model="pass"
      type="password"
      label="Password"
    ></v-text-field>

    <v-btn type="submit">Sign in</v-btn>
  </v-form>
</template>

<script>
  import Api from '@/lib/api'

  export default {
    name: 'Login',

    data: () => ({
      email: '',
      pass: ''
    }),

    methods: {
      async loginUser() {
        const auth = await Api.loginUser({
          email: this.email,
          pass: this.pass
        })

        const is_successful = 200 === auth.status &&
          auth.data.ok &&
          'auth_token' in auth.data.data

        if (!is_successful) {
          return
        }

        const { data: { auth_token } } = auth.data

        this.$session.start()
        this.$session.set('AUTH_TOKEN', auth_token)


        this.$router.push('/')

        return
      }
    }
  }
</script>
