<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <div>
          <el-form-item label="厂" prop="factoryName">
            <el-select
              v-model="queryParams.factoryName"
              placeholder="请输入厂"
              filterable
              clearable
              @change="changeOneSelection($event, factoryOptions, queryParams.factoryName)"
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
          <el-form-item label="区" prop="workshop">
            <el-select
              v-model="queryParams.workshop"
              filterable
              clearable
              placeholder="请输入区"
              :loading="loading"
              @focus="getWorkshopList"
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
          <el-form-item label="机型" prop="partSpec">
            <el-input
              v-model="queryParams.partSpec"
              placeholder="请输入机型"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 180px">
              <el-option
                v-for="dict in dict.type.wire_diff_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="daterangeFiscalDate"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card style="margin-top: 15px">
      <el-table v-loading="loading" :data="workshopList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="机型" align="center" prop="partSpec"/>
        <el-table-column label="厂" align="center" prop="factoryName"/>
        <el-table-column label="区" align="center" prop="workshop"/>
        <el-table-column label="实际用量" align="center" prop="actualUsagePerPcs"/>
        <el-table-column label="标准用量" align="center" prop="standardUsagePerPcs"/>
        <el-table-column label="占比" align="center" prop="percents">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wire_diff_status" :value="scope.row.percents"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['biz/monitor:workshop:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['biz/monitor:workshop:remove']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
import { listWorkshop, getWorkshop, delWorkshop, addWorkshop, updateWorkshop } from '@/api/biz/monitor/workshop'

export default {
  name: 'Workshop',
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
      // 金线监控表格数据
      workshopList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期时间范围
      daterangeFiscalDate: [this.DateToStr(new Date(new Date().valueOf() - 1 * 1440 * 60 * 1000)).substring(0,10),
        this.DateToStr(new Date(new Date().valueOf() - 1 * 1440 * 60 * 1000)).substring(0,10)],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partSpec: null,
        factoryName: null,
        workshop: null,
        percents: null,
        fiscalDate: null
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.getList();
    this.getFactoryList();
  },
  methods: {
    /** 查询金线监控列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeFiscalDate && '' !== this.daterangeFiscalDate) {
        this.queryParams.params['beginFiscalDate'] = this.daterangeFiscalDate[0]
        this.queryParams.params['endFiscalDate'] = this.daterangeFiscalDate[1]
      }
      listWorkshop(this.queryParams).then(response => {
        this.workshopList = response.rows
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
        partSpec: null,
        factoryName: null,
        workshop: null,
        actualUsagePerPcs: null,
        standardUsagePerPcs: null,
        percents: null,
        fiscalDate: null
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
      this.daterangeFiscalDate = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.partSpec)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加金线监控'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const partSpec = row.partSpec || this.ids
      getWorkshop(partSpec).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改金线监控'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.partSpec != null) {
            updateWorkshop(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addWorkshop(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const partSpecs = row.partSpec || this.ids
      this.$modal.confirm('是否确认删除金线监控编号为"' + partSpecs + '"的数据项？').then(function() {
        return delWorkshop(partSpecs)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/monitor/workshop/export', {
        ...this.queryParams
      }, `workshop_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
