<template>
  <div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  async mounted() {
    const { code = null } = this.$route.query

    if (null != code) {
      const response = await Api.loginUserWithGitHub({ code })
      const responseData = await response.json()

      if (responseData.ok) {
        // TODO: Uncomment this redirect once the issue with the cookies
        // failing to persist has been resolved.
        //
        location.href = '/account'
      }
    }
  }
}
</script>

