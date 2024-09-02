<template>
  <div class="app-container center">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="厂区" prop="companyName">
        <el-select
          v-model="queryParams.factoryName"
          placeholder="请输入厂区"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in factoryOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
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
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机台号" prop="mcId">
        <el-input
          v-model="queryParams.mcId"
          placeholder="请输入机型"
          clearable
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机型" prop="prodType">
        <el-input
          v-model="queryParams.prodType"
          placeholder="请输入机型"
          clearable
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="盒子号" prop="simId">
        <el-input
          v-model="queryParams.simId"
          placeholder="请输入盒子号"
          clearable
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="点检状态" prop="statusCode">
        <el-select v-model="queryParams.statusCode" placeholder="请输入比对结果状态" clearable @change="dataChange"
        >
          <el-option
            v-for="dict in dict.type.aa_list_params_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="resultList" :key="refreshKey"
              :header-cell-style="headerCellStyle"
              :row-class-name="rowClassName"
              :cell-style="cellStyle"
              :style="tableStyle()"
    >
      <el-table-column type="index" label="序号" width="55" align="center" fixed/>
      <el-table-column prop="factoryName" label="厂区" align="center" fixed/>
      <el-table-column prop="groupName" label="车间" align="center" fixed/>
      <el-table-column prop="eqCode" label="设备号" align="center"/>
      <el-table-column prop="mcId" label="机台号" align="center"/>
      <el-table-column prop="prodType" label="机型" align="center"/>
      <el-table-column prop="simId" label="盒子号" align="center"/>
      <el-table-column prop="checkDt" label="点检时间" align="center"/>
      <el-table-column prop="statusCode" label="状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.aa_list_params_status" :value="scope.row.statusCode"/>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import '@/views/biz/common/css/qtech-css.css'
import { getFactoryNames, getGroupNames, listLatestCheckStatus } from '@/api/biz/aa/params'

export default {
  name: 'index.vue',
  dicts: ['aa_list_params_status'],

  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备比对结果列表
      resultList: [],
      // 刷新标识
      refreshKey: 0,
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName: null,
        groupName: null,
        eqCode: null,
        mcId: null,
        prodType: null,
        simId: null,
        statusCode: null,
        dtRange: []
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setHours(0, 0, 0).valueOf())
            end.setTime(end.setHours(23, 59, 59).valueOf())
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
        }, {
          text: '前一天至今',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 1 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前两天至今',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 2 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前三天至今',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 3 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一周',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 7 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一个月',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 30 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },

  methods: {
    /** 查询设备比对结果列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
        this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
        this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
        listLatestCheckStatus(this.queryParams).then(response => {
          this.resultList = response.rows
          this.total = response.total
          this.loading = false
        })
      }
    },

    getFactoryNames() {
      this.factoryOptions = []
      getFactoryNames().then(response => {
        for (const i in response.data) {
          this.factoryOptions.push(response.data[i]['factoryName'])
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    dataChange() {
      this.getList()
    },

    handleExport() {
      this.download('aa/params/latest/status/export', {
        ...this.queryParams
      }, `AA参数反控机台状态_${new Date().getTime()}.xlsx`)
    },

    /** 规则校验 */
    checkDtRange(rule, value, callback) {
      const days = this.getDiffDay(value[0], value[1])
      if (days > 365) {
        return callback(new Error('时间跨度不能超过一年'))
      } else {
        callback()
      }
    },

    /** 计算日期间隔天数 */
    getDiffDay(dtStr1, dtStr2) {
      // 计算两个日期之间的差值
      let totalDays, diffDate
      let dt1 = Date.parse(dtStr1)
      let dt2 = Date.parse(dtStr2)
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(dt1 - dt2) // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
      return totalDays // 相差的天数
    },

    headerCellStyle() {
      return {
        backgroundColor: '#4fc3f7',  // 明亮的背景色
        color: '#ffffff',            // 白色字体，强烈对比
        fontWeight: 'bold',          // 粗体字体
        textAlign: 'center',         // 居中文本对齐
        fontSize: '15px'             // 清晰易读的字体大小
      }
    },
    rowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
    },
    cellStyle() {
      return {
        backgroundColor: '#e0f7fa',   // Clean, white background for clarity
        color: '#111111',             // Harmonious teal text color
        textAlign: 'center',          // Centered text for uniformity
        fontSize: '16px',             // Slightly smaller font for readability
        fontWeight: 'bold'
      }
    },
    tableStyle() {
      return {
        border: '1px solid #4fc3f7',  // 深绿色边框
        borderRadius: '8px',          // 圆角边框
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // 添加阴影
      }
    },

  },

  created() {
    this.$set(this.queryParams, 'dtRange', [this.$dateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.$dateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))])
    this.getList()
    this.getFactoryNames()
  }
}
</script>

<style scoped>

</style>
