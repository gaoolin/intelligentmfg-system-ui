<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <div>
        <el-form-item label="机型" required>
          <el-input
            v-model="queryParams.mcId"
            placeholder="请输入机型"
            clearable
          />
        </el-form-item>

        <el-form-item label="盒子号">
          <el-input
            v-model="queryParams.simId"
            placeholder="盒子号"
            clearable
          />
        </el-form-item>

        <el-form-item label="产品序号">
          <el-input
            v-model="queryParams.pId"
            placeholder="产品序号"
            clearable
          />
        </el-form-item>

        <el-form-item label="时段" required>
          <el-date-picker
            v-model="dateRangeCreateDate"
            style="width: 370px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="Lead点卡控值" label-width="130px" required>
          <el-input
            v-model="leadThreshold"
            placeholder="Lead点卡控值"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="Pad点卡控值"  label-width="130px" required>
          <el-input
            v-model="padThreshold"
            placeholder="Pad点卡控值"
            clearable
          />
        </el-form-item>
      </div>
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

    <!-- ref="multipleTable"必须写，用于 toggleSelection方法通过vue调用dom的方法      -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="dataList" border stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="tableRowId" label="#" type="selection">
      </el-table-column>
      <el-table-column prop="simId" label="盒子号" min-width="110px">
      </el-table-column>
      <el-table-column prop="dt" label="时间" min-width="120px">
      </el-table-column>
      <el-table-column prop="mcId" label="设备号" sortable>
      </el-table-column>
      <el-table-column label="线号">
        <template slot-scope="scope">{{ scope.row.lineNo }}</template>
      </el-table-column>
      <el-table-column prop="leadX" label="LeadX">
      </el-table-column>
      <el-table-column prop="leadY" label="LeadY">
      </el-table-column>
      <el-table-column prop="padX" label="PadX">
      </el-table-column>
      <el-table-column prop="padY" label="PadY">
      </el-table-column>
      <el-table-column prop="leadDiff" label="LeadDiff">
      </el-table-column>
      <el-table-column prop="padDiff" label="PadDiff">
      </el-table-column>
      <el-table-column prop="leadThreshold" label="Lead卡控值" :key="leadThreshold">{{ leadThreshold }}
      </el-table-column>
      <el-table-column prop="padThreshold" label="Pad卡控值" :key="padThreshold">{{ padThreshold }}
      </el-table-column>
      <el-table-column prop="wireLen" label="WireLen">
      </el-table-column>
      <el-table-column prop="checkPort" label="CheckPort">
      </el-table-column>
      <el-table-column prop="pId" label="产品序号">
      </el-table-column>

      <el-table-column prop="operation" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" @click="toggleSelection([dataList[scope.$index]])">删除<i
            class="el-icon-remove-outline"
          ></i></el-button>
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
    <div class="pd-15">
      <el-button type="primary" size="medium"  class="bigBtn" :disabled="hadSubmit" @click="onlineSubmit" @confirm>{{submitText}}</el-button>
    </div>
  </div>
</template>

<script>
import { listUpload, addOnline } from '@/api/biz/wbcomparison/upload'

export default {
  name: 'UploadModOnline',

  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 已提交禁用
      hadSubmit: false,
      // 提交按钮文本
      submitText: "提 交 模 板",
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 标准模版明细表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 时间选择器范围
      pickerOptions: {
        shortcuts: [{
          text: '近5分钟',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 60 * 1000 * 5)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近10分钟',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 60 * 1000 * 10)
            end.setTime(end.getTime() - 60 * 1000 * 5)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近15分钟',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 60 * 1000 * 15)
            end.setTime(end.getTime() - 60 * 1000 * 10)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      windowHeight: 650,
      // 状态时间范围
      dateRangeCreateDate: [this.DateToStr(new Date(new Date().valueOf())),
        this.DateToStr(new Date(new Date().valueOf() + 5 * 1440 * 60 * 1000))],
      // lead阈值
      leadThreshold: 50,
      // pad阈值
      padThreshold: 10,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mcId: null,
        simId: null,
        pId: null,
        beginTime: null,
        endTime: null,
        delLineNo: new Set()
      },
      delBtnType: true
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.dateRangeCreateDate && '' !== this.dateRangeCreateDate) {
        this.queryParams.params['beginCreateDate'] = this.dateRangeCreateDate[0]
        this.queryParams.params['endCreateDate'] = this.dateRangeCreateDate[1]
      }
      listUpload(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false    // 关闭加载动效必须写在回调函数的内部
      })
    },

    stdModSubmit() {
      this.$modal.confirm('将向服务器提交模板数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.loading = true
          this.queryParams.params = []
          if (null !== this.daterangeCreateDate && '' !== this.daterangeCreateDate) {
            this.queryParams.params['beginCreateDate'] = this.daterangeCreateDate[0]
            this.queryParams.params['endCreateDate'] = this.daterangeCreateDate[1]
          }
          addOnline(this.queryParams).then(response => {
              this.loading = false
              if (response.code === 200) {
                this.$modal.alertSuccess('标准模版已提交！')
                this.$router.push('/')
              } else {
                this.$modal.alertError('标准模版提交失败！')
              }
            }
          )
        }
      )
    },

    /** 在线提交 */
    onlineSubmit() {
      this.$modal.confirm('将向服务器提交模板数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        addOnline(this.queryParams).then(response => {
          this.loading = true;
          this.hadSubmit = true;
          this.submitText = "已 提 交 模 版";
          if (response.code === 200) {
            this.$modal.alertSuccess("标准模版已提交！");
            this.$router.push("/");
          } else {
            this.$modal.alertError("标准模版提交失败！");
            this.hadSubmit = false;
            this.submitText = "提 交 模 版";
          }
        })
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        simId: null,
        mcId: null,
        pId: null,
        dateRangeCreateDate: [null, null],
        leadThreshold: null,
        padThreshold: null
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
      this.ids = selection.map(item => item.sid)
      this.mcIds = selection.map(item => item.mcId)
      this.single = selection.length!==1
      this.multiple = !selection.length

      this.queryParams.delLineNo.clear();
      for (let i = 0; i < selection.length; i++) {
        this.queryParams.delLineNo.add(selection[i].lineNo);
      }

      console.log(this.queryParams.delLineNo);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加智慧打线图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sid = row.sid || this.ids;
      getComparison(sid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改智慧打线图";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wbcomparison/upload/export', {
        ...this.queryParams
      }, `comparison_${new Date().getTime()}.xlsx`)
    },

    toggleSelection(row) {   //取消选中
      this.$nextTick(() => {  // 页面挂载完成后操作dom
          if (row) {
            row.forEach(r => {
              this.$refs.multipleTable.toggleRowSelection(r)  // 第二个参数为true时，则不能第二次点击取消
            })
          } else {
            this.$refs.multipleTable.clearSelection()
          }
          this.delBtnType = !this.queryParams.delLineNo
        }
      )
      console.log(this.queryParams.delLineNo);
    },
    rowClass() { //表格数据居中显示
      return 'text-align:center'
    },

    headClass() { //表头居中显示
      return 'text-align:center'
    },

    getHeight() {
      // console.log(window.innerHeight);
      this.windowHeight = window.innerHeight - 380
    },
    /** 日期转字符串 */
    DateToStr(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hours = date.getHours()
      const min = date.getMinutes()
      const second = date.getSeconds()
      return year + '-' +
        ((month + 1) > 9 ? (month + 1) : '0' + (month + 1)) + '-' +
        (day > 9 ? day : ('0' + day)) + ' ' +
        (hours > 9 ? hours : ('0' + hours)) + ':' +
        (min > 9 ? min : ('0' + min)) + ':' +
        (second > 9 ? second : ('0' + second))
    }
  },

  watch: {
    menuTree() {
      ++this.leadThreshold
      ++this.padThreshold
    }
  },

  destroyed() {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

