<template>
  <div class="app-container center">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="设备号" prop="eqCode">
        <el-input
          v-model="queryParams.eqCode"
          placeholder="请输入设备号"
          clearable
          size="small"
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机台号" prop="mcId">
        <el-input
          v-model="queryParams.mcId"
          placeholder="请输入机台号"
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
              :cell-style="bodyCellStyle"
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
import { pickerOptionsSet1 } from '@/views/biz/common/js/pickerOptionsConfig'
import { headerCellStyle, bodyCellStyle, tableStyle } from '@/views/biz/common/js/tableStyles';
import { getFactoryNames, getGroupNames, listHistoryCheckStatus } from '@/api/biz/aa/params'

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
      pickerOptions: pickerOptionsSet1
    }
  },
  methods: {
    headerCellStyle,
    bodyCellStyle,
    tableStyle,
    /** 查询设备比对结果列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
        this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
        this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
        listHistoryCheckStatus(this.queryParams).then(response => {
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

    handleExport() {
      this.download('aa/params/history/status/export', {
        ...this.queryParams
      }, `AA参数反控机台状态_${new Date().getTime()}.xlsx`)
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
