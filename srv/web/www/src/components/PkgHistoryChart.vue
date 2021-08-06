<template>
  <LineChart
    v-if="chartData"
    :chartData="chartData"
    :options="chartOptions" />
</template>


<script>
  import Moment from 'moment'
  import Api from '@/lib/api'
  import LineChart from '@/components/LineChart.vue'


  export default {
    name: 'PkgHistoryChart',

    methods: {
    },

    data: () => ({
      chartData: null,
      chartOptions: { maintainAspectRatio: false }
    }),

    async mounted() {
      setTimeout(() => {
        this.chartData = {
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: 'TEST_LABEL_PLAC',
            data: [50, 30, 40],
            fill: false
          }]
        }
      }, 1e3)
    },

    props: {
      pkg_name: {
        type: String,
        required: true
      }
    },

    components: {
      LineChart
    }
  }
</script>

