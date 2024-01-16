<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机型" prop="mcId" required>
        <el-input
          v-model="queryParams.mcId"
          placeholder="机型"
          @change="submitBtn()"
          clearable
          style="width: 130px"
        />
      </el-form-item>

      <el-form-item label="盒子号" prop="simId">
        <el-input
          v-model="queryParams.simId"
          placeholder="盒子号"
          @change="submitBtn()"
          clearable
          style="width: 160px"
        />
      </el-form-item>

      <el-form-item label="产品序号" prop="pId">
        <el-input
          v-model="queryParams.pId"
          placeholder="产品序号"
          clearable
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="时段" required>
        <el-date-picker
          v-model="dateRangeCreateDate"
          style="width: 340px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Lead点卡控值" prop="leadThreshold" label-width="120px" required fixed>
        <el-input
          v-model="queryParams.leadThreshold"
          placeholder="卡控值"
          clearable
          style="width: 90px"
        ></el-input>
      </el-form-item>

      <el-form-item label="Pad点卡控值" prop="padThreshold" label-width="120px" required fixed>
        <el-input
          v-model="queryParams.padThreshold"
          placeholder="卡控值"
          clearable
          style="width: 90px"
        />
      </el-form-item>

    </el-form>

    <el-row class="mb8">
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      <el-button type="danger" size="mini" class="bigBtn" :disabled="hadSubmit" @click="onlineSubmit" @confirm>
        {{ submitText }}
      </el-button>

      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
      >导出
      </el-button>

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
      <el-table-column prop="tableRowId" label="#" type="selection" align="center">
      </el-table-column>
      <el-table-column prop="simId" label="盒子号" min-width="90px" align="center">
      </el-table-column>
      <el-table-column prop="dt" label="时间" min-width="100px" align="center">
      </el-table-column>
      <el-table-column prop="mcId" label="机型" align="center" min-width="90px">
      </el-table-column>
      <el-table-column label="线号" align="center" min-width="40px">
        <template slot-scope="scope">{{ scope.row.lineNo }}</template>
      </el-table-column>
      <el-table-column prop="leadX" label="LeadX" align="center" min-width="70px">
      </el-table-column>
      <el-table-column prop="leadY" label="LeadY" align="center" min-width="70px">
      </el-table-column>
      <el-table-column prop="padX" label="PadX" align="center" min-width="70px">
      </el-table-column>
      <el-table-column prop="padY" label="PadY" align="center" min-width="70px">
      </el-table-column>
      <el-table-column prop="leadDiff" label="lead点间距" align="center" min-width="50px">
      </el-table-column>
      <el-table-column prop="padDiff" label="pad点间距" align="center" min-width="50px">
      </el-table-column>
      <el-table-column prop="leadThreshold" label="Lead卡控值" :key="queryParams.leadThreshold" align="center" min-width="50px">
        {{ queryParams.leadThreshold }}
      </el-table-column>
      <el-table-column prop="padThreshold" label="Pad卡控值" :key="queryParams.padThreshold" align="center" min-width="50px">
        {{ queryParams.padThreshold }}
      </el-table-column>
      <el-table-column prop="wireLen" label="金线长" align="center" min-width="50px">
      </el-table-column>
      <el-table-column prop="checkPort" label="校验值" align="center" min-width="40px">
      </el-table-column>
      <el-table-column prop="pId" label="产品序号" align="center" min-width="30px">
      </el-table-column>

      <el-table-column prop="operation" label="操作" fixed="right" align="center" width="108px">
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
      hadSubmit: true,
      // 提交按钮文本
      submitText: '提 交 模 板',
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

      // 状态时间范围
      dateRangeCreateDate: [this.DateToStr(new Date(new Date().valueOf() - 5 * 60 * 1000)), this.DateToStr(new Date(new Date().valueOf()))],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mcId: null,
        simId: null,
        pId: null,
        beginTime: null,
        endTime: null,
        delLineNoStr: '',
        // lead阈值
        leadThreshold: 50,
        // pad阈值
        padThreshold: 10
      },
      delLineNo: new Set(),
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
    submitBtn() {
      this.hadSubmit = (this.queryParams.simId === null || this.queryParams.simId === '') && (this.queryParams.mcId === null || this.queryParams.mcId === '')
    },

    /** 在线提交 */
    onlineSubmit() {
      this.$modal.confirm('将向服务器提交模板数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        if (null != this.dateRangeCreateDate && '' !== this.dateRangeCreateDate) {
          this.queryParams.beginTime = this.dateRangeCreateDate[0]
          this.queryParams.endTime = this.dateRangeCreateDate[1]
        }
        addOnline(this.queryParams).then(response => {
          this.hadSubmit = true
          this.submitText = '已 提 交 模 版'
          if (response.code === 200) {
            this.$modal.alertSuccess('标准模版已提交！')
            this.$router.push('/biz/wbcomparison/info')
          } else {
            this.$modal.alertError('标准模版提交失败！')
            this.hadSubmit = false
            this.submitText = '提 交 模 版'
          }
        })
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
        simId: null,
        mcId: null,
        pId: null,
        leadThreshold: null,
        padThreshold: null
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
      this.resetForm('queryForm')
      this.hadSubmit = true
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sid)
      this.mcIds = selection.map(item => item.mcId)
      this.single = selection.length !== 1
      this.multiple = !selection.length

      this.delLineNo.clear()
      for (let i = 0; i < selection.length; i++) {
        this.delLineNo.add(selection[i].lineNo)
      }
      console.log(this.delLineNo)

      let delLineNoTmp = ''
      let j = 0
      this.queryParams.delLineNoStr = ''
      for (let item of this.delLineNo.keys()) {
        if (j === 0) {
          delLineNoTmp += item.toString()
          j++
        } else {
          delLineNoTmp += ',' + item.toString()
          j++
        }
      }
      this.queryParams.delLineNoStr = delLineNoTmp
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
          this.delBtnType = !this.delLineNo
        }
      )
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
      ++this.queryParams.leadThreshold
      ++this.queryParams.padThreshold
    }
  }
}
</script>

