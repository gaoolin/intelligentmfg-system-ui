<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机种" prop="prodType">
        <el-input
          v-model="queryParams.prodType"
          placeholder="请输入机种"
          clearable
          @keyup.native="handleQuery"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="治具分类" prop="fixtureCategory">
        <el-select v-model="queryParams.fixtureCategory" placeholder="请输入治具分类" clearable>
          <el-option
            v-for="dict in dict.type.biz_fixture_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="料号" prop="materialId">
        <el-input
          v-model="queryParams.materialId"
          placeholder="请输入料号"
          clearable
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['biz/fixture/manage:pogopin:add']"
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
          v-hasPermi="['biz/fixture/manage:pogopin:edit']"
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
          v-hasPermi="['biz/fixture/manage:pogopin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['biz/fixture/manage:pogopin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-alert
      title="注意：查到共用信息后须与治具设计核对后方可使用，确保信息的准确性！"
      type="warning"
      show-icon
      style="font-weight: bolder"
    >
    </el-alert>

    <el-table
      v-loading="loading"
      :data="pogopinList"
      :cell-style="{padding:'0px'}"
      :row-style="{height:'50px'}"
      fit
      :header-cell-style="{color: '#848484', fontSize: '5px', backgroundColor: '#qua'}"
      @selection-change="handleSelectionChange"
      style="font-size: 10px"
      border>
      <el-table-column type="selection" width="40" align="center" fixed />
      <el-table-column label="机种" align="center" min-width="90" prop="prodType" fixed />
      <el-table-column label="治具类别" align="center" prop="fixtureCategory" fixed>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.biz_fixture_category" :value="scope.row.fixtureCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="连接器朝向" align="center" prop="buckle" fixed>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.fixture_buckle_status" :value="scope.row.buckle"/>
        </template>
      </el-table-column>
      <el-table-column label="品名" align="center" min-width="180" prop="fixtureName" fixed />
      <el-table-column label="治具版本" align="center" prop="fixtureVersion" />
      <el-table-column label="料号" align="center" prop="materialId" />
      <el-table-column label="共享机型" align="center" prop="sharedProdType" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" width="140" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" width="140" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="120" prop="remark" />
      <el-table-column label="操作" align="center" min-width="80" class-name="small-padding fixed-width" style="font-size: 8px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['biz/fixture/manage:pogopin:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['biz/fixture/manage:pogopin:remove']"
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

    <!-- 添加或修改pogopin治具对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机种" prop="prodType">
          <el-input v-model="form.prodType" placeholder="请输入机种" />
        </el-form-item>
        <el-form-item label="治具类别" prop="fixtureCategory">
          <el-select v-model="form.fixtureCategory" placeholder="请选择治具类别" clearable style="width: 240px">
            <el-option
              v-for="dict in dict.type.biz_fixture_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="连接器朝向" prop="buckle">
          <el-select v-model="form.buckle" placeholder="请选择连接器朝向" clearable style="width: 240px">
            <el-option
              v-for="dict in dict.type.fixture_buckle_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品名" prop="fixtureName">
          <el-input v-model="form.fixtureName" placeholder="请输入品名" />
        </el-form-item>
        <el-form-item label="治具版本" prop="fixtureVersion">
          <el-input v-model="form.fixtureVersion" placeholder="请输入治具版本" />
        </el-form-item>
        <el-form-item label="料号" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请输入料号" />
        </el-form-item>
        <el-form-item label="共享机型" prop="sharedProdType">
          <el-input v-model="form.sharedProdType" placeholder="请输入共享机型" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPogopin, getPogopin, delPogopin, addPogopin, updatePogopin } from "@/api/biz/fixture/manage/pogopin";

export default {
  name: "Pogopin",
  dicts: ['biz_fixture_category', 'fixture_buckle_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      prodTypes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // pogopin治具表格数据
      pogopinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prodType: null,
        fixtureCategory: null,
        materialId: null,
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
    /** 查询pogopin治具列表 */
    getList() {
      this.loading = true;
      listPogopin(this.queryParams).then(response => {
        this.pogopinList = response.rows;
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
        id: null,
        prodType: null,
        fixtureCategory: null,
        buckle: null,
        fixtureName: null,
        fixtureVersion: null,
        materialId: null,
        sharedProdType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isDelete: null,
        remark: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.prodTypes = selection.map(item => item.prodType)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加pogopin治具";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPogopin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改pogopin治具";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePogopin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPogopin(this.form).then(response => {
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
      const ids = row.id || this.ids;
      const prodTypes = row.prodType || this.prodTypes
      this.$modal.confirm('是否确认删除pogopin治具编号为"' + prodTypes + '"的数据项？').then(function() {
        return delPogopin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('biz/fixture/manage/pogopin/export', {
        ...this.queryParams
      }, `pogopin_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
