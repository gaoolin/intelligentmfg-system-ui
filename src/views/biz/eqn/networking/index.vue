<template>
<div class="app-container">
  <div style="text-align:center;">
    <h1 style="margin-top: 0; padding-top: 0; font-weight: bolder" v-if="queryParams.label === '1'">未联网机台明细</h1>
    <h1 style="margin-top: 0; padding-top: 0; font-weight: bolder" v-else-if="queryParams.label === '2'">未开启远程机台明细</h1>
  </div>

  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="72px" :rulues="rules">
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
      <right-tool-bar-go-back :showSearch.sync="showSearch" @queryTable="getList" :back="back"></right-tool-bar-go-back>
    </el-col>
  </el-row>

  <el-table
    v-loading="loading"
    :data="tableData"
    :header-cell-style="headerCellStyle"
    :cell-style="bodyCellStyle"
    :style="tableStyle()"
  >
    <el-table-column prop="companyName" label="厂区" align="center" min-width="100" fit></el-table-column>
    <el-table-column prop="deptName" label="站位" align="center" min-width="100" fit></el-table-column>
    <el-table-column prop="groupName" label="车间" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="deviceType" label="设备类型" align="center" min-width="80" fit></el-table-column>
    <el-table-column prop="eqId" label="设备编号" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="mcId" label="机台号" align="center" min-width="120" fit></el-table-column>
    <el-table-column prop="simId" label="盒子号" align="center" min-width="160" fit></el-table-column>
    <el-table-column prop="remoteControlCode" label="远程状态码" align="center" min-width="80" v-if="queryParams.label !== '1'" fit></el-table-column>
    <el-table-column prop="status" label="远程开关" align="center" min-width="80" v-if="queryParams.label !== '1'" show-overflow-tooltip>
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
import '@/views/biz/common/css/qtech-css.css'
import { headerCellStyle, bodyCellStyle, tableStyle } from '@/views/biz/common/js/tableStyles';
import { getFactoryNames, getGroupNames, listEqStatus, listOfflineEqs } from '@/api/biz/eqn/networking'
import RightToolBarGoBack from '@/views/biz/common/RightToolBarGoBack'

export default {
  components: { RightToolBarGoBack },
  dicts: ['remote_control_status'],
  name: 'index',

  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      back: false,
      // 总条数
      total: 0,
      loading: true,
      tableData: null,
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      deviceTypeOptions: ['DB', 'WB', 'HM', 'AA'],
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
    headerCellStyle,
    bodyCellStyle,
    tableStyle,

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

    reset() {
      this.queryParams = {
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
      }
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
      this.download('/aa/params/hdfs/downloadFile', {
        ...this.queryParams
      }, `设备联网情况明细_${new Date().getTime()}.xlsx`)
    },

    /** 重置按钮操作 */
    resetQuery() {
      if (this.$route.query.label !== undefined) {
        this.reset()
        this.back = false
      } else {
        this.resetForm("queryForm");
      }
      this.handleQuery();
    },
  },
}
</script>

<style scoped>

</style>
