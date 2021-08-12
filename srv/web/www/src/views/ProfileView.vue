<template>
  <div id="profile">
    <h1>This is my profile page</h1>
    <p>Email: {{ email }}</p>
    <v-form @submit.prevent="becomePremium" v-if="!is_premium">
      <v-btn type="submit">Become Premium</v-btn>
    </v-form>
  </div>
</template>


<script>
  import Api from '@/lib/api'


  export default {
    name: 'ProfileView',

    data: () => ({
      email: null,
      is_premium: true,
    }),

    methods: {
      async becomePremium() {
        if (!this.$session?.exists()) {
          return
        }

        const auth_token = this.$session.get('AUTH_TOKEN')
        const premium_res = await Api.makeUserPremium({ auth_token })

        if (!premium_res.data.ok) {
          return
        }

        this.is_premium = true
      }
    },

    async mounted() {
      // TODO: DRY UP the logic on all pages that require authentication:
      //
      // if not session exists then
      //   redirect_to 404
      // else
      //   continue

      if (!this.$session?.exists()) {
        return
      }

      const auth_token = this.$session?.get('AUTH_TOKEN')
      const profile_res = await Api.loadUserProfile({ auth_token })

      if (200 !== profile_res.status || !profile_res.data.ok) {
        return
      }

      const { data: { user } } = profile_res.data
      this.email = user.email


      const premium_res = await Api.isPremiumUser({ auth_token })

      if (200 === premium_res.status && premium_res.data.ok) {
        const { data: { is_premium } } = premium_res.data
        this.is_premium = is_premium
      }
    }
  }
</script>
