<template>
<div class="app-container">
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68xp" :rules="rules">
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
        @change="handleQuery"
      >
        <el-option
          v-for="item in workshopOptions"
          :key="item"
          :label="item"
          :value="item"
        >
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
      >导出
      </el-button>
    </el-col>
    <el-col :span="12">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-col>
  </el-row>

  <el-table
    v-loading="loading"
    :data="tableData"
    border
    :span-method="arraySpanMethod"
    :cell-style="tableBodyCellStyle"
    :header-cell-style="tableHeaderCellStyle"
  >
    <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="groupName" label="车间" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="deviceType" label="设备类型" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="eqId" label="设备编码" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="mcId" label="设备编码" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="prodType" label="机型" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="reason" label="描述" align="center" min-width="120" fit></el-table-column>
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
import { listQcpParamsIsNull } from '@/api/biz/qcp/parameters'

export default {
  name: 'index',

  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      tableData: [],
      factoryOptions: [],
      workshopOptions: [],
      deviceTypeOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: '',
        groupName: '',
        deviceType: '',
        eqId: null,
        mcId: null,
      },
      rules: {},
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
      rowMergeArrs: {} // 包含需要一个或多个合并项信息的对象
    }
  },

  created() {
    console.log(this.$route.query)

    if (this.beforeRouteEnter) {
    } else {
      if (this.$route.query.companyName !== undefined && this.$route.query.companyName !== null && this.$route.query.companyName !== '') {
        this.queryParams.companyName = this.$route.query.companyName
        this.queryParams.groupName = this.$route.query.groupName
        this.queryParams.deviceType = this.$route.query.deviceType
      }
    }
  },

  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listQcpParamsIsNull(this.queryParams).then(response => {
        this.tableData = response.rows
        this.total = response.total
        this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.tableData)
        this.loading = false
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    restQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 导出 */
    handleExport() {
      this.download('wbcomparison/particulars/export', {
        ...this.queryParams
      }, `qcp参数模版明细_${new Date().getTime()}.xlsx`)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 样式控制方法 */
    tableBodyCellStyle({ row, column, rowIndex, columnIndex }) {

      if (columnIndex > 4 && columnIndex < 7) {
        return 'padding: 0; font-size: 16px; text-align: center; font-weight: bolder; background: oldlace;'
      } else if (columnIndex === 7) {
        return 'padding: 0; font-size: 16px; text-align: center; font-weight: bolder; background: #f0f9eb;'
      } else {
        return 'padding: 0; font-size: 16px; text-align: center; font-weight: bolder; '
      }
    },

    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle1
      cellStyle1 = 'font-size: 1vw; font-weight: bolder; text-align: center; color: #fff; background: #3498db'
      return cellStyle1
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
    }
  },


}
</script>

<style scoped>

</style>
