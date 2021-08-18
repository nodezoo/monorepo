<template>
  <div>
    <form @submit.prevent="onLoginAttempt">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="pass" type="password" placeholder="Password" />
      <input type="submit" value="Sign in" />
    </form>
    <router-link to="/forgot">Forgot password?</router-link>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'PublicHome',

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
