<template>
  <div class="dashboard-editor-container">
<!--    <el-row style="background:#fff; padding:16px 16px 0; margin-bottom:4px;">
      <span>智慧打线图</span>
    </el-row>-->

    <panel-group @updateIndexOverviewData="updateIndexOverviewData" />

    <el-row style="background:#fff; padding:16px 16px 0; margin-bottom:32px;">
      <bar-chart :chart-data="barChartData"/>
    </el-row>
  </div>
</template>

<script>
import WbComparisonTrending from './biz/wbcomparison/statistics/WbComparisonTrending'
import WbComparisonIndexOverview from './biz/wbcomparison/statistics/WbComparisonIndexOverview'
import { getWbComparisonIndexOverview, getWbComparisonIndexTrending } from '@/api/biz/index/index'

export default {
  name: 'Index',
  components: {
    'bar-chart': WbComparisonTrending,
    'panel-group': WbComparisonIndexOverview
  },

  data() {
    return {
      barChartData: {
        data0: [],
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        data5: []
      }
    }
  },

  created() {

  },
  methods: {
    updateIndexOverviewData() {
      getWbComparisonIndexOverview().then(response => {
        console.log(response)
      })
    }
  },

  mounted() {
    getWbComparisonIndexTrending().then(response => {
      let xAxisDataTmp = []
      let xAxisData
      let data0 = []
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let data5 = []

      let a, b, c, d, e

      for (let i = 0; i < response.rows.length; i++) {
        xAxisDataTmp.push(response.rows[i].date)
      }

      xAxisData = Array.from(new Set(xAxisDataTmp))

      data5 = xAxisData;

      for (const xAxisDatum of xAxisData) {

        a = 0
        b = 0
        c = 0
        d = 0
        e = 0

        for (const datum of response.rows) {

          if (datum.date === xAxisDatum && datum.code === 0) {
            data0.push(datum.cnt)
            a++
          }
          if (datum.date === xAxisDatum && datum.code === 1) {
            data1.push(datum.cnt)
            b++
          }
          if (datum.date === xAxisDatum && datum.code === 2) {
            data2.push(datum.cnt)
            c++
          }
          if (datum.date === xAxisDatum && datum.code === 3) {
            data3.push(datum.cnt)
            d++
          }
          if (datum.date === xAxisDatum && datum.code === 4) {
            data4.push(datum.cnt)
            e++
          }
        }

        if (a === 0) {
          data0.push(0)
        }
        if (b === 0) {
          data1.push(0)
        }
        if (c === 0) {
          data2.push(0)
        }
        if (d === 0) {
          data3.push(0)
        }
        if (e === 0) {
          data4.push(0)
        }
      }

      this.barChartData.data0 = data0
      this.barChartData.data1 = data1
      this.barChartData.data2 = data2
      this.barChartData.data3 = data3
      this.barChartData.data4 = data4
      this.barChartData.data5 = data5

      this.loading = false
    })
  }
}


</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
