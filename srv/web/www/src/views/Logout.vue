<template>
</template>

<script>
  import Api from '@/lib/api'

  export default {
    name: 'Logout',

    async mounted() {
      await this.logoutUser()
    },

    methods: {
      async logoutUser() {
        if (!this.$session?.exists()) {
          return
        }

        const auth_token = this.$session.get('AUTH_TOKEN')

        if ('string' === typeof auth_token) {
          await Api.logoutUser({ auth_token })
        }

        this.$session.destroy()
        this.$router.push('/')
      }
    }
  }
</script>
