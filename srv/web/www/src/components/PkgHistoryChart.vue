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
      // TODO: NOTE TO SELF: PLEASE remove this logic (the one
      // responsible for checking whether the user is logged in or not)
      // - into a separate component or util.

      if (!this.$session?.exists()) {
        return
      }

      const auth_token = this.$session?.get('AUTH_TOKEN')


      const history_res = await Api.listPkgHistory({
        auth_token,
        name: this.pkg_name,
        since: this.daysAgo(7)
      })

      if (200 !== history_res.status || !history_res.data.ok) {
        return
      }

      const { data: { history } } = history_res.data
      this.history = history

      this.chartData = {
        labels: this.history.map(record => record.day),
        datasets: [
          {
            label: 'Downloads',
            data: this.history.map(record => record.npm_downloads),
            fill: false,
            borderColor: 'rgb(255, 0, 0)'
          },

          {
            label: 'Forks',
            data: this.history.map(record => record.gh_forks),
            fill: false,
            borderColor: 'rgb(0, 255, 0)'
          },

          {
            label: 'Stars',
            data: this.history.map(record => record.gh_stars),
            fill: false,
            borderColor: 'rgb(0, 0, 255)'
          },

          {
            label: 'Open issues',
            data: this.history.map(record => record.gh_issues),
            fill: false,
            borderColor: 'rgb(0, 255, 255)'
          },
        ]
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

