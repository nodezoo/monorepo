<template>
  <LineChart

    :chartData="{
      labels: ['30 Jul', '31 Jul', '1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug'],
      datasets: [
        {
          label: 'Downloads by day',
          data: [60, 50, 45, 47, 37, 51, 55],
          fill: false
        },
        {
          label: 'Forks by day'
        }
      ]
    }"

    :options="{ maintainAspectRatio: false }" />
</template>


<script>
  import Api from '@/lib/api'
  import LineChart from '@/components/LineChart.vue'


  export default {
    name: 'PkgHistoryChart',

    data: () => ({
      pkg_name: ''
    }),

    mounted() {
    },

    components: {
      LineChart
    }
  }
</script>

