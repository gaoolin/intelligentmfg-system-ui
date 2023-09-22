<template>
  <!-- 准备具有宽高的容器 -->
  <div class="dashboard-editor-container" ref="chart">

    <el-row>
      <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
        <el-card style="color: #409EFF">
          <div>模板总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">
            <el-tag type="primary" style="font-size: 20px">
              {{ modelsTtlCnt }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
        <el-card style="color: #67C23A">
          <div>更新模板数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">
            <el-tag type="primary" style="font-size: 20px">
              {{ modelsUpdatedCnt }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
        <el-card style="color: #E6A23C">
          <div>模板平均线数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">
            <el-tag type="primary" style="font-size: 20px">
              {{ modelsAvgCnt }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
        <el-card style="color: #F56C6C">
          <div>近一周更新模板数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">
            <el-tag type="primary" style="font-size: 20px">
              {{ modelsRecentUpdatedCnt }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="32" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col>
        <div style="width: 100%; height: 350px" id="trending" v-loading="loading"></div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import * as echarts from 'echarts'
import { getWbComparisonIndexOverview, getWbComparisonIndexTrending } from '@/api/biz/index/index'

export default {
  name: 'Index',
  data() {
    return {
      // 版本号
      version: '3.8.5',
      modelsTtlCnt: null,
      modelsUpdatedCnt: null,
      modelsAvgCnt: null,
      modelsRecentUpdatedCnt: null,
      loading: false,
      wbComparisonData: null
    }
  },

// let Echarts = require('echarts/lib/echarts'); //基础实例 注意不要使用import
// require('echarts/lib/chart/bar'); //按需引入 bar = 柱状图

  created() {
    this.getWbComparisonData()
  },

  methods: {
    goTarget(href) {
      window.open(href, '_blank')
    },

    getWbComparisonData() {
      let tmp = {}
      this.loading = true
      getWbComparisonIndexOverview().then(response => {
        tmp = response.data
        this.modelsTtlCnt = tmp.wbComparisonStdModelsTtlCnt
        this.modelsUpdatedCnt = tmp.wbComparisonStdModelsUpdatedCnt
        this.modelsAvgCnt = tmp.wbComparisonStdModelAvgCnt
        this.modelsRecentUpdatedCnt = tmp.wbComparisonStdModelsRecentUpdatedCnt
      })
    }
  },

  mounted() {  //页面原始渲染之后再触发

    // ok
    // 金线偏移
    // 少线
    // 无程序
    // 多线
    this.loading = true
    const stdModChartDom = document.getElementById('trending')
    const stdModMyChart = echarts.init(stdModChartDom)

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    }

    const stdModOption = {
      title: {
        text: '打线图比对次数趋势',
        subtext: '近15天数据',
        left: 'center'
      },
      legend: {
        data: ['OK', '金线偏移', '少线', '无程序', '多线'],
        left: '10%'
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      },
      tooltip: {},
      xAxis: {
        data: [],
        name: 'X Axis',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },
      yAxis: {},
      grid: {
        bottom: 100
      },
      series: [
        {
          name: 'OK',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: []
        },
        {
          name: '金线偏移',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: []
        },
        {
          name: '少线',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: []
        },
        {
          name: '无程序',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: []
        },
        {
          name: '多线',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: []
        }
      ]
    }

    getWbComparisonIndexTrending().then(response => {

      let xAxisDataTmp = []
      let xAxisData
      let data0 = []
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []

      let a, b, c, d, e

      for (let i = 0; i < response.rows.length; i++) {

        xAxisDataTmp.push(response.rows[i].date)
      }

      xAxisData = Array.from(new Set(xAxisDataTmp))

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

      stdModOption.xAxis.data = xAxisData
      stdModOption.series[0].data = data0
      stdModOption.series[1].data = data1
      stdModOption.series[2].data = data2
      stdModOption.series[3].data = data3

      stdModMyChart.setOption(stdModOption)
      this.loading = false
    })

    window.addEventListener('resize', () => {
      stdModMyChart.resize()
    })
  }
}
</script>

<style scoped lang="scss">
.dashboard-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
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

