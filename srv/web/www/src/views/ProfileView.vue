<template>
  <div id="profile">
    <h1>This is my profile page</h1>
    <p>Email: {{ email }}</p>
  </div>
</template>


<script>
  import Api from '@/lib/api'

  export default {
    name: 'ProfileView',

    data: () => ({
      email: null
    }),

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

      console.log(profile_res.status, profile_res.data) // dbg

      if (200 !== profile_res.status || !profile_res.data.ok) {
        return
      }

      const { data: { user } } = profile_res.data
      this.email = user.email
    }
  }
</script>
