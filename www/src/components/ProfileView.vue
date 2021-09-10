<template>
  <div class="pt-10 px-20">
    <p>My email: <span class="font-bold text-xl">{{ email }}</span></p>
    <div v-if="null != is_premium">
      <div v-if="is_premium">
        <h3>*You are a Premium user</h3>
      </div>
      <div v-else>
        <v-form @submit.prevent="becomePremium">
          <v-btn type="submit"
            tile
            elevation="0"
            class="bg-yellow-400 text-white font-bold"
          >
            Upgrade to Premium
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'ProfileView',


  data: () => ({
    email: null,
    is_premium: false,
  }),


  methods: {
    async becomePremium() {
      const response = await Api.submitPremiumMembershipCheckout()
      const { stripe_session_url } = response.data

      location.href = stripe_session_url
    }
  },


  async mounted() {
    const profileResponse = await Api.loadUserProfile()

    if (profileResponse.data.ok) {
      const { data: { user } } = profileResponse.data
      this.email = user.email
    }


    const premiumResponse = await Api.isPremiumUser()

    if (premiumResponse.data.ok) {
      const { data: { is_premium } } = premiumResponse.data
      this.is_premium = is_premium
    }
  }
}
</script>

<style lang="scss">
</style>
