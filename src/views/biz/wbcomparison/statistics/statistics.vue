<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from '../../../dashboard/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ data0, data1, data2, data3, data4, data5 } = {}) {
      const emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      };
      this.chart.setOption({
        xAxis: {
          data: data5,
          name: 'X Axis',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: { onZero: true},
          splitLine: { show: false },
          splitArea: { show: false }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['OK', '金线偏移', '少线', '无程序', '多线']
        },
        series: [{
          name: 'OK',
          emphasis: emphasisStyle,
          smooth: true,
          type: 'bar',
          stack: 'one',
          data: data0
        }, {
          name: '金线偏移',
          emphasis: emphasisStyle,
          smooth: true,
          type: 'bar',
          stack: 'one',
          data: data1
        }, {
          name: '少线',
          emphasis: emphasisStyle,
          smooth: true,
          type: 'bar',
          stack: 'one',
          data: data2
        }, {
          name: '无程序',
          emphasis: emphasisStyle,
          smooth: true,
          type: 'bar',
          stack: 'one',
          data: data3
        }, {
          name: '多线',
          emphasis: emphasisStyle,
          smooth: true,
          type: 'bar',
          stack: 'one',
          data: data4
        }]
      })
    }
  }
}

</script>
