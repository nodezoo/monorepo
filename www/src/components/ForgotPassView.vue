<template>
  <div v-if="request_sent">
    <p>A recovery link has been sent to your email. Please click it once you get it.</p>
  </div>
  <div v-else>
    <form @submit.prevent="onResetFormSubmit">
      <input v-model="email" type="email" placeholder="Email" />
      <input type="submit" value="Email me a recovery link" />
    </form>
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

      if (response.data.ok) {
        this.request_sent = true
      }
    }
  }
}
</script>

<style lang="scss">
</style>
