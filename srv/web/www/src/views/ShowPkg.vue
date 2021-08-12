<template>
  <div>
    <h1>{{ pkg_name }}</h1>
    <h2>{{ pkg_version }}</h2>
    <p>{{ pkg_desc }}</p>
    <div v-if="pkg_name">
      <PkgHistoryChart :pkg_name="pkg_name" />
    </div>
  </div>
</template>


<script>
  import Api from '@/lib/api'
  import PkgHistoryChart from '@/components/PkgHistoryChart.vue'


  export default {
    name: 'ShowPkg',

    data: () => ({
      pkg_name: null,
      pkg_version: null,
      pkg_desc: null
    }),

    async mounted() {
      const { params: { name: pkg_name } } = this.$route


      const pkg_res = await Api.showPkg({ name: pkg_name })

      if (200 !== pkg_res.status || !pkg_res.data.ok) {
        // TODO: Be more explicit about the why-codes (i.e. error codes),
        // and their handling.
        //
        return this.$router.push('/404')
      }

      const { data: { pkg } } = pkg_res.data

      this.pkg_name = pkg_name
      this.pkg_version = pkg.npm.version
      this.pkg_desc = pkg.npm.desc
    },

    components: {
      PkgHistoryChart
    }
  }
</script>

