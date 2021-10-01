<template>
  <div v-if="request_sent">
    <p>A recovery link has been sent to your email. Please click it once you get it.</p>
  </div>
  <div v-else>
    <div class="h-screen overflow-auto bg-gray-50">
      <div class="bg-white w-1/5 container mx-auto mt-20 shadow-md">

        <div class="px-8 pb-8 pt-10">
          <form @submit.prevent="onResetFormSubmit">
            <div class="mb-4">
              <input v-model="email" type="email" placeholder="Email"
                class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div class="mb-4">
              <input type="submit" value="Email me a recovery link"
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline" />
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  data: () => ({
    email: '',
    request_sent: false
  }),

  methods: {
    async onResetFormSubmit() {
      const { email } = this
      const response = await Api.requestPassReset({ email })
      const responseData = await response.json()

      if (responseData.ok) {
        this.request_sent = true
      }
    }
  }
}
</script>

<style lang="scss">
</style>
