<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机型" prop="partSpec">
        <el-input
          v-model="queryParams.partSpec"
          placeholder="请输入机型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="厂" prop="factoryName">
        <el-input
          v-model="queryParams.factoryName"
          placeholder="请输入厂"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="占比" prop="percents">
        <el-select v-model="queryParams.percents" placeholder="请选择占比" clearable>
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['biz:monitor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['biz:monitor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['biz:monitor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['biz:monitor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wireList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机型" align="center" prop="partSpec" />
      <el-table-column label="厂" align="center" prop="factoryName" />
      <el-table-column label="区" align="center" prop="workshop" />
      <el-table-column label="实际用量" align="center" prop="actualUsagePerPcs" />
      <el-table-column label="标准用量" align="center" prop="standardUsagePerPcs" />
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
            v-hasPermi="['biz:monitor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['biz:monitor:remove']"
          >删除</el-button>
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

    <!-- 添加或修改金线用量对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWire, getWire, delWire, addWire, updateWire } from "@/api/biz/monitor/wire";

export default {
  name: "Wire",
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
      // 金线用量表格数据
      wireList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期时间范围
      daterangeFiscalDate: [],
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
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询金线用量列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeFiscalDate && '' != this.daterangeFiscalDate) {
        this.queryParams.params["beginFiscalDate"] = this.daterangeFiscalDate[0];
        this.queryParams.params["endFiscalDate"] = this.daterangeFiscalDate[1];
      }
      listWire(this.queryParams).then(response => {
        this.wireList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeFiscalDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.partSpec)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加金线用量";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const partSpec = row.partSpec || this.ids
      getWire(partSpec).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改金线用量";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.partSpec != null) {
            updateWire(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWire(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const partSpecs = row.partSpec || this.ids;
      this.$modal.confirm('是否确认删除金线用量编号为"' + partSpecs + '"的数据项？').then(function() {
        return delWire(partSpecs);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/monitor/export', {
        ...this.queryParams
      }, `wire_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
