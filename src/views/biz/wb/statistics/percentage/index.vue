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
          @change="handleQuery"
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
          placeholder="请输入车间"
          clearable/>
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
      :cell-style="bodyCellStyle"
      :header-cell-style="headerCellStyle"
      :style="tableStyle()"
      class="table-hover"
    >
      <el-table-column prop="companyName" label="厂区" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="groupName" label="车间" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="eqId" label="设备编号" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="mcId" label="机台号" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="prodType" label="机种" align="center" min-width="160" fit></el-table-column>
      <el-table-column prop="computeCnt" label="比对次数" align="center" min-width="120" fit></el-table-column>
      <el-table-column prop="okCnt" label="正确次数" align="center" min-width="120" fit>
        <template slot-scope="scope">
          <router-link :to="{ path: '/biz/wb/statistics/particulars', query: {
            dtRange: queryParams.dtRange,
            companyName: scope.row.companyName,
            groupName: scope.row.groupName,
            eqId: scope.row.eqId,
            prodType: scope.row.prodType,
            flag: 'ok'} }">
            <span>{{ scope.row.okCnt | numberToCurrency }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="errCnt" label="错误次数" align="center" min-width="120" fit>
        <template scope="scope">
          <router-link :to="{ path: '/biz/wb/statistics/particulars', query: {
              dtRange: queryParams.dtRange,
              companyName: scope.row.companyName === '总计' ? '' : scope.row.companyName,
              groupName: scope.row.groupName === '小计' ? '' : scope.row.groupName,
              eqId: scope.row.eqId,
              prodType: scope.row.prodType,
              flag: 'err'}}">
            <span>{{ scope.row.errCnt > 0 ? (scope.row.errCnt | numberToCurrency) : '-' }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="errRatio" label="错误率" align="center" min-width="120" fit>
        <template scope="scope">
            <span>{{ toPercent(getBit(scope.row.errRatio, 6), 2) }}</span>
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
import '@/views/biz/common/css/qtech-css.css'
import { pickerOptionsSet1 } from '@/views/biz/common/js/pickerOptionsConfig'
import { headerCellStyle, bodyCellStyle, tableStyle } from '@/views/biz/common/js/tableStyles';
import { getBit, toPercent, checkDtRange, arraySpanMethod, mergeAction, rowMergeHandle, colMergeCheck } from '@/views/biz/common/js/utils';
import { listComparisonRatio } from '@/api/biz/wb/percentage'
import { getFactoryNames, getGroupNames } from '@/api/biz/wb/index'

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
      pickerOptions: pickerOptionsSet1,
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
            validator: checkDtRange, trigger: 'blur'
          }]
      },
    }
  },

  methods: {
    headerCellStyle,
    bodyCellStyle,
    tableStyle,
    toPercent,
    getBit,
    checkDtRange,
    getList() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          this.queryParams.params = {}
          if (null != this.queryParams.dtRange && '' !== this.queryParams.dtRange) {
            this.queryParams.params['beginDate'] = this.queryParams.dtRange[0]
            this.queryParams.params['endDate'] = this.queryParams.dtRange[1]
            listComparisonRatio(this.queryParams).then(response => {
              this.tableData = response.rows
              this.total = response.total;
              this.rowMergeArrs = rowMergeHandle(this.needMergeArr, response.rows)
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
    restQuery() {
      if (this.$route.query.dtRange === undefined || this.$route.query.dtRange === null || this.$route.query.dtRange === '') {
        this.resetForm("queryForm");
      } else {
        this.reset();
      }
      this.handleQuery();
    },
    /** 重置查询参数（resetForm是重置为初始值，此处重置为空值） */
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        groupName: null,
        dtRange: [this.$dateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.$dateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))],
        prodType: null,
        flag: null,
      }
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

    /** 导出 */
    handleExport() {
      this.download('wb/percentage/export', {
        ...this.queryParams
      }, `打线图机台比对正确率_${new Date().getTime()}.xlsx`)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },

  created() {
    // 日期区间回显
    if (this.$route.query.dtRange === undefined || this.$route.query.dtRange === null || this.$route.query.dtRange === '') {
      // this.$set(this.queryParams, 'dtRange', [this.$dateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.$dateToStr(new Date(new Date().valueOf()))]);
      this.$set(this.queryParams, 'dtRange', [this.$dateToStr(new Date(new Date().setHours(0, 0, 0).valueOf())), this.$dateToStr(new Date(new Date().setHours(23, 59, 59).valueOf()))])
    } else {
      this.queryParams.dtRange = this.$route.query.dtRange
      this.queryParams.companyName = this.$route.query.companyName
      this.queryParams.groupName = this.$route.query.groupName
      this.queryParams.flag = this.$route.query.flag
    }

  },

  mounted() {
    this.getList();
    // overview.methods.getFactoryNames()
    this.getFactoryNames();
    this.rowMergeArrs = rowMergeHandle(this.needMergeArr, this.tableData);
  },

  computed: {
    arraySpanMethod() {
      return (params) => {
        return arraySpanMethod(params, this.needMergeArr, (val, rowIndex, colData) => {
          return mergeAction(val, rowIndex, colData, this.rowMergeArrs);
        });
      };
    }
  },

  watch: {
    tableData: {
      deep: true,
      handler() {
        this.rowMergeArrs = rowMergeHandle(this.needMergeArr, this.tableData);
      }
    }
  },

}
</script>

<style scoped>
</style>
