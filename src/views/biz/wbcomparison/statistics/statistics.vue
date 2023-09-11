<template>
  <!-- 准备具有宽高的容器 -->
  <div style="width: 100%; height: 100%" ref="chart">
    <div style="width: 100%; height: 20%">
      <el-row :span="10">
        <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
          <el-card style="color: #409EFF">
            <div>模板总数</div>
            <div style="padding: 10px 0; text-align: center; font-weight: bold;">
              <el-tag type="primary" style="font-size: 20px">
                {{ modTtl }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
          <el-card style="color: #67C23A">
            <div>更新模板数</div>
            <div style="padding: 10px 0; text-align: center; font-weight: bold;">
              <el-tag type="primary" style="font-size: 20px">
                {{ updatedMod }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
          <el-card style="color: #E6A23C">
            <div>模板平均线数</div>
            <div style="padding: 10px 0; text-align: center; font-weight: bold;">
              <el-tag type="primary" style="font-size: 20px">
                {{ modAvgLine }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5" style="padding-left: 20px; font-weight: bolder; font-size: larger">
          <el-card style="color: #F56C6C">
            <div>近一周更新模板数</div>
            <div style="padding: 10px 0; text-align: center; font-weight: bold;">
              <el-tag type="primary" style="font-size: 20px">
                {{ recentUpdatedMod }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="width: 100%; height: 80%" id="trending" v-loading = "loading"></div>
  </div>
</template>
<script>
// let Echarts = require('echarts/lib/echarts'); //基础实例 注意不要使用import
// require('echarts/lib/chart/bar'); //按需引入 bar = 柱状图


import * as echarts from "echarts";

export default {
  name: "WbComparisonStatistics",

  data() {
    return {
      modTtl: null,
      updatedMod: null,
      modAvgLine: null,
      recentUpdatedMod: null,
      loading: false,
    }
  },

  created() {
    this.getUser();
    this.updateHomeData()
  },

  methods: {
    getUser() {
      let loginName = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).userName : ""
      this.request.get("/user/getUser", {
        params: {
          userName: loginName
        }
      }).then(res => {
        if (res.code === 200) {
          this.$emit("login", loginName)
        } else if (res.code === 100) {
          this.$emit("login", "")
        }
      })
    },

    updateHomeData() {
      this.request.get("/echart/updateHomeData").then(res => {
        this.modTtl = res.extend.data[0];
        this.updatedMod = res.extend.data[1];
        this.modAvgLine = res.extend.data[2];
        this.recentUpdatedMod = res.extend.data[3];
      })
    }
  },
  // data() {
  // return {chart: null}},
  //图表实例
  // mounted() { this.init() },
  // methods: {
  //   init() {
  //     //2.初始化
  //     this.chart = Echarts.init(this.$refs.chart);
  //     //3.配置数据
  //     let option = {
  //       xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }, //X轴
  //       yAxis: { type: 'value' }, //Y轴
  //       series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'bar' }] //配置项
  //     };
  //     // 4.传入数据
  //     this.chart.setOption(option);
  //   }
  // }

  mounted() {  //页面原始渲染之后再触发

    // ok
    // 金线偏移
    // 少线
    // 无程序
    // 多线
    this.loading = true;
    const stdModChartDom = document.getElementById("trending");
    const stdModMyChart = echarts.init(stdModChartDom);

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };

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
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
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
    };


    this.request.get("/echart/trending").then(res => {

      let xAxisDataTmp = []
      let xAxisData
      let data0 = []
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []

      let a, b, c, d, e

      for (let i = 0; i < res.extend.data.length; i++) {
        xAxisDataTmp.push(res.extend.data[i].date)
      }

      xAxisData = Array.from(new Set(xAxisDataTmp))

      for (const xAxisDatum of xAxisData) {

        a = 0
        b = 0
        c = 0
        d = 0
        e = 0

        for (const datum of res.extend.data) {

          if (datum.date === xAxisDatum && datum.code === 0) {
            data0.push(datum.count)
            a++
          }
          if (datum.date === xAxisDatum && datum.code === 1) {
            data1.push(datum.count)
            b++
          }
          if (datum.date === xAxisDatum && datum.code === 2) {
            data2.push(datum.count)
            c++
          }
          if (datum.date === xAxisDatum && datum.code === 3) {
            data3.push(datum.count)
            d++
          }
          if (datum.date === xAxisDatum && datum.code === 4) {
            data4.push(datum.count)
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

      // for (let i = 0; i < res.length; i++) {
      //
      //   xAxisData.push('Class' + i);
      //
      //
      //   data0.push(i.).toFixed(2));
      //   data1.push(+(Math.random() * 5).toFixed(2));
      //   data2.push(+(Math.random() + 0.3).toFixed(2));
      //   data3.push(+Math.random().toFixed(2));
      // }

      stdModOption.xAxis.data = xAxisData
      stdModOption.series[0].data = data0
      stdModOption.series[1].data = data1
      stdModOption.series[2].data = data2
      stdModOption.series[3].data = data3

      stdModMyChart.setOption(stdModOption);
      this.loading = false;
    });

    window.addEventListener('resize', () => {
      stdModMyChart.resize();
    });
  }
};
</script>

<style scoped>

</style>
