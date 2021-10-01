<template>
  <div>
    <div v-if="reset_ok">
      <h1>Reset successful</h1>
      <p>Please click <router-link to="/">here</router-link> to login</p>
    </div>
    <div v-else>
      <form @submit.prevent="onPasswordReset">
        <input v-model="new_pass" type="password" placeholder="Password" />
        <input v-model="new_pass_confirmation" type="password" placeholder="Password confirmation" />
        <input type="submit" value="Reset password" />
      </form>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'ResetPassView',

  data: () => ({
    new_pass: '',
    new_pass_confirmation: '',
    reset_ok: false
  }),

  methods: {
    async onPasswordReset() {
      const { token: reset_token } = this.$route.query
      const { new_pass, new_pass_confirmation } = this

      const response = await Api.resetPass({
        reset_token,
        new_pass,
        new_pass_confirmation
      })

      const responseData = await response.json()

      if (responseData.ok) {
        this.reset_ok = true
      }
    }
  }
}
</script>

<style lang="scss">
</style>
