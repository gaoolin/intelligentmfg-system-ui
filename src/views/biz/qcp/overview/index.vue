<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
             :rules="rules"
    >
      <el-form-item label="厂区" prop="companyName">
        <el-select
          v-model="queryParams.companyName"
          placeholder="请输入厂区"
          filterable
          clearable
          @change="selectionFilter(queryParams)"
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
          filterable
          clearable
          @change="selectionFilter(queryParams)"
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
      <el-form-item label="设备类型" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          placeholder="请输入设备类型"
          filterable
          clearable
          @change="selectionFilter(queryParams)"
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
        更新时间：<span style="font-weight: bolder; color: red">{{ updateDt }}</span>
      </el-col>
      <el-col :span="12">
        <right-tool-bar-download :showSearch.sync="showSearch" @queryTable="getList" @handleExport="handleExport"></right-tool-bar-download>
      </el-col>
    </el-row>

    <el-table
      class="ele-body-base"
      v-loading="loading"
      :data="filterTableData"
      ref="table"
      id="table"
      show-summary
      border
      :span-method="arraySpanMethod"
      :cell-style="tableBodyCellStyle"
      :header-cell-style="tableHeaderCellStyle"
    >
      <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="deviceType" label="设备类型" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="ttlEqs" label="设备总数" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="onlineEqs" label="已联网" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="offlineEqs" label="未联网" align="center" min-width="120" fit>
        <template scope="scope">
          <router-link :to="{path: '/biz/eqn/networking', query: {
            companyName: scope.row.companyName,
            groupName: scope.row.groupName,
            deviceType: scope.row.deviceType,
            label: 1
          }}">
            <span>{{ scope.row.offlineEqs !== 0 ? scope.row.offlineEqs : '' }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="qcpParamsIsNull" label="无qcp参数模版" align="center" min-width="160" fit>
        <template scope="scope">
          <router-link :to="{path: '/biz/qcp/detail', query: {
            companyName: scope.row.companyName,
            groupName: scope.row.groupName,
            deviceType: scope.row.deviceType,
            label: 1
          }}">
            <span>{{ scope.row.qcpParamsIsNull !== 0 ? scope.row.qcpParamsIsNull : '' }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="remoteControlOff" label="未开启远程" align="center" min-width="120" show-overflow-tooltip>
        <template scope="scope">
          <router-link :to="{path: '/biz/eqn/networking', query:{
            companyName: scope.row.companyName,
            groupName: scope.row.groupName,
            deviceType: scope.row.deviceType,
            status: 1,
            label: 2
          }}">
            <span>{{ scope.row.remoteControlOff !== 0 ? scope.row.remoteControlOff : '' }}</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listQcpOverview, getDataMaxTime } from '@/api/biz/qcp/parameters'
import RightToolBarDownload from '@/views/biz/RightToolBarDownload'

export default {
  name: 'index',
  components: { RightToolBarDownload },
  props: {
    component: RightToolBarDownload
  },

  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      loading: true,
      tableData: [],
      filterTableData: [],
      companyFilter: [],
      groupNameFilter: [],
      deviceTypeFilter: [],
      companyFilterTmp: [],
      groupNameFilterTmp: [],
      deviceTypeFilterTmp: [],
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      deviceTypeOptions: [],
      updateDt: "-",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: '',
        groupName: '',
        deviceType: '',
        status: null,
        remoteControlOff: null,
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
    if (this.beforeRouteEnter) {
    } else {
      this.getList()
      this.getDataMaxTime()
    }
  },

  mounted() {
    // overview.methods.getFactoryNames()
    // 2、用于合并行或列
    this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.filterTableData)
  },

  methods: {
    getList() {
      this.loading = true
      listQcpOverview(this.queryParams).then(response => {
        this.tableData = response.rows
        this.filterTableData = this.tableData
        for (const re of this.filterTableData) {
          this.companyFilterTmp.push(re.companyName)
          this.groupNameFilterTmp.push(re.groupName)
          this.deviceTypeFilterTmp.push(re.deviceType)
        }

        const companySet = new Set(this.companyFilterTmp)
        const groupNameSet = new Set(this.groupNameFilterTmp)
        const deviceTypeSet = new Set(this.deviceTypeFilterTmp)
        this.factoryOptions = Array.from(companySet)
        this.workshopOptions = Array.from(groupNameSet)
        this.deviceTypeOptions = Array.from(deviceTypeSet)

        // 2、用于合并行或列
        this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.filterTableData)
        this.loading = false
      })
    },

    getDataMaxTime() {
      getDataMaxTime().then(response => {
        this.updateDt = response.data
      })
    },

    async selectionFilter(val) {
      await this.tableDataFilter(val)
      await this.updateSelectionElements(this.filterTableData)
    },

    tableDataFilter(val) {
      this.filterTableData = this.tableData.filter(function(data) {
        let a = false
        let b = false
        let c = false

        if (val.companyName !== '') {
          a = data.companyName === val.companyName
        } else {
          a = true
        }

        if (val.groupName !== '') {
          b = data.groupName === val.groupName
        } else {
          b = true
        }

        if (val.deviceType !== '') {
          c = data.deviceType === val.deviceType
        } else {
          c = true
        }
        return a && b && c
      })

      this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.filterTableData)
    },

    updateSelectionElements(val) {
      this.groupNameFilterTmp = []
      this.deviceTypeFilterTmp = []
      for (const re of val) {
        this.groupNameFilterTmp.push(re.groupName)
        this.deviceTypeFilterTmp.push(re.deviceType)
      }
      const groupNameSetTmp = new Set(this.groupNameFilterTmp)
      const deviceTypeSetTmp = new Set(this.deviceTypeFilterTmp)
      this.workshopOptions = Array.from(groupNameSetTmp)
      this.deviceTypeOptions = Array.from(deviceTypeSetTmp)
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
      this.download('qcp/params/export', {
        ...this.queryParams
      }, `qcp参数概览_${new Date().getTime()}.xlsx`)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 样式控制方法 */
    tableBodyCellStyle({ row, column, rowIndex, columnIndex }) {

      return 'padding: 0; font-size: 16px; text-align: center; font-weight: bolder; '

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

  watch: {
    filterTableData: {
      immediate: true,
      handler() {
        // await this.$nextTick(); 根据实际选择延迟调用
        this.$nextTick(() => {
          const tds = document.querySelectorAll('#table .el-table__footer-wrapper tr>td')
          // console.log(tds)
          tds[0].colSpan = 3
          tds[0].style.textAlign = 'center'
          tds[0].style.background = '#3498db'
          tds[0].style.color = '#ffffff'
          // 合并3个单元格右移了2个空单元格，需对其进行设置
          tds[1].style.display = 'none'
          tds[2].style.display = 'none'
          tds[3].style.background = '#3498db'
          tds[3].style.color = '#ffffff'
          tds[4].style.background = '#3498db'
          tds[4].style.color = '#ffffff'
          tds[5].style.background = '#3498db'
          tds[5].style.color = '#ffffff'
          tds[6].style.background = '#3498db'
          tds[6].style.color = '#ffffff'
          tds[7].style.background = '#3498db'
          tds[7].style.color = '#ffffff'
        })
      }
    }
  }
}
</script>

<style scoped>
.table-content-font {
  font-size: 16px;
  color: #ff007b;
}

.table-link-font {
  font-size: 16px;
  font-weight: bolder;
}

a:link {
  text-decoration: none;
  color: brown;
}

a:visited {
  text-decoration: none;
  color: brown;
}

a:hover {
  font-size: 25px;
  text-decoration: none;
  color: #ff007b;
}

a:active {
  text-decoration: none;
  color: black;
}


::v-deep .el-table .el-table__footer-wrapper .cell {
  text-align: center;
  font-size: 18px;
  font-weight: bolder;
}

::v-deep .el-table .el-table__header-wrapper .el-table__header tr {
  color: #5f565e;
  background-color: red;
}
</style>
