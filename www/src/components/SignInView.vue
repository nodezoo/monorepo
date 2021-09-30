<template>
  <div class="h-screen overflow-auto bg-gray-50">
    <div class="bg-white w-1/5 container mx-auto mt-20 shadow-md">
      <div class="pt-12">
        <img class="mx-auto" src="@/assets/logo.png" alt="Node Zoo logo" width="136" height="76">
      </div>

      <div class="px-8 pb-8 pt-14">
        <form @submit.prevent="onLoginAttempt" class="mb-4">
          <div class="mb-4">
            <input v-model="email" type="email" placeholder="Email"
               class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /> 
          </div>

          <div class="mb-4">
            <input v-model="pass" type="password" placeholder="Password"
              class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div>
            <input type="submit" value="Sign in"
              class="w-full nodezoo-bg-blue text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline" />
          </div>
        </form>

        <div class="mt-14">
          <div class="mb-4">
            <router-link to="/forgot" class="inline-block align-baseline font-bold text-sm nodezoo-text-blue">Forgot password?</router-link>
          </div>

          <div>
            <a :href="githubSignInLink" class="inline-block align-baseline font-bold text-sm nodezoo-text-blue">Sign in with GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'SignInView',

  computed: {
    githubSignInLink() {
      const gh_client_id = process.env.VUE_APP_GITHUB_NODEZOO_APP_CLIENT_ID

      if (null == gh_client_id) {
        throw new Error('malformed url')
      }

      return 'https://github.com/login/oauth/authorize' +
        `?scope=user:email&client_id=${gh_client_id}`
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

