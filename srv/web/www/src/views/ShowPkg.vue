<template>
  <div>
    <h1>{{ pkg_name }}</h1>
    <PkgHistoryChart />
  </div>
</template>


<script>
  import Api from '@/lib/api'
  import PkgHistoryChart from '@/components/PkgHistoryChart.vue'


  export default {
    name: 'ShowPkg',

    data: () => ({
      pkg_name: ''
    }),

    mounted() {
      // TODO: Implementation.
      // TODO: Redirect to the 404 page when the package does not exist.
      //

      const { params: { name: pkg_name } } = this.$route

      this.pkg_name = pkg_name
    },

    components: {
      PkgHistoryChart
    }
  }
</script>

