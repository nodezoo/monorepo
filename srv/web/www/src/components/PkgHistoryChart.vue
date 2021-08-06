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
      daysAgo(ndays) {
        return Moment().subtract(7, 'days')
          .format('YYYY-MM-DD')
      }
    },

    data: () => ({
      chartData: null,
      chartOptions: { maintainAspectRatio: false }
    }),

    async mounted() {
      const { data: { history } } = await Api.listPkgHistory({
        name: this.pkg_name,
        since: this.daysAgo(7) 
      })

      this.history = history

      this.chartData = {
        labels: this.history.map(record => record.day),
        datasets: [{
          label: 'Downloads by day',
          data: this.history.map(record => record.npm_downloads),
          fill: false
        }]
      }
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

