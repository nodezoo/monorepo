<template>
  <div class="h-screen overflow-auto bg-gray-50">
    <div class="bg-white w-1/5 container mx-auto mt-20 shadow-md">
      <div class="pt-12">
        <img class="mx-auto" src="@/assets/logo.png" alt="Node Zoo logo" width="136" height="76">
      </div>

      <div class="px-8 pb-8 pt-14">
        <form @submit.prevent="onSignUpAttempt" class="mb-4">
          <div class="mb-4">
            <input v-model="email" type="email" placeholder="Email"
               class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /> 
          </div>

          <div class="mb-4">
            <input v-model="pass" type="password" placeholder="Password"
              class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div class="mb-4">
            <input v-model="pass_confirm" type="password" placeholder="Confirm password"
              class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          <div>
            <input type="submit" value="Sign up"
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'SignUpView',

  data: () => ({
    email: '',
    pass: '',
    pass_confirm: ''
  }),

  methods: {
    async onSignUpAttempt() {
      const { email, pass, pass_confirm } = this
      const response = await Api.registerUser({ email, pass, pass_confirm })

      if (response.data.ok) {
        this.$router.push('/sign-in')
      }
    }
  }
}
</script>

<style lang="scss">
</style>

