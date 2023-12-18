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
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    fixturePanelData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    console.log("pieData:"+JSON.stringify(this.fixturePanelData))
    this.initChart()

    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions() {
      console.log( this.fixturePanelData[0])
      this.chart.setOption({
        title: [{
          text: '治具共用信息',
          x: 'center',
          y: 'center',
          top: '15',
          // 主标题样式
          textStyle: {
            fontSize: '25',
            color: 'black'
          },
        },
          {
            subtext: 'Pogopin机型数\n \n' + this.fixturePanelData[0][2]["tips"],
            left: '16.5%',
            top: '43%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '18',
              color: 'black'
            }
          },
          {
            subtext: 'AA机型数\n \n' + this.fixturePanelData[1][2]["tips"],
            left: '49.8%',
            top: '43%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '18',
              color: 'black'
            }
          },
          {
            subtext: '锁附机型数\n \n' + this.fixturePanelData[2][2]["tips"],
            left: '83.2%',
            top: '43%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '18',
              color: 'black'
            }
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: ['共享治具', '未共享治具']
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        calculable: true,
        series: [
          {
            name: 'Pogopin共享治具信息',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              formatter: '{name|{b}}\n{value|{c} 件}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                value: {
                  fontSize: 12,
                  color: '#999'
                }
              }
            },

            data: this.fixturePanelData[0],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            left: 0,
            right: '66.6667%',
            top: 0,
            bottom: 0
          },
          {
            name: 'AA共享治具信息',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              formatter: '{name|{b}}\n{value|{c} 件}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                value: {
                  fontSize: 12,
                  color: '#999'
                }
              }
            },

            data:  this.fixturePanelData[1],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            left: '33.3333%',
            right: '33.3333%',
            top: 0,
            bottom: 0
          },
          {
            name: '锁附共享治具信息',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              formatter: '{name|{b}}\n{value|{c} 件}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                value: {
                  fontSize: 12,
                  color: '#999'
                }
              }
            },

            data:  this.fixturePanelData[2],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            left: '66.6667%',
            right: 0,
            top: 0,
            bottom: 0
          },
        ]
      })
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.setOptions();
    }
  }
}
</script>
