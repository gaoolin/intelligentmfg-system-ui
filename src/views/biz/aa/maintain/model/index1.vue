<template>
  <div class="app-container center">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机型" prop="prodType">
        <el-input
          v-model="queryParams.prodType"
          placeholder="请输入机型"
          clearable
          @change="dataChange"
          @keyup.enter.native="handleQuery"
        />
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

    <el-table v-loading="loading" :data="resultList" :key="refreshKey" border>
      <!-- Index and common properties -->
      <el-table-column type="index" label="序号" width="55" align="center" fixed/>

      <!-- Machine operations -->
      <el-table-column prop="init" label="init" align="center"/>
      <el-table-column prop="grab" label="grab" align="center"/>
      <el-table-column prop="reInit" label="reInit" align="center"/>
      <el-table-column prop="senserReset" label="senserReset" align="center"/>
      <el-table-column prop="clampOnOff" label="clampOnOff" align="center"/>

      <!-- Identification and status -->
      <el-table-column prop="prodType" label="机型" align="center"/>
      <el-table-column prop="sid" label="SID" align="center"/>

      <!-- VCM related -->
      <el-table-column prop="vcmHall" label="vcmHall" align="center"/>
      <el-table-column prop="vcmInit" label="vcmInit" align="center"/>
      <el-table-column prop="vcmHall2" label="vcmHall2" align="center"/>
      <el-table-column prop="vcmPowerOff" label="vcmPowerOff" align="center"/>
      <el-table-column prop="vcmPowerOn" label="vcmPowerOn" align="center"/>
      <el-table-column prop="vcmTop" label="vcmTop" align="center"/>
      <el-table-column prop="vcmTopHall" label="vcmTopHall" align="center"/>
      <el-table-column prop="vcmZ" label="VCM Z轴" align="center"/>
      <el-table-column prop="vcmZHAll" label="VCM Z霍尔" align="center"/>
      <el-table-column prop="vcmOisInit" label="VCM OIS初始化" align="center"/>
      <el-table-column prop="vcmMoveToZ" label="VCM移动到Z" align="center"/>

      <!-- Light Processing (LP) -->
      <el-table-column prop="lpOn" label="LP开启" align="center"/>
      <el-table-column prop="lpOcCheck" label="LP OC检查" align="center"/>
      <el-table-column prop="lpOc" label="LP OC" align="center"/>
      <el-table-column prop="lpOnBlemish" label="LP开启瑕疵检查" align="center"/>
      <el-table-column prop="lpOff" label="LP关闭" align="center"/>
      <el-table-column prop="lpBlemish" label="LP Blemish" align="center"/>

      <!-- Inspection checks -->
      <el-table-column prop="mtfCheck" label="MTF检查" align="center"/>
      <el-table-column prop="mtfCheck2" label="MTF检查2" align="center"/>
      <el-table-column prop="mtfCheck3" label="MTF检查3" align="center"/>
      <el-table-column prop="mtfOffAxisCheck1" label="MTF离轴检查1" align="center"/>
      <el-table-column prop="mtfOffAxisCheck2" label="MTF Off-Axis Check 2" align="center"/>
      <el-table-column prop="mtfOffAxisCheck3" label="MTf Off-Axis Check 3" align="center"/>

      <!-- Alignment and positioning -->
      <el-table-column prop="chartAlignment" label="图表对齐" align="center"/>
      <el-table-column prop="chartAlignment1" label="图表对齐1" align="center"/>
      <el-table-column prop="chartAlignment2" label="Chart Alignment 2" align="center"/>
      <el-table-column prop="vcmMoveToZPos" label="VCM Move to Z Position" align="center"/>
      <el-table-column prop="moveToBlemishPos" label="移动到瑕疵位置" align="center"/>
      <el-table-column prop="zOffset" label="Z Offset" align="center"/>

      <!-- Optical checks -->
      <el-table-column prop="AA1" label="AA1" align="center"/>
      <el-table-column prop="AA2" label="AA2" align="center"/>
      <el-table-column prop="AA3" label="AA3" align="center"/>
      <el-table-column prop="roiCc" label="ROI Center-Center" align="center"/>
      <el-table-column prop="roiUl" label="ROI Upper-Left" align="center"/>
      <el-table-column prop="roiUr" label="ROI Upper-Right" align="center"/>
      <el-table-column prop="roiLl" label="ROI Lower-Left" align="center"/>
      <el-table-column prop="roiLr" label="ROI Lower-Right" align="center"/>

      <!-- Result columns -->
      <el-table-column v-for="(result, index) in Array.from({length: 52}, (_, i) => `result${i+1}`)"
                       :key="result"
                       :prop="result.toLowerCase()"
                       :label="`result${index + 1}`"
                       align="center"
      />

      <!-- Additional checks and operations -->
      <el-table-column prop="delay" label="延迟" align="center"/>
      <el-table-column prop="vcmPowerOffCheck" label="VCM断电检查" align="center"/>
      <el-table-column prop="recordPosition" label="记录位置" align="center"/>

      <el-table-column type="index" label="序号" width="55" align="center" fixed/>
      <el-table-column prop="prodType" label="机型" align="center"/>
      <el-table-column prop="destroyStart" label="destroyStart" align="center"/>
      <el-table-column prop="init" label="init" align="center"/>
      <el-table-column prop="grab" label="grab" align="center"/>
      <el-table-column prop="reInit" label="reInit" align="center"/>
      <el-table-column prop="senserReset" label="senserReset" align="center"/>
      <el-table-column prop="clampOnOff" label="clampOnOff" align="center"/>
      <el-table-column prop="sid" label="SID" align="center"/>
      <el-table-column prop="vcmHall" label="vcmHall" align="center"/>
      <el-table-column prop="vcmInit" label="vcmInit" align="center"/>
      <el-table-column prop="vcmHall2" label="vcmHall2" align="center"/>
      <el-table-column prop="vcmPowerOff" label="vcmPowerOff" align="center"/>
      <el-table-column prop="vcmPowerOn" label="vcmPowerOn" align="center"/>
      <el-table-column prop="vcmTop" label="vcmTop" align="center"/>
      <el-table-column prop="vcmTopHall" label="vcmTopHall" align="center"/>
      <el-table-column prop="vcmZ" label="VCM Z轴" align="center"/>
      <el-table-column prop="vcmZHAll" label="VCM Z霍尔" align="center"/>
      <el-table-column prop="vcmOisInit" label="VCM OIS初始化" align="center"/>
      <el-table-column prop="chartAlignment1" label="图表对齐1" align="center"/>
      <el-table-column prop="AA1" label="AA1" align="center"/>
      <el-table-column prop="AA2" label="AA2" align="center"/>
      <el-table-column prop="mtfCheck" label="MTF检查" align="center"/>
      <el-table-column prop="AA3" label="AA3" align="center"/>
      <el-table-column prop="mtfCheck2" label="MTF检查2" align="center"/>
      <el-table-column prop="lpOn" label="LP开启" align="center"/>
      <el-table-column prop="lpOcCheck" label="LP OC检查" align="center"/>
      <el-table-column prop="lpOc" label="LP OC" align="center"/>
      <el-table-column prop="lpOnBlemish" label="LP开启瑕疵检查" align="center"/>
      <el-table-column prop="blemish" label="瑕疵" align="center"/>
      <el-table-column prop="lpOff" label="LP关闭" align="center"/>
      <el-table-column prop="chartAlignment" label="图表对齐" align="center"/>
      <el-table-column prop="vcmMoveToZ" label="VCM移动到Z" align="center"/>
      <el-table-column prop="delay" label="延迟" align="center"/>
      <el-table-column prop="vcmPowerOffCheck" label="VCM断电检查" align="center"/>
      <el-table-column prop="recordPosition" label="记录位置" align="center"/>
      <el-table-column prop="dispense" label="分配" align="center"/>
      <el-table-column prop="epoxyInspectionAuto" label="环氧检查自动" align="center"/>
      <el-table-column prop="epoxyInspection" label="环氧检查" align="center"/>
      <el-table-column prop="backToPosition" label="返回位置" align="center"/>
      <el-table-column prop="uvOn" label="UV开启" align="center"/>
      <el-table-column prop="yLevel" label="Y级别" align="center"/>
      <el-table-column prop="uvOff" label="UV关闭" align="center"/>
      <el-table-column prop="gripperOpen" label="夹具打开" align="center"/>
      <el-table-column prop="saveOc" label="保存OC" align="center"/>
      <el-table-column prop="saveMtf" label="保存MTF" align="center"/>
      <el-table-column prop="destroy" label="销毁" align="center"/>
      <el-table-column prop="moveToBlemishPos" label="移动到瑕疵位置" align="center"/>
      <el-table-column prop="mtfCheck3" label="MTF检查3" align="center"/>
      <el-table-column prop="mtfOffAxisCheck1" label="MTF离轴检查1" align="center"/>
      <!-- Continuing from the previous response -->
      <el-table-column prop="mtfOffAxisCheck2" label="MTF Off-Axis Check 2" align="center"/>
      <el-table-column prop="mtfOffAxisCheck3" label="MTf Off-Axis Check 3" align="center"/>
      <el-table-column prop="lpBlemish" label="LP Blemish" align="center"/>
      <el-table-column prop="chartAlignment2" label="Chart Alignment 2" align="center"/>
      <el-table-column prop="vcmMoveToZPos" label="VCM Move to Z Position" align="center"/>
      <el-table-column prop="zOffset" label="Z Offset" align="center"/>

      <el-table-column prop="roiCc" label="ROI Center-Center" align="center"/>
      <el-table-column prop="roiUl" label="ROI Upper-Left" align="center"/>
      <el-table-column prop="roiUr" label="ROI Upper-Right" align="center"/>
      <el-table-column prop="roiLl" label="ROI Lower-Left" align="center"/>
      <el-table-column prop="roiLr" label="ROI Lower-Right" align="center"/>

      <el-table-column prop="openCheck" label="Open Check" align="center"/>
      <!-- Resolution and inspection interval -->
      <el-table-column prop="xResMin" label="X Resolution Min" align="center"/>
      <el-table-column prop="xResMax" label="X Resolution Max" align="center"/>
      <el-table-column prop="yResMin" label="Y Resolution Min" align="center"/>
      <el-table-column prop="yResMax" label="Y Resolution Max" align="center"/>
      <el-table-column prop="epoxyInspectionInterval" label="Epoxy Inspection Interval" align="center"/>
      <!-- Result check range -->
      <el-table-column prop="resultCheckMin" label="Result Check Min" align="center"/>
      <el-table-column prop="resultCheckMax" label="Result Check Max" align="center"/>
      <el-table-column prop="option" label="操作" align="center" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <div class="box-ops">
            <el-button size="mini" type="text" class="btn-ops" @click="handleAddAndUpdateFixture(scope.row, 3)" >编辑</el-button>
          </div>
          <div class="box-ops">
            <el-button size="mini" type="text" class="btn-ops" @click="handleDelete(scope.row, 1)">删除</el-button>
            <el-button size="mini" type="text" class="btn-ops" @click="handleAddAndUpdateFixture(scope.row, 4)" >用参</el-button>
          </div>
        </template>
      </el-table-column>
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
import { getParamsStdModels } from '@/api/biz/aa/params'

export default {
  name: 'index.vue',

  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备比对结果表格数据
      resultList: [],
      // 弹出层标题
      title: '',
      // 刷新标识
      refreshKey: 0,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqCode: undefined,
        mcId: undefined,
        prodType: undefined,
        simId: undefined,
        statusCode: undefined,
        dtRange: []
      },
      // 表单参数
      form: {},
      // 日期范围
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime()
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime()
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime()
          }
        }]
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
        this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
        this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
        getParamsStdModels(this.queryParams).then(response => {
          this.resultList = response.rows
          this.total = response.total
          this.loading = false
        })
      }
    },

    dataChange() {
      this.getList()
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
    }

  },

  created() {
    this.getList()
  }
}
</script>

<style scoped>

</style>
