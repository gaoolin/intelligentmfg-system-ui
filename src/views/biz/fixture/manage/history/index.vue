<template>
<div class="app-container">
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="机种" prop="prodType">
      <el-input
        v-model="queryParams.prodType"
        placeholder="请输入机种"
        clearable
        @keyup.enter.native="handleQuery"
      />
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
      <el-button type="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-table
    v-loading="loading"
    :data="historyList"
    @selection-change="handleSelectionChange"
    :cell-style="{padding:'0px'}"
    :row-style="{height:'50px'}"
    fit
    :header-cell-style="{color: '#848484', fontSize: '5px', backgroundColor: '#qua'}"
    style="font-size: 10px"
    border
  >
    <el-table-column type="index" label="序号" width="55" align="center" fixed />
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
    <el-table-column label="备注" align="center" prop="remark" />
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
import { listHistory, getHistory, delHistory, addHistory, updateHistory } from "@/api/biz/fixture/manage/history";
export default {
  name: 'History',
  dicts: ['biz_fixture_category'],
  data() {
    return {
      loading: true,
      ids: [],
      prodTypes: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      historyList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prodType: null,
        materialId: null,
      },
      form: {},
      rules: {}
    };
  },

  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then(res => {
        console.log(">>>>" + res.rows)
        this.historyList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },

    cancel() {
      this.open = false;
      this.reset();
    },

    reset() {
      this.form = {
        id: null,
        prodType: null,
        fixtureCategory: null,
        fixtureName: null,
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
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.prodTypes = selection.map(item => item.prodType)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加pogopin治具历史"
    },
    handleUpdate(row) {
      this.reset();
      const id = id.id || this.ids
      getHistory(id).then(res => {
        this.form = res.data;
        this.open = true;
        this.titile = "修改pogopin治具历史";
      });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHistory(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      const prodTypes = row.prodType || this.prodTypes
      this.$modal.confirm('是否确认删除pogopin治具编号为"' + prodTypes + '"的数据项？').then(function() {
        return delHistory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleExport() {
      this.download('biz/fixture/mange/history/export', {
        ...this.queryParams
      }, `pogopin_history_${new Date().getTime}.xlsx`)
    }
  }
};
</script>

<style scoped>

</style>
