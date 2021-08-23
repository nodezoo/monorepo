<template>
  <div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  async mounted() {
    console.dir(this.$route.query, { depth: 32 }) // dbg

    const { code = null } = this.$route.query

    if (null != code) {
      const response = await Api.loginUserWithGitHub({ code })

      if (response.data.ok) {
        location.href = '/account'
      }
    }
  }
}
</script>

