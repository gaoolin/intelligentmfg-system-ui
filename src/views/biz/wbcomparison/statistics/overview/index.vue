<template>
  <div class="app-container center">
    <h1 style="text-align:center; margin-top: 0; padding-top: 0; font-weight: bolder">打线图比对数据概览</h1>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
             :rules="rules">
      <el-form-item label="时段" prop="dtRange" label-width="50px">
        <el-date-picker
          v-model="queryParams.dtRange"
          style="width: 340px"
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
    <el-row :gutter="5" class="mb5" type="flex" align="middle">
      <el-col :span="12" style="font-weight: bolder">
        更新时间：<span style="color: red;">{{ updateTime === null ? '-' : updateTime }}</span>
      </el-col>

      <el-col :span="12">
        <right-tool-bar-download :showSearch.sync="showSearch" @queryTable="getList" @handleExport="handleExport"></right-tool-bar-download>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :span-method="arraySpanMethod"
      :cell-style="tableBodyCellStyle"
      :header-cell-style="tableHeaderCellStyle"
      :row-style="{height: '25px'}"
      style="width: 100%; color: #363636">
      <el-table-column prop="companyName" label="厂区" align="center" min-width="100" fit>
      </el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="120" fit>
      </el-table-column>
      <el-table-column prop="ttlEqs" label="设备总数" align="center" min-width="60" >
        <template scope="scope">
          <span v-if="scope.row.ttlEqs > 0">{{ scope.row.ttlEqs | numberToCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="onlineEqs" label="联网机台数" align="center" min-width="60" >
        <template scope="scope">
          <span v-if="scope.row.onlineEqs > 0">{{ scope.row.onlineEqs | numberToCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offlineEqs" label="未联网机台数" align="center" min-width="60" >
        <template scope="scope">
          <router-link :to="{path: '/biz/eqn/networking', query: {
            companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
            groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
            deviceType: 'WB',
            label: 1
          }}">
            <span v-if="scope.row.offlineEqs > 0">{{ scope.row.offlineEqs | numberToCurrency }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="computeCnt" label="比对次数" align="center" min-width="80">
        <!-- 注意：router-link中链接如果是'/'开始就是从根路由开始，如果开始不带'/'，则从当前路由开始。 -->
        <template scope="scope">
          <span v-if="scope.row.computeCnt > 0">{{ scope.row.computeCnt | numberToCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="okCnt" label="正确次数" align="center" min-width="80">
        <template scope="scope">
          <router-link :to="{ path: '/biz/wbcomparison/statistics/percentage', query: {
            dtRange: queryParams.dtRange,
            companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
            groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
            flag: 'ok'} }">
            <span v-if="scope.row.okCnt > 0">{{ scope.row.okCnt | numberToCurrency }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" align="center">
        <el-table-column prop="errCnt" label="错误次数" align="center">
          <template scope="scope">
            <router-link :to="{ path: '/biz/wbcomparison/statistics/percentage', query: {
              dtRange: queryParams.dtRange,
              companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
              groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
              flag: 'err' }}" >
              <span v-if="scope.row.errCnt > 0">{{ scope.row.errCnt | numberToCurrency }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="offsetCnt" label="金线偏移" align="center" fit>
          <template scope="scope">
            <router-link :to="{ path: '/biz/wbcomparison/statistics/particulars', query: {
            dtRange: queryParams.dtRange,
            companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
            groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
            code: 1} }">
              <span v-if="scope.row.offsetCnt > 0">{{ scope.row.offsetCnt | numberToCurrency }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="npCnt" label="无线图模版" align="center" fit>
          <template scope="scope">
            <router-link :to="{ path: '/biz/wbcomparison/statistics/particulars', query: {
            dtRange: queryParams.dtRange,
            companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
            groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
            code: 3} }">
              <span v-if="scope.row.npCnt > 0">{{ scope.row.npCnt | numberToCurrency }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="少线/多线" align="center" fit>
          <template scope="scope">
            <span v-if="(scope.row.lackCnt + scope.row.overCnt) > 0">{{ scope.row.lackCnt + scope.row.overCnt | numberToCurrency }}</span>
          </template>
          <template scope="scope">
            <router-link :to="{ path: '/biz/wbcomparison/statistics/particulars', query: {
            dtRange: queryParams.dtRange,
            companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
            groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
            code: 5} }">
              <span v-if="(scope.row.lackCnt + scope.row.overCnt) > 0">{{ scope.row.lackCnt + scope.row.overCnt | numberToCurrency }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="errRatio" label="错误率" align="center" fit>
          <template scope="scope">
              <span>{{ scope.row.errRatio > 0 ? toPercent(getBit(scope.row.errRatio, 6), 2) : '-' }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listOverview, getFactoryNames, getGroupNames, getUpdateTime } from '@/api/biz/wbcomparison/overview'
import { listEqInfo } from '@/api/biz/eqn/networking'

import RightToolBarDownload from '@/views/biz/common/RightToolBarDownload'

export default {
  name: 'index',
  components: { RightToolBarDownload },

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
      },
      open: false,
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      queryParams: {
        companyName: null,
        groupName: null,
        dtRange: [],
        deviceType: 'WB',
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
      updateTime: null
    }
  },

  created() {
    // 日期区间回显
    this.$set(this.queryParams, 'dtRange', [this.$dateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.$dateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))])
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

            let ds1 = new Promise((resolve, reject) => {
              listOverview(this.queryParams).then(res => {
                resolve(res.rows)
              }).catch(err => {
                reject(err)
              })
            })
            // 请求 2
            let ds2 = new Promise((resolve, reject) => {
              listEqInfo(this.queryParams).then(res => {
                resolve(res.rows)
              }).catch(err => {
                reject(err)
              })
            })
            // 发起第三请求
            Promise.all([ds1, ds2]).then(res => {
              // console.log(res) // 返回的数组，就是前两个请求返回的数据
              res[1].forEach(d2 => {
                res[0].forEach(d1 => {
                  if (d1.companyName === d2.companyName && d1.groupName === d2.groupName) {
                    d1.ttlEqs = d2.ttlEqs
                    d1.offlineEqs = d2.offlineEqs
                    d1.onlineEqs = d1.ttlEqs - d1.offlineEqs
                  }
                })
              })
              this.tableData = res[0]
              this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.tableData)
              this.loading = false
              console.log(res[0])
            })
            this.getUpdateTime()
          }
        }
      })
    },

    getFactoryNames() {
      getFactoryNames().then(response => {
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

    getUpdateTime() {
      getUpdateTime().then(response => {
        this.updateTime = response.data
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
        return 'background: #DDDDDD; color: #00008B; font-size: 21px; font-weight: bolder;'
      } else if (row.groupName === '小计') {
        return 'background: #DDDDDD; font-size: 20px; font-weight: bolder;'
      } else if (columnIndex === 6 && row[column.property] > 0) {
        return 'background:#228B22; color: #FFFFFF; font-size: 19px; font-weight: bolder; text-decoration: underline;'
      } else if (columnIndex === 4  && row[column.property] > 0) {
        return 'background: #FFBB00; color: #FFFFFF; font-size: 19px; font-weight: bolder; text-decoration: underline;'
      } else if (columnIndex === 7 && row[column.property] > 0) {
        return 'background: orangered; color: #FFFFFF; font-size: 19px; font-weight: bolder; text-decoration: underline;'
      } else if ((columnIndex > 7 && columnIndex < 11) && row[column.property] > 0) {
        return 'font-size: 19px; font-weight: bolder; text-decoration: underline;'
      } else if (columnIndex === 11 && row[column.property] > 0) {
        return 'color: red; font-size: 19px; font-weight: bolder;'
      } else {
        return 'font-size: 20px; font-weight: bolder;'
      }
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle1
      let cellStyle2
      let cellStyle3

      cellStyle1 = 'font-size: 21px; font-weight: bolder; color: #fff; background: #436EEE'
      cellStyle2 = 'font-size: 21px; font-weight: bolder; color: #fff; background: orangered'
      cellStyle3 = 'font-size: 21px; font-weight: bolder; color: #fff; background: #00BFBF'

      if (columnIndex >= 0 && columnIndex < 7 && rowIndex === 0) {
        return cellStyle1
      }
      if (columnIndex >= 0 && columnIndex < 5 && rowIndex === 1) {
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
      }, `打线图比对概览_${new Date().getTime()}.xlsx`)
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

  }
}
</script>

<style scoped>
/*.table-content-font {
  font-size: 20px;
  color: #ff007b;
}*/

.table-link-font {
  font-size: 19px;
  font-weight: bolder;
}

a:link {
  /*text-decoration: underline;*/
  /*color: brown;*/
}

a:visited {
  /*下划线*/
  /*text-decoration: none;*/
  /*color: brown;*/
}

a:hover {
  font-size: 25px;
  /*text-decoration: none;*/
  /*color: #00afff;*/
}

a:active {
  /*text-decoration: none;*/
  color: black;
}

</style>
