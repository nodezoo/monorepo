<script>
  import { Line } from 'vue-chartjs'


  export default {
    extends: Line,

    props: {
      chartData: {
        type: Object,
        default: {}
      },

      options: {
        type: Object,
        default: {}
      }
    },

    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
