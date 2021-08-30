<template>
  <div>
    <form @submit.prevent="onLoginAttempt">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="pass" type="password" placeholder="Password" />
      <input type="submit" value="Sign in" />
    </form>
    <router-link to="/forgot">Forgot password?</router-link>
    <a :href="githubSignInLink">Sign in with GitHub</a>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'PublicHome',

  computed: {
    githubSignInLink() {
      const client_id = '1172dca59945c160eef9'

      return 'https://github.com/login/oauth/authorize' +
        `?scope=user:email&client_id=${client_id}`
    }
  },

  data: () => ({
    email: '',
    pass: ''
  }),

  methods: {
    async onLoginAttempt() {
      const { email, pass } = this
      const loginResponse = await Api.loginUser({ email, pass })

      if (loginResponse.data.ok) {
        location.href = '/account'
      }
    }
  }
}
</script>

<style lang="scss">
</style>
