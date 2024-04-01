<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" :rules="rules">
      <el-form-item label="时段" prop="dtRange">
        <el-date-picker
          v-model="queryParams.dtRange"
          style="width: 350px"
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
      <el-form-item label="机型" prop="prodType">
        <el-input
          v-model="queryParams.prodType"
          placeholder="请输入机型"
          clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      :span-method="arraySpanMethod"
      :cell-style="tableBodyCellStyle"
      :header-cell-style="tableHeaderCellStyle"
      style="width: 100%; color: #363636"
    >
      <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="eqId" label="设备编号" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="mcId" label="机台号" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="prodType" label="机种" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="dt" label="时间" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="code" label="状态码" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="description" label="描述" align="center" min-width="120" show-overflow-tooltip></el-table-column>
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
import { listComparisonDetail } from '@/api/biz/wbcomparison/percentage'
import { getFactoryNames, getGroupNames } from '@/api/biz/wbcomparison/overview'
// import overview from "../overview/index";

export default {
  name: 'index',
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      loading: true,
      tableData: null,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date(new Date().setHours(23, 59, 59).valueOf())
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
      },
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        groupName: null,
        dtRange: [],
        prodType: null,
        flag: null,
        code: null
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
      },
    }
  },

  created() {
    // 日期区间回显
    if (this.$route.query.dtRange === undefined || this.$route.query.dtRange === null || this.$route.query.dtRange === '') {
      this.$set(this.queryParams, 'dtRange', [this.DateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.DateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))])
    } else {
      this.queryParams.dtRange = this.$route.query.dtRange
      this.queryParams.companyName = this.$route.query.companyName
      this.queryParams.groupName = this.$route.query.groupName
      this.queryParams.eqId = this.$route.query.eqId
      this.queryParams.prodType = this.$route.query.prodType
      this.queryParams.flag = this.$route.query.flag
      this.queryParams.code = this.$route.query.code
    }

  },

  mounted() {
    this.getList();
    // overview.methods.getFactoryNames()
    this.getFactoryNames();
  },

  methods: {
    getList() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          this.queryParams.params = {}
          if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
            this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
            this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
            listComparisonDetail(this.queryParams).then(response => {
              this.tableData = response.rows
              this.total = response.total;
              this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, response.rows)
              this.loading = false
            })
          }
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.$route.query.dtRange === undefined || this.$route.query.dtRange === null || this.$route.query.dtRange === '') {
        this.resetForm("queryForm");
      } else {
        this.reset();
      }
      this.handleQuery();
    },
    getFactoryNames() {
      getFactoryNames().then(response => {
        for (const i in response.data) {
          this.factoryOptions.push(response.data[i]['companyName'])
        }
      })
    },
    /** 重置查询参数（resetForm是重置为初始值，此处重置为空值） */
    reset() {
      this.queryParams = {
        pageNum: 1,
          pageSize: 10,
          companyName: null,
          groupName: null,
          dtRange: [this.DateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.DateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))],
          prodType: null,
          flag: null,
          code: null
      }
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

    /** 导出 */
    handleExport() {
      this.download('wbcomparison/particulars/export', {
        ...this.queryParams
      }, `打线图机台比对明细_${new Date().getTime()}.xlsx`)
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
      if (columnIndex === 6 && row[column.property] > 0) {
        return 'color: #FF3030; font-size: 18px; font-weight: bolder;'
      } else if ((columnIndex === 7 && row[column.property] !== 'qualified')) {
        return 'background: orangered; color: #FFFFFF; font-size: 11px;'
      } else {
        return 'font-size: 18px; font-weight: bolder;'
      }
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle1
      let cellStyle2
      let cellStyle3

      cellStyle1 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#436EEE'
      cellStyle2 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#FF3030'
      cellStyle3 = 'font-size: 21px; font-weight: bolder; color: #fff; background:#00BFBF'

      return cellStyle3
    },
  }
}
</script>

<style scoped>
/*.table-content-font {
  font-size: 20px;
  color: #ff007b;
}*/

.table-link-font {
  font-size: 18px;
  font-weight: bolder;
}

/*a:link {
  text-decoration: none;
  color: brown;
}*/

a:visited {
  text-decoration: none;
  color: brown;
}

a:hover {
  font-size: 22px;
  text-decoration: none;
  color: #00afff;
}

a:active {
  text-decoration: none;
  color: black;
}
</style>

