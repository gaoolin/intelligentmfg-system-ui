<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="料号" prop="materialId">
      <el-input
        v-model="queryParams.materialId"
        placeholder="请输入料号"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="机种" prop="prodType">
      <el-input
        v-model="queryParams.prodType"
        placeholder="请输入机种"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="治具类型" prop="fixtureCategory">
      <el-select
        v-model="queryParams.fixtureCategory"
        style="width: 280px"
        placeholder="请输入治具类型"
        clearable
        @keyup.enter.native="handleQuery"
        @change="changeOneSelection($event, categoryOptions, queryParams.fixtureCategory)">
        <el-option
          v-for="item in categoryOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label=" " prop="deptId">
      <el-radio-group
        style="width: 100px"
        v-model="queryParams.deptId"
        v-for="item in dictProjectObject"
        clearable
        @keyup.enter.native="handleQuery"
        @change="changeOneSelection($event, dictProjectObject, queryParams.deptId)">
        <el-radio :label="item.dictValue">{{ item.dictLabel }}</el-radio>
      </el-radio-group>
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
          @click="handleAddAndUpdate(1, null)"
          v-hasPermi="['biz/fixture:manage:add']"
        >新增料号</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['biz/fixture:manage:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          @click="handleFixtureCategoryManage">
          <span>管理治具类型</span>
          </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-alert
      title="注意：为确保信息的准确,查到共用信息后须与治具设计核对后方可使用！"
      type="warning"
      show-icon
      style="font-weight: bolder"
    >
    </el-alert>

    <el-table
      v-loading="loading"
      :data="dataList"
      fit
      @selection-change="handleSelectionChange"
      :span-method="arraySpanMethod"
      class="tableArea"
      style="font-size: 14px;"
      cell-mouse-enter
      cell-mouse-leave
      cell-class-name
      :cell-style="changeCellStyle"
      border>
      <el-table-column label="料号" align="center" min-width="50" prop="materialId" fixed/>
      <el-table-column label="品名" align="center" min-width="60" prop="fixtureName" show-overflow-tooltip fixed />
      <el-table-column label="规格" align="center" min-width="120" prop="fixtureSpec" fixed show-overflow-tooltip/>
      <el-table-column label="机种" align="center" min-width="50" prop="prodType" fixed />
      <el-table-column label="治具类型" align="center" min-width="50" prop="fixtureCategory" show-overflow-tooltip fixed >
        <template slot-scope="scope">{{scope.row.fixtureCategory}}</template>
      </el-table-column>
      <el-table-column label="治具版本" align="center" min-width="35" prop="fixtureVersion" fixed />
      <el-table-column label="连接器朝向" align="center" min-width="35" prop="buckle" fixed>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.fixture_buckle_status" :value="scope.row.buckle" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" min-width="35" prop="createBy" />
      <el-table-column label="创建时间" align="center" width="155" prop="createTime" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" min-width="35" prop="updateBy" />
      <el-table-column label="更新时间" align="center" width="155" prop="updateTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="50" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="35" class-name="small-padding fixed-width" style="font-size: 8px" >
        <template slot-scope="scope">
          <div>
            <el-button
              size="mini"
              type="text"
              @click="handleAddAndUpdate(2, scope.row)"
              v-hasPermi="['biz/fixture:manage:add']"
            >新增共享机型</el-button>
          </div>
          <div>
            <el-button
              size="mini"
              type="text"
              @click="handleAddAndUpdate(3, scope.row)"
              v-hasPermi="['biz/fixture:manage:edit']"
            >修改</el-button>
            <el-popover
              style="margin-left: 5px"
              placement="top"
              width="160"
              content="请选择要删除的内容">
              <p>请选择要删除的内容！</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="handleDelete(scope.row, 1)">料号</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(scope.row, 2)">机型</el-button>
              </div>
              <el-button slot="reference" size="mini" type="text">删除</el-button>
            </el-popover>
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

    <!-- 添加治具对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="500px" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="(materialIdDisabled === false && othersDisabled === false) ? rulesAddAll : ((materialIdDisabled === true && othersDisabled === true) ? rulesAddShared : rulesUpdate)"
        label-width="85px" >
        <el-form-item label="料号" prop="materialId" >
          <el-input
            v-model="form.materialId"
            type="text"
            autocomplete="off"
            :disabled="materialIdDisabled"
            placeholder="请输入料号">
          </el-input>
        </el-form-item>
        <el-form-item label="品名" prop="fixtureName">
          <el-input v-model="form.fixtureName" placeholder="请输入品名" :disabled="othersDisabled "/>
        </el-form-item>
        <el-form-item label="规格" prop="fixtureSpec">
          <el-input v-model="form.fixtureSpec" placeholder="请输入规格"  type="textarea" :disabled="othersDisabled" />
        </el-form-item>
        <el-form-item label="治具版本" prop="fixtureVersion" >
          <el-input v-model="form.fixtureVersion" placeholder="请输入治具版本" :disabled="othersDisabled"/>
        </el-form-item>
        <el-form-item label="连接器朝向" prop="buckle">
          <el-radio-group v-model="form.buckle" :disabled="othersDisabled">
            <el-radio
              v-for="dict in dict.type.fixture_buckle_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="治具类型" prop="fixtureCategory">
          <!-- 请求返回的form.fixtureCategory是 int 类型，字典的key是string类型，需要把int转成string，否则输入框不能自动转换成value/label -->
          <el-select v-model="form.fixtureCategory" placeholder="请选择治具类型" clearable style="width: 240px" :disabled="othersDisabled">
            <el-option
              v-for="item in categoryOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机种" prop="prodType">
          <el-input v-model="form.prodType" placeholder="请输入机种" :disabled="prodTypeDisabled"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加治具类型对话框 -->
    <el-dialog :title="title" :visible.sync="addCategoryOpen" width="800px" append-to-body>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="新增治具类型" name="first">
          <el-form ref="form" :model="form" label-width="155px">
            <el-form-item label="治具类型名称" prop="fixtureCategory" >
              <el-input v-model="form.fixtureCategory" @change="fixtureCategoryChange" placeholder="请输入治具类型名称" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改治具类型" name="second">
          <el-table
            v-if="activeName === 'second'"
            v-loading="loading"
            :data="fixtureCategoryList"
            fit
            class="tableArea"
            style="font-size: 14px;"
            cell-mouse-enter
            cell-mouse-leave
            cell-class-name
            border>
            <el-table-column label="序号" type="index" min-width="15" align="center" fixed />
            <el-table-column label="治具类型" align="center" min-width="50" prop="fixtureCategory" fixed >
              <template slot-scope="scope">
                <el-input v-model="scope.row.fixtureCategory" v-if="scope.row.seen"></el-input>
                <span style="margin-left: 10px" v-else>{{ scope.row.fixtureCategory }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="15" class-name="small-padding fixed-width" style="font-size: 8px" >
              <template slot-scope="{row, $index}">
                <el-button size="mini" type="text" @click="handleFixtureCategoryEdit(row, $index)">{{row.compile}}</el-button>
                <el-button type="text" size="mini" @click="handleFixtureCategoryRemove(row, $index)">{{row.isDelete}}</el-button>
                <el-button type="text" size="mini" @click="tabCancel(row, $index)" v-if="row.cancel">{{"取消"}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addFixture,
  delFixture,
  getFixture,
  listFixture,
  updateFixture,
  fixtureCategoryList,
  addFixtureCategory,
  updateFixtureCategory,
  deleteFixtureCategory,
  getDeptIds,
  getFixtureMaterialIds,
  materialIdRules
} from '@/api/biz/fixture/fixture'

export default {
  name: 'fixture',
  dicts: ['biz_fixture_category', 'fixture_buckle_status', 'biz_fixture_project'],

  data() {
    return {
      deleteDialogVisible: true,
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      addOpen: false,
      addCategoryOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: null,
        prodType: null,
        fixtureCategory: null,
        deptId: null
      },
      deptIds: [],
      dictProjectObject: [],
      // 表单参数
      form: {
        materialId: "",
      },
      // 表单校验
      rulesAddAll: {
        materialId: [
          { required: true, message: "请输入需要新增的料号", trigger: "blur"},
          { min: 8, max: 20, message: "长度在 8 到 20 个字符", trigger: "blur"},
          { validator: this.materialIdRules, trigger: "blur" },],
        fixtureCategory: [
          {required: true, message: "请输入治具类型", trigger: "change"},
          { validator: this.fixtureCategoryRules, trigger: "change" },],
        prodType: [
          {required: true, message: "请输入机种名称", trigger: "blur"},
          { validator: this.prodTypeRules, trigger: "blur" },
        ]},
      rulesAddShared: {
        prodType: [
          {required: true, message: "请输入机种名称", trigger: "blur"},
          { validator: this.prodTypeRules, trigger: "blur" },
        ],
      },
      rulesUpdate: {
        fixtureCategory: [
          {required: true, message: "请输入治具类型", trigger: "change"},
          { validator: this.fixtureCategoryRules, trigger: "change" },],
        prodType: [
          {required: true, message: "请输入机种名称", trigger: "blur"},
          { validator: this.prodTypeRules, trigger: "blur" },
        ]
      },
      // 治具类型选择器
      categoryOptions: [],
      // 治具表格数据
      dataList: [],
      // 修改时，治具类型是否可修改
      materialIdDisabled: false,
      prodTypeDisabled: false,
      othersDisabled: false,
      fixtureCategoryList: [],
      activeName: "first",
      state: '',
      timeout:  null,
      arr1: [],
      arr2: [],
      arr3: [],
      arr4: [],
      arr5: [],
      arr6: [],
      position1: 0,
      position2: 0,
      position3: 0,
      position4: 0,
      position5: 0,
      position6: 0,
      // 需要合并项的列
      needMergeArr: [
        {
          colName: "materialId",
          mergeCheckNames: ["materialId"],
        },
        {
          colName: "fixtureName",
          mergeCheckNames: ["materialId", "fixtureName"],
        },
        {
          colName: "fixtureSpec",
          mergeCheckNames: ["materialId", "fixtureName", "fixtureSpec"],
        },
        {
          colName: "fixtureCategory",
          mergeCheckNames: ["materialId", "fixtureName", "fixtureSpec", "fixtureCategory"],
        },
        {
          colName: "fixtureVersion",
          mergeCheckNames: ["materialId", "fixtureName", "fixtureSpec", "fixtureCategory", "fixtureVersion"],
        },
        {
          colName: "prodType",
          mergeCheckNames: ["materialId", "fixtureName", "fixtureSpec", "prodType", "fixtureCategory", "prodType"],
        },
      ],
      rowMergeArrs: {}, // 包含需要一个或多个合并项信息的对象
    };
  },

  methods: {
    /** 查询治具列表 */
    getList() {
      this.loading = true;
      listFixture(this.queryParams).then(response => {
        response.rows.forEach(row => {
          if (row['buckle'] != null && row['buckle'] !== '') {
            row['buckle'] = row['buckle'].toString();
          }
          row['deptId'] = row['deptId'].toString();
        })
        this.dataList = response.rows;
        this.total = response.total;

        this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, response.rows);

        this.loading = false;
        this.getFixtureCategoryList(); // 首页治具类型下拉框数据
      });
    },
    getDeptIds() {
      getDeptIds().then(response => {
        this.deptIds = response.data
        this.getDict();
      })
    },
    getDict() {
      this.dictProjectObject = [];
      this.getDicts("biz_fixture_project").then(response => {
        response.data.forEach(item => {
          if (this.deptIds.indexOf(item["dictValue"]) !== -1) {
            const o = {}
            o.dictValue = item["dictValue"];
            o.dictLabel = item["dictLabel"];
            this.dictProjectObject.push(o);
          }
        })
        if (this.dictProjectObject[0] !== undefined) {
          this.queryParams.deptId = this.dictProjectObject[0].dictValue
          this.getList();
        }
      })
    },
    /** 判断数据是否隔离 */
    isDeptIdAll() {
      if (this.queryParams.deptId === '207' || this.queryParams.deptId === '208' || this.queryParams.deptId === null) {
        this.$modal.msgWarning("查询或变更治具信息时，须指定具体类别！")
        return false;
      } else {
        this.form.deptId = this.queryParams.deptId;
        return true;
      }
    },

    // 取消按钮
    cancel() {
      if (this.addOpen === true) {
        this.addOpen = false;
      } else if (this.addCategoryOpen === true) {
        this.addCategoryOpen = false;
      }
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        mId: null,
        cId: null,
        pId: null,
        prodType: null,
        fixtureCategory: null,
        buckle: null,
        fixtureName: null,
        fixtureVersion: null,
        materialId: null,
        fixtureSpec: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deptId: null,
        remark: null,
        submitFlag: null,
      };
      this.resetForm("form");
    },
    /** 重置合并单元格信息 */
    resetSpan() {
      this.arr1 = [];
      this.arr2 = [];
      this.arr3 = [];
      this.arr4 = [];
      this.arr5 = [];
      this.arr6 = [];
      this.position1 = 0;
      this.position2 = 0;
      this.position3 = 0;
      this.position4 = 0;
      this.position5 = 0;
      this.position6 = 0;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.isDeptIdAll()) {
        this.queryParams.pageNum = 1;
        this.getList();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.isDeptIdAll()) {
        this.resetForm("queryForm");
        this.handleQuery();
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddAndUpdate(flag, row) {
      if (this.isDeptIdAll()) {
        if (flag === 1) { // 添加治具
          this.reset();
          this.addOpen = true;
          this.title = "添加料号";
          this.materialIdDisabled = false;
          this.prodTypeDisabled = false;
          this.othersDisabled = false;
          this.form.submitFlag = 1;
        } else if (flag === 2) { // 添加共享机型
          this.reset();
          this.addOpen = true;
          this.title = "添加共享机型";
          this.materialIdDisabled = true;
          this.prodTypeDisabled = false;
          this.othersDisabled = true;
          this.form.materialId = row.materialId;
          this.form.fixtureName = row.fixtureName;
          this.form.fixtureSpec = row.fixtureSpec;
          this.form.fixtureCategory = row.fixtureCategory;
          this.form.fixtureVersion = row.fixtureVersion;
          this.form.buckle = row.buckle;
          this.form.cId = row.cId;
          this.form.submitFlag = 1;
        } else if (flag === 3) {
          this.reset();
          getFixture(row.id).then(response => {
            if (response.data != null) {
              // int 类型转换成 string，以便通过字典呈现
              if (row['buckle'] != null && row['buckle'] !== '') {
                response.data['buckle'] =  response.data['buckle'].toString();
              }
              this.form = response.data;
              this.addOpen = true;
              this.title = "修改治具信息";
              this.materialIdDisabled = true;
              this.prodTypeDisabled = false;
              this.othersDisabled = false;
              this.form.submitFlag = 2;
            }
          });
        }
      }
    },

    /** 提交按钮 */
    submitForm() {
      // this.reset(); // 会丢失编辑信息
      if (this.isDeptIdAll()) {
        if (this.form.submitFlag === 1) { //新增料号
          this.$refs["form"].validate(valid => {
            if (valid) {
              addFixture(this.form).then(() => {
              this.$modal.msgSuccess("新增成功");
              this.addOpen = false;
              this.getList();
              });
            }})
        } else if (this.form.submitFlag === 2) { // 新增机型 修改治具信息
          this.$refs["form"].validate(valid => {
            if (valid) {
              updateFixture(this.form).then(() => {
                this.$modal.msgSuccess("修改成功");
                this.addOpen = false;
                this.getList();
              });
            }
          })
        }
      if (this.form.submitFlag === 3) { //
            if (this.form.fixtureCategory !== null || this.form.fixtureCategory !== '') {
              addFixtureCategory(this.form).then(() => {
                this.$modal.msgSuccess("新增治具类型成功");
                this.addCategoryOpen = false;
                this.getFixtureCategoryList();
              })}}
      else if (this.form.submitFlag === null) {this.addOpen = false; this.addCategoryOpen = false;}
      }},
    /** 删除按钮操作 */
    handleDelete(row, flag) {
      if (this.isDeptIdAll()) {
        if (flag === 1) {
          this.$modal.confirm("是否删除治具料号为 " + row.materialId + '“的数据项？').then(response => {
            const label = '' + row.mId + '-' + row.pId + '-' + 0 + '-' + this.form.deptId;
            return delFixture(label).then(() => {
              this.$modal.msgSuccess("删除成功");
              this.getList();
              this.reset();
            }).catch(() => {});
          })
        } else if (flag === 2) {
          this.$modal.confirm('是否确认删除治具编号为"' + row.prodType + '"的数据项？').then(response => {
            const label = '' + row.mId + '-' + row.pId + '-' + 1 + '-' + this.form.deptId;
            return delFixture(label).then(() => {
              this.$modal.msgSuccess("删除成功");
              this.getList();
              this.reset();
            }).catch(() => {});
          })
        }
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.isDeptIdAll()) {
        this.download('biz/fixture/manage/export', {
          ...this.queryParams
        }, `共治具_${new Date().getTime()}.xlsx`)
      }
      this.reset();
    },

    /** 表格合并行 */
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      let needMerge = this.needMergeArr.some((item) => {
        return item.colName === column.property;
      });
      if (needMerge === true) {
        return this.mergeAction(column.property, rowIndex, column);
      }
    },

    mergeAction(val, rowIndex, colData) {
      let _row = this.rowMergeArrs[val].rowArr[rowIndex];
      let _col = _row > 0 ? 1 : 0;
      return [_row, _col];
    },

    rowMergeHandle(arr, data) {
      if (!Array.isArray(arr) && !arr.length) return false;
      if (!Array.isArray(data) && !data.length) return false;
      let needMerge = {};

      arr.forEach((mergeItem) => {
        // 创建合并管理对象
        needMerge[mergeItem.colName] = {
          rowArr: [],
          rowMergeNum: 0,
        };
        let currentMergeItemData = needMerge[mergeItem.colName];

        // 进行合并管理对象数据的遍历整理
        data.forEach((item, index) => {
          if (index === 0) {
            currentMergeItemData.rowArr.push(1);
            currentMergeItemData.rowMergeNum = 0;
          } else {
            let currentRowData = data[index];
            let preRowData = data[index - 1];

            if (this.colMergeCheck(currentRowData, preRowData, mergeItem.mergeCheckNames)) {
              currentMergeItemData.rowArr[currentMergeItemData.rowMergeNum] += 1;
              currentMergeItemData.rowArr.push(0);
            } else {
              currentMergeItemData.rowArr.push(1);
              currentMergeItemData.rowMergeNum = index;
            }
          }
        });
      });
      return needMerge;
    },

    colMergeCheck(currentRowData, preRowData, mergeCheckNames) {
      if (!Array.isArray(mergeCheckNames) && !mergeCheckNames.length) return false;
      let result = true;
      for (let index = 0; index < mergeCheckNames.length; index++) {
        const mergeCheckName = mergeCheckNames[index];
        if (currentRowData[mergeCheckName] !== preRowData[mergeCheckName]) {
          result = false;
          break;
        }
      }
      return result;
    },

    /** 获取字典信息 */
    getProjectFormat(key) {
      return this.selectDictLabel(this.dict.type.biz_fixture_project, key);
    },

    /** 给输入框设置值 */
    changeOneSelection(val, fromObj, targetStr) {
      fromObj.find(item => {
        if (item.value === val) {
          targetStr = item
        }
      });
      this.getList();
    },

    /** 治具类型管理 治具类型下拉框赋值*/
    getFixtureCategoryList() {
      this.reset();
      if (this.isDeptIdAll()) {
        this.categoryOptions = [];
        fixtureCategoryList(this.form).then(response => {
          for (const i in response.data) {
            this.categoryOptions.push(response.data[i]['fixtureCategory'])}})}
    },
    getFixtureCategoryListTab() {
      this.reset();
      if (this.isDeptIdAll()) {
        fixtureCategoryList(this.form).then(response => {
          response.data.forEach(item => {
            item["seen"] = false;
            item["compile"] = "编辑";
            item["isDelete"] = "删除";
            item["cancel"] = false;
          })
          this.fixtureCategoryList = response.data
        })}},
    handleFixtureCategoryManage() {
      this.reset();
      if (this.isDeptIdAll()) {
        this.addCategoryOpen = true;
        this.title = "管理治具类型";
        this.getFixtureCategoryListTab();
      }
    },
    fixtureCategoryChange() {
      this.form.submitFlag = 3;
    },
    //当你点击编辑，切换按钮文本为保存，这里的seen可以看html代码里面，每一列都有一个input输入框
    //每一个输入框都有v-if控制显示，默认显示为false然后点击在改变其值就能显示输入框
    handleFixtureCategoryEdit(row, $index) {
      this.reset();
      this.form.cId = row.cId;
      this.form.fixtureCategory = row.fixtureCategory;
      row.seen = !row.seen
      if (row.seen) {
        row.compile = '保存';
        row.seen = true;
        row.cancel = true;
      } else {
        row.compile = '编辑';
        row.seen = false;
        if (this.isDeptIdAll()) {
          updateFixtureCategory(this.form).then(() => {
            row.cancel = false;
            this.categoryOptions = [];
            this.getFixtureCategoryList();
            this.getFixtureCategoryListTab();
            this.$message.success("更新治具类型成功！")
          });
        }}},
    handleFixtureCategoryRemove(row, $index) {
      if (this.isDeptIdAll()) {
        this.$modal.confirm('是否确认删除治具类型为"' + row.fixtureCategory + '"的数据项？').then(function() {
          return deleteFixtureCategory(row.cId);
        }).then(() => {
          this.categoryOptions = [];
          this.getFixtureCategoryList();
          this.getFixtureCategoryListTab();
          this.$modal.msgSuccess("删除治具类型成功");
        }).catch(() => {
        });
        this.reset();
      }
    },
    tabCancel(row, $index) {
      row.compile = "编辑";
      row.seen = false;
      row.cancel = false;
    },

    /** 新增料号对话框 */

    getFixtureMaterialIds() {
      if (this.isDeptIdAll()) {
        getFixtureMaterialIds(this.form.deptId).then(response => {
          this.restaurants = response.rows;
        });
      }
    },

    /** 验证料号是否存在 */
    materialIdRules(rule, value, callback) {
      //首先验证是否含有汉字
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('内容不能包含汉字!'));
        }
      }
      let params = {
        materialId: this.form.materialId,
      };
      if (this.isDeptIdAll()) {
        materialIdRules(params).then(response => {
          if(response.data === 'ok'){
            callback();
          }else{
            callback(new Error('料号已存在，请重新输入!'));
            // this.form.materialId = ""
          }
        })
      }
    },
    fixtureCategoryRules(rule, value, callback) {
      if (value === '') {
        callback(new Error("请输入治具类型！"))
      } else {
        callback();
      }
    },
    prodTypeRules(rule, value, callback) {
      if (value === '') {
        callback(new Error("请输入机型！"))
      } else {
        callback();
      }
    },

    /** 样式控制方法 */
    changeCellStyle(row, column, rowIndex, columnIndex) {
      if(row.column.label === "料号"){
        return 'color: blue; font-weight: bolder'  // 修改的样式
      } else if (row.column.label === "机种") {
        return 'font-weight: bolder'
      } else {
        return ''
      }
    },
  },
  mounted() {
    this.getDeptIds();
  },
};
</script>

<style scoped>
/*.el-table--medium*/
/*.el-table__cell {*/
/*  padding: 0px;*/
/*  padding-top: 0px;*/
/*  padding-right: 0px;*/
/*  padding-bottom: 0px;*/
/*  padding-left: 0px;*/
/*}*/
</style>
