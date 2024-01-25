<template>
<div class="app-container">
  <div style="text-align:center;">
    <h1 style="margin-top: 0; padding-top: 0; font-weight: bolder" v-if="queryParams.label === '1'">未联网机台明细</h1>
    <h1 style="margin-top: 0; padding-top: 0; font-weight: bolder" v-else-if="queryParams.label === '2'">未开启远程机台明细</h1>
  </div>

  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" :rulues="rules">
    <el-form-item label="厂区" prop="companyName">
      <el-select
        v-model="queryParams.companyName"
        placeholder="请输入厂区"
        clearable
        @change="handleQuery"
      >
        <el-option
          v-for="item in factoryOptions"
          :key="item.label"
          :label="item.label"
          :value="item.label"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="车间" prop="groupName">
      <el-select
        v-model="queryParams.groupName"
        placeholder="请输入车间"
        clearable
        @focus="getGroupNames"
        @change="handleQuery"
      >
        <el-option
          v-for="item in workshopOptions"
          style="width: 240px"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备类型" prop="deviceType">
      <el-select
        v-model="queryParams.deviceType"
        placeholder="请输入设备类型"
        clearable
        @change="handleQuery"
      >
        <el-option
          v-for="item in deviceTypeOptions"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备编码" prop="eqId">
      <el-input
        v-model="queryParams.eqId"
        placeholder="请输入设备编码"
        clearable
        @change="handleQuery"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="机台号" prop="mcId">
      <el-input
        v-model="queryParams.mcId"
        placeholder="请输入机台号"
        clearable
        @change="handleQuery"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="盒子号" prop="simId">
      <el-input
        v-model="queryParams.simId"
        placeholder="请输入盒子号"
        clearable
        @change="handleQuery"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="远程开关" prop="status" v-if="queryParams.label !== '1'">
      <el-select
        v-model="queryParams.status"
        placeholder="请输入远程状态"
        clearable
        @change="handleQuery"
      >
        <el-option
          v-for="dict in dict.type.remote_control_status"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="采集时长" prop="interval">
      <el-select
        v-model="queryParams.interval"
        filterable
        placeholder="请输入采集时长"
        clearable
        @change="handleQuery"
      >
        <el-option
          v-for="item in intervalOptions"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">
    <el-col :span="12">
      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
      >导出</el-button>
    </el-col>
    <el-col :span="12">
      <right-tool-bar-u-d-f :showSearch.sync="showSearch" @queryTable="getList" :back="back"></right-tool-bar-u-d-f>
    </el-col>
  </el-row>

  <el-table
    v-loading="loading"
    :data="tableData"
    :cell-style="tableBodyCellStyle"
    :header-cell-style="tableHeaderCellStyle"
    style="width: 100%; color: #363636"
  >
    <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="deptName" label="站位" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="groupName" label="车间" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="deviceType" label="设备类型" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="eqId" label="设备编号" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="mcId" label="机台号" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="simId" label="盒子号" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="remoteControlCode" label="远程状态码" align="center" min-width="120" v-if="queryParams.label !== '1'" fit></el-table-column>
    <el-table-column prop="status" label="远程开关" align="center" min-width="120" v-if="queryParams.label !== '1'" show-overflow-tooltip>
      <template slot-scope="scope">
          <dict-tag :options="dict.type.remote_control_status" :value="scope.row.status"/>
      </template>
    </el-table-column>
  </el-table>

  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="queryParams.pageNum"
    :limit.sync="queryParams.pageSize"
    @pagination="load"
  />
</div>
</template>

<script>
import { getFactoryNames, getGroupNames, listEqStatus, listOfflineEqs } from '@/api/biz/eqn/networking'
import RightToolBarUDF from '@/views/biz/RightToolBarGoBack'

export default {
  components: { RightToolBarUDF },
  dicts: ['remote_control_status'],
  name: 'index',
  prop: {
    component: RightToolBarUDF
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      back: false,
      // 总条数
      total: 0,
      loading: true,
      tableData: null,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setHours(0, 0, 0).valueOf())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59) - 1 * 1440 * 60 * 1000)
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 1 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前两天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setTime(new Date(end.setHours(23, 59, 59).valueOf() - 2 * 1440 * 60 * 1000).getTime()))
            start.setTime(start.setTime(new Date(start.setHours(0, 0, 0).valueOf() - 2 * 1440 * 60 * 1000).getTime()))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59).valueOf() - 3 * 1440 * 60 * 1000)
            start.setTime(start.setHours(0, 0, 0).valueOf() - 3 * 1440 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59).valueOf() - 7 * 1440 * 60 * 1000)
            start.setTime(start.setHours(0, 0, 0).valueOf() - 7 * 1440 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      deviceTypeOptions: ['DB', 'WB', 'HM', 'AA'],
      intervalOptions: ['5分钟', '15分钟', '30分钟', '1小时', '3小时', '6小时', '12小时', '1天', '2天'],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        groupName: null,
        deviceType: null,
        eqId: null,
        mcId: null,
        simId: null,
        status: null,
        interval: '3小时',
        label: null,
      },
      rules: {},
    }
  },

  created() {
    if (this.$route.query.label !== undefined) {
      this.queryParams.companyName = this.$route.query.companyName
      this.queryParams.groupName = this.$route.query.groupName
      this.queryParams.deviceType = this.$route.query.deviceType
      this.queryParams.label = this.$route.query.label
      this.back = true
      if (this.$route.query.status === '1') {
        this.queryParams.status = this.$route.query.status
      }
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    load() {
      if (this.queryParams.label === '1') {
        this.listOfflineEqs()
        this.getFactoryNames();
      } else {
        this.getList()
        // overview.methods.getFactoryNames()
        this.getFactoryNames();
      }
    },

    getList() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.loading = true
          listEqStatus(this.queryParams).then(response => {
            this.tableData = response.rows
            this.total = response.total
            this.loading = false;
          })
        }
      })
    },

    listOfflineEqs() {
      this.loading = true
      listOfflineEqs(this.queryParams).then( response => {
        this.tableData = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.load();
    },
    /** 重置按钮操作 */
    restQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getFactoryNames() {
      this.factoryOptions = []
      getFactoryNames().then(response => {
        for (const i in response.data) {
          let o = {}
          const tmp = response.data[i]['companyName']
          o.label = tmp
          if (tmp === '汉浦厂区' || tmp === 'QT_India') {
            o.disabled = true
            this.factoryOptions.push(o)
          } else {
            this.factoryOptions.push(o)
          }
        }
      })
    },
    getGroupNames() {
      this.workshopOptions = []
      getGroupNames(this.queryParams).then(response => {
        for (const i in response.data) {
          this.workshopOptions.push(response.data[i]['groupName'])
        }
      })
    },

    /** 导出 */
    handleExport() {
      this.download('eqn/status/export', {
        ...this.queryParams
      }, `设备联网情况明细_${new Date().getTime()}.xlsx`)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 四舍五入 保留N位小数 */
    getBit(value, bit = 2) {
      if (value !== null && value !== '') {
        let str = Number(value)
        str = str.toFixed(bit)
        return str
      } else {
        return null
      }
    },
    /** 小数转化为百分数 */
    toPercent(point, n) {
      let str = Number(point * 100).toFixed(n)
      str += '%'
      return str
    },
    isNUmber(num) {
      return /^[0-9]+.?[0-9]*$/.test(num)
    },
    /** 日期转字符串 */
    DateToStr(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hours = date.getHours()
      const min = date.getMinutes()
      const second = date.getSeconds()
      return year + '-' +
        ((month + 1) > 9 ? (month + 1) : '0' + (month + 1)) + '-' +
        (day > 9 ? day : ('0' + day)) + ' ' +
        (hours > 9 ? hours : ('0' + hours)) + ':' +
        (min > 9 ? min : ('0' + min)) + ':' +
        (second > 9 ? second : ('0' + second))
    },

    checkDtRange(rule, value, callback) {
      const days = this.getDiffDay(value[0], value[1])
      if (days > 90) {
        return callback(new Error('时间跨度不能超过90天'))
      } else {
        callback()
      }
    },

    /** 计算日期间隔天数 */
    getDiffDay(date_1, date_2) {
      // 计算两个日期之间的差值
      let totalDays, diffDate
      let myDate_1 = Date.parse(date_1)
      let myDate_2 = Date.parse(date_2)
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
      return totalDays // 相差的天数
    },

    /** 样式控制方法 */
    tableBodyCellStyle({ row, column, rowIndex, columnIndex }) {
        return 'font-size: 18px; font-weight: bolder;'
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle1
      let cellStyle2
      let cellStyle3

      cellStyle1 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#436EEE'
      cellStyle2 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#FF3030'
      cellStyle3 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#00BFBF'

      return cellStyle1
    },

  },

}
</script>

<style scoped>

</style>
