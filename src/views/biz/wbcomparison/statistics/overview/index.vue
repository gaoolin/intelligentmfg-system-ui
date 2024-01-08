<template>
  <div class="app-container center">
    <h1 style="text-align:center">打线图比对数据概览</h1>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
             :rules="rules"
    >
      <el-form-item label="时段" prop="dtRange">
        <el-date-picker
          v-model="queryParams.dtRange"
          style="width: 380px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="厂区" prop="companyName">
        <el-select
          v-model="queryParams.companyName"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  :span是每个元素所占此row比例，一行是24。:gutter是该row内元素之间的间隙，也就是col占6，gutter占6中的20px  -->
    <el-row :gutter="5" class="mb8">
      <el-col :span="22">
        <el-descriptions :column="1" label-position="top">
          <el-descriptions-item label="更新时间" :span="5">
            <template v-slot:title>
              <div style="text-align: center;">My Title</div>
            </template>
            Description
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['biz/wbcomparison:statistics:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      :span-method="arraySpanMethod"
      :cell-style="tableBodyCellStyle"
      :header-cell-style="tableHeaderCellStyle"
      :row-style="{height: '25px'}"
      style="width: 100%; font-size: 16px; color: #363636"
    >
      <el-table-column prop="companyName" label="厂区" align="center" min-width="160" fit>
      </el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="180" fit>
      </el-table-column>
      <!--      <el-table-column prop="ttlEqs" label="设备总数" align="center" width="150">
            </el-table-column>
            <el-table-column prop="onlineEqs" label="联网机台数" align="center" width="150">
            </el-table-column>
            <el-table-column prop="offlineEqs" label="未联网机台数" align="center" width="150">
            </el-table-column>-->
      <el-table-column prop="computeCnt" label="比对次数" align="center" min-width="160">
        <template scope="scope">
          <span v-if="scope.row.computeCnt > 0">{{ scope.row.computeCnt | numberToCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="okCnt" label="正确次数" align="center" min-width="120">
        <template scope="scope">
          <span v-if="scope.row.okCnt > 0">{{ scope.row.okCnt | numberToCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" align="center">
        <el-table-column prop="errCnt" label="错误次数" align="center" min-width="120">
          <template scope="scope">
            <span>{{ scope.row.errCnt | numberToCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="offsetCnt" label="金线偏移" align="center" fit>
          <template scope="scope">
            <span v-if="scope.row.offsetCnt > 0">{{ scope.row.offsetCnt | numberToCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="npCnt" label="无线图模版" align="center" fit>
          <template scope="scope">
            <span v-if="scope.row.npCnt > 0">{{ scope.row.npCnt | numberToCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lackCnt" label="少线" align="center" fit>
          <template scope="scope">
            <span v-if="scope.row.lackCnt > 0">{{ scope.row.lackCnt | numberToCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overCnt" label="多线" align="center" fit>
          <template scope="scope">
            <span v-if="scope.row.overCnt > 0">{{ scope.row.overCnt | numberToCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="errRatio" label="错误率" align="center" fit>
          <template scope="scope">
            <span>{{ toPercent(getBit(scope.row.errRatio, 6), 2) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listOverview, getFactoryNames, getGroupNames } from '@/api/biz/wbcomparison/overview'

export default {
  name: 'index',
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
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
        }, {
          text: '前一天至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 1 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前两天至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 2 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前三天至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 3 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 7 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '进一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 30 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }]
      },
      open: false,
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      queryParams: {
        companyName: null,
        groupName: null,
        dtRange: []
      },
      // 需要合并项的列
      needMergeArr: [
        {
          colName: 'companyName',
          mergeCheckNames: ['companyName']
        },
        {
          colName: 'groupName',
          mergeCheckNames: ['companyName', 'groupName']
        }
      ],
      rowMergeArrs: {}, // 包含需要一个或多个合并项信息的对象
      // 表单校验
      rules: {
        dtRange: [
          {
            type: 'array',
            required: true,
            message: '请选择日期区间',
            trigger: 'blur',
            fields: {
              // type类型试情况而定,所以如果返回的是date就改成date
              0: { type: 'string', required: true, message: '请选择开始日期' },
              1: { type: 'string', required: true, message: '请选择结束日期' }
            }
          }, {
            validator: this.checkDtRange, trigger: 'blur'
          }]
      }
    }
  },

  created() {
    // 日期区间回显
    this.$set(this.queryParams, 'dtRange', [this.DateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.DateToStr(new Date(new Date().valueOf()))])
  },
  mounted() {
    this.getList()
    this.getFactoryNames()
  },
  methods: {
    getList() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.queryParams.params = {}
          if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
            this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
            this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
            listOverview(this.queryParams).then(response => {
              this.tableData = response.rows
              this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, response.rows)
              this.loading = false
            })
          }
        }
      })
    },

    getFactoryNames() {
      getFactoryNames().then(response => {
        console.log(response)
        for (const i in response.data) {
          this.factoryOptions.push(response.data[i]['companyName'])
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

    /** 表格合并行 */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let needMerge = this.needMergeArr.some((item) => {
        return item.colName === column.property
      })
      if (needMerge === true) {
        return this.mergeAction(column.property, rowIndex, column)
      }
    },

    mergeAction(val, rowIndex, colData) {
      let _row = this.rowMergeArrs[val].rowArr[rowIndex]
      let _col = _row > 0 ? 1 : 0
      return [_row, _col]
    },

    rowMergeHandle(arr, data) {
      if (!Array.isArray(arr) && !arr.length) return false
      if (!Array.isArray(data) && !data.length) return false
      let needMerge = {}

      arr.forEach((mergeItem) => {
        // 创建合并管理对象
        needMerge[mergeItem.colName] = {
          rowArr: [],
          rowMergeNum: 0
        }
        let currentMergeItemData = needMerge[mergeItem.colName]

        // 进行合并管理对象数据的遍历整理
        data.forEach((item, index) => {
          if (index === 0) {
            currentMergeItemData.rowArr.push(1)
            currentMergeItemData.rowMergeNum = 0
          } else {
            let currentRowData = data[index]
            let preRowData = data[index - 1]

            if (this.colMergeCheck(currentRowData, preRowData, mergeItem.mergeCheckNames)) {
              currentMergeItemData.rowArr[currentMergeItemData.rowMergeNum] += 1
              currentMergeItemData.rowArr.push(0)
            } else {
              currentMergeItemData.rowArr.push(1)
              currentMergeItemData.rowMergeNum = index
            }
          }
        })
      })
      return needMerge
    },

    colMergeCheck(currentRowData, preRowData, mergeCheckNames) {
      if (!Array.isArray(mergeCheckNames) && !mergeCheckNames.length) return false
      let result = true
      for (let index = 0; index < mergeCheckNames.length; index++) {
        const mergeCheckName = mergeCheckNames[index]
        if (currentRowData[mergeCheckName] !== preRowData[mergeCheckName]) {
          result = false
          break
        }
      }
      return result
    },

    /** 样式控制方法 */
    tableBodyCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.companyName === '总计') {
        return 'background:#DDDDDD; color: #00008B; font-size: 22px; font-weight: bolder;'
      } else if (row.groupName === '小计') {
        return 'background:#DDDDDD; font-size: 21px; font-weight: bolder;'
      } else if (columnIndex === 4 && row[column.property] > 0) {
        return 'background:#FF3030; color: #FFFFFF; font-size: 20px; font-weight: bolder;'
      } else if (columnIndex === 3 && row[column.property] > 0) {
        return 'background:#228B22; color: #FFFFFF; font-size: 20px; font-weight: bolder;'
      } else if (columnIndex === 9 && row[column.property] > 0) {
        return 'background:#FF3030; color: #FFFFFF; font-size: 20px; font-weight: bolder;'
      } else {
        return 'font-size: 20px; font-weight: bolder;'
      }
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle1
      let cellStyle2
      let cellStyle3
      cellStyle1 = 'font-size: 22px; font-weight: bolder; color: #fff; background:#436EEE'
      cellStyle2 = 'font-size: 22px; font-weight: bolder; color: #fff; background:#FF3030'
      cellStyle3 = 'font-size: 22px; font-weight: bolder; color: #fff; background:#00BFBF'
      if (columnIndex >= 0 && columnIndex < 4 && rowIndex === 0) {
        return cellStyle1
      }
      if (columnIndex >= 0 && columnIndex <= 5 && rowIndex === 1) {
        return cellStyle1
      }
      if (rowIndex === 0) {
        return cellStyle2
      }
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

    handleExport() {
      this.download('wbcomparison/statistics/export', {
        ...this.queryParams
      }, `打线图比对概览_${new Date().getTime}.xlsx`)
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
      if (days > 365) {
        return callback(new Error('时间跨度不能超过一年'))
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
    }
  }
}
</script>

<style scoped>

</style>
