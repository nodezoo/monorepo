<template>
  <div class="pt-10 px-20">
    <h1 class="font-extrabold text-xl">{{ pkg_name }}</h1>
    <h2>{{ pkg_version }}</h2>
    <p>{{ pkg_desc }}</p>

    <div v-if="pkg_name" v-show="is_premium">
      <PackageHistoryChart :pkg_name="pkg_name" />
    </div>
  </div>
</template>


<script>
import Api from '@/lib/api'
import PackageHistoryChart from '@/components/PackageHistoryChart.vue'


export default {
  name: 'PackageDetailsView',


  data: () => ({
    pkg_name: null,
    pkg_version: null,
    pkg_desc: null,
    is_premium: false
  }),


  async mounted() {
    const { params: { packageName } } = this.$route

    const packageResponse = await Api.showPkg({ name: packageName })

    if (packageResponse.data.ok) {
      const { data: { pkg } } = packageResponse.data

      this.pkg_name = pkg.name
      this.pkg_version = pkg.npm.version
      this.pkg_desc = pkg.npm.desc
    }


    const premiumResponse = await Api.isPremiumUser()

    if (premiumResponse.data.ok) {
      const { data: { is_premium } } = premiumResponse.data
      this.is_premium = is_premium
    }


  },

  components: {
    PackageHistoryChart
  }
}
</script>

