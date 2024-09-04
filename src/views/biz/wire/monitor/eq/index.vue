<template>
  <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="厂区" prop="factoryName">
          <el-select
            v-model="queryParams.factoryName"
            style="width: 240px"
            placeholder="请输入厂区"
            clearable
            filterable
            :loading="loading"
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
        <el-form-item label="车间" prop="workshop">
          <el-select
            v-model="queryParams.workshop"
            style="width: 240px"
            placeholder="请输入车间"
            clearable
            filterable
            :loading="loading"
            @focus="getWorkshopNameList"
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
        <el-form-item label="EQ" prop="deviceMId">
          <el-input
            v-model="queryParams.deviceMId"
            style="width: 240px"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="机型" prop="prodType">
          <el-input
            v-model="queryParams.prodType"
            style="width: 240px"
            placeholder="请输入机型"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="线径" prop="wireWidth">
          <el-input
            v-model="queryParams.wireWidth"
            style="width: 240px"
            placeholder="请输入线径"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="daterangeCreateDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable @change="handleQuery" style="width: 240px">
            <el-option
              v-for="dict in dict.type.wire_diff_status"
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
            v-hasPermi="['biz/wire/monitor:eq:export']"
          >导出
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>


    <el-card>
      <el-table
        v-loading="loading"
        :data="eqList"
        @selection-change="handleSelectionChange"
        :cell-style="bodyCellStyle"
        :header-cell-style="headerCellStyle"
        :style="tableStyle()"
      >
        <el-table-column label="序号" type="index" width="55" align="center"/>
        <el-table-column label="厂区" align="center" prop="factoryName"/>
        <el-table-column label="车间" align="center" prop="workshop"/>
        <el-table-column label="机型" align="center" prop="prodType"/>
        <el-table-column label="设备编号(EQ)" align="center" prop="deviceMId"/>
        <el-table-column label="线径" align="center" prop="wireWidth" />
        <el-table-column label="实际用量" align="center" prop="actualWireUsage">
          <template slot-scope="scope">{{ $getBit(scope.row.actualWireUsage, 4) }}</template>
        </el-table-column>
        <el-table-column label="维护用量" align="center" prop="standardWireUsage">
          <template slot-scope="scope">{{ $getBit(scope.row.standardWireUsage, 4) }}</template>
        </el-table-column>
        <el-table-column label="BOM用量" align="center" prop="bomWireUsage">
          <template slot-scope="scope">{{ $getBit(scope.row.bomWireUsage, 4) }}</template>
        </el-table-column>
        <el-table-column label="产量" align="center" prop="yield">
          <template slot-scope="scope">{{ $getBit(scope.row.yield, 0) | numberToCurrency }}</template>
        </el-table-column>
        <el-table-column label="差异(%)" align="center" prop="percents">
          <template slot-scope="scope">{{ $getBit(scope.row.percents, 2) }}</template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import '@/views/biz/common/css/qtech-css.css'
import { headerCellStyle, bodyCellStyle, tableStyle } from '@/views/biz/common/js/tableStyles';
import { pickerOptionsSet2 } from '@/views/biz/common/js/pickerOptionsConfig'
import { listEq } from '@/api/biz/wire/monitor/eq'
import { factoryNameList, workshopNameList } from '@/api/biz/wire/monitor/factoryAndWorkshopNameList'

export default {
  name: 'Eq',
  dicts: ['wire_diff_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 金线消耗量表格数据
      eqList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态时间范围
      daterangeCreateDate: [this.$dateToStr(new Date(new Date().valueOf())).substring(0, 10),
        this.$dateToStr(new Date(new Date().valueOf() + 1 * 1440 * 60 * 1000)).substring(0, 10)],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName: null,
        workshop: null,
        deviceMId: null,
        prodType: null,
        wireWidth: null,
        createDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      // 时间选择器范围
      pickerOptions: pickerOptionsSet2,
    }
  },
  created() {
    this.getList();
    this.getFactoryNameList();
  },
  methods: {
    headerCellStyle,
    bodyCellStyle,
    tableStyle,
    /** 查询金线消耗量列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateDate && '' !== this.daterangeCreateDate) {
        this.queryParams.params['beginCreateDate'] = this.daterangeCreateDate[0]
        this.queryParams.params['endCreateDate'] = this.daterangeCreateDate[1]
      }
      listEq(this.queryParams).then(response => {
        this.eqList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        factoryName: null,
        workshop: null,
        deviceMId: null,
        prodType: null,
        wireWidth: null,
        actualWireUsage: null,
        standardWireUsage: null,
        bomWireUsage: null,
        yield: null,
        percents: null,
        createDate: null,
        status: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateDate = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.mcIds = selection.map(item => item.mcId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/wire/monitor/eq/export', {
        ...this.queryParams
      }, `workshop_${new Date().getTime()}.xlsx`)
    },

    /** 远程获取厂区名称 */
    getFactoryNameList() {
      factoryNameList().then(res => {
        for (const i in res.data) {
          this.factoryOptions.push(res.data[i]['factoryName'])
        }
      })
    },
    /** 给输入框设置值 */
    changeOneSelection(val, fromObj, targetStr) {
      fromObj.find(item => {
        if (item.value === val) {
          targetStr = item
        }
      })
      this.handleQuery();
    },
    /** 根据厂给定的值，查询区的值 */
    getWorkshopNameList() {
      workshopNameList(this.queryParams).then(res => {
        this.workshopOptions = []
        for (const i in res.data) {
          this.workshopOptions.push(res.data[i]['workshopName'])
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
