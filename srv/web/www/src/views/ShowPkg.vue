<template>
  <div>
    <h1>{{ pkg_name }}</h1>
    <div>
      <LineChart

        :chartData="{
          labels: ['30 Jul', '31 Jul', '1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug'],
          datasets: [{
            label: 'Downloads by day',
            data: [60, 50, 45, 47, 37, 51, 55],
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
          }]
        }"

        :options="{ maintainAspectRatio: false }" />


      <LineChart

        :chartData="{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Downloads by month',
            data: [200, 350, 320, 400, 120, 425, 370, 410],
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
          }]
        }"

        :options="{ maintainAspectRatio: false }" />
    </div>
  </div>
</template>


<script>
  import Api from '@/lib/api'
  import LineChart from '@/components/LineChart.vue'


  export default {
    name: 'ShowPkg',

    data: () => ({
      pkg_name: ''
    }),

    mounted() {
      // TODO: Implementation.
      // TODO: Redirect to the 404 page if the package does not exist.
      //

      const { params: { name: pkg_name } } = this.$route

      this.pkg_name = pkg_name
    },

    components: {
      LineChart
    }
  }
</script>

