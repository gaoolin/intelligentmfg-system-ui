<template>
  <div class="app-container">
    <el-card  v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" :rule="rules">
        <el-form-item label="机型" prop="prodType">
          <el-input
            v-model="queryParams.prodType"
            placeholder="请输入机型"
            clearable
            @change="dataChange"
            @keyup.enter.native="handleQuery"
            @input="dataChange"
          />
        </el-form-item>

        <el-form-item prop="dtRange">
          <date-time-range-picker
            v-model="queryParams.dtRange"
            label="时段"
            prop="dtRange"
            :type="'daterange'"
            :max-span-value="30"
            :max-span-unit="'day'"
            :required="true"
            :enable-shortcuts="true"
            :picker-options="pickerOptions"
          ></date-time-range-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>

    <!-- 上传和返回按钮 -->
    <el-row :gutter="20" class="upload-row">
      <el-col :span="12">
        <el-upload
          action="/aa/params/hdfs/createFile"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :data="uploadData"
          class="upload-btn"
        >
          <el-button type="primary">上传程序</el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <right-tool-bar-go-back :showSearch.sync="showSearch" @queryTable="getList" :back="back"></right-tool-bar-go-back>
      </el-col>
    </el-row>

    <el-card>
    <el-table :header-cell-style="headerCellStyle" :row-class-name="rowClassName"
              :cell-style="cellStyle"
              :style="tableStyle()" :data="fileList" style="width: 100%"
              border
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="prodType" label="适用机型" width="180"></el-table-column>
      <el-table-column prop="fileName" label="文件名" width="180"></el-table-column>
      <el-table-column prop="version" label="版本"></el-table-column>
      <el-table-column prop="uploadDate" label="上传日期"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="size" label="大小"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">已发布</el-tag>
          <el-tag v-else type="danger">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="downloadCnt" label="下载次数"></el-table-column>
      <el-table-column prop="author" label="提供人"></el-table-column>
      <el-table-column prop="factoryName" label="厂区"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="downloadFile(scope.row)">下载</el-button>
          <el-button type="warning" plain size="mini" @click="editFileInfo(scope.row)">修改信息</el-button>
          <el-button type="danger" plain size="mini" @click="deleteFile(scope.row)">删除</el-button>
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
    </el-card>
    <el-dialog title="修改文件信息" :visible.sync="editDialogVisible">
      <el-form :model="editForm">
        <el-form-item label="文件名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="editForm.version"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </div>
    </el-dialog>
    <el-progress v-if="uploadProgress" :percentage="uploadProgress"></el-progress>
  </div>
</template>

<script>
import { downloadAaSoftware, listAaSoftwareInfo } from '@/api/biz/aa/params'
import DateTimeRangePicker from '@/views/biz/common/DateTimeRangePicker.vue'
import RightToolBarGoBack from '@/views/biz/common/RightToolBarGoBack'
import '@/views/biz/common/css/qtech-css.css';

export default {
  components: {
    DateTimeRangePicker,
    RightToolBarGoBack
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      back: false,
      // 总条数
      total: 0,
      loading: true,
      fileList: null,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.setHours(0, 0, 0).valueOf())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59) - 1 * 1440 * 60 * 1000)
            start.setTime(start.setTime(new Date().setHours(0, 0, 0) - 1 * 1440 * 60 * 1000))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前两天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setTime(new Date(end.setHours(23, 59, 59).valueOf() - 2 * 1440 * 60 * 1000).getTime()))
            start.setTime(start.setTime(new Date(start.setHours(0, 0, 0).valueOf() - 2 * 1440 * 60 * 1000).getTime()))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59).valueOf() - 3 * 1440 * 60 * 1000)
            start.setTime(start.setHours(0, 0, 0).valueOf() - 3 * 1440 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '前一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.setHours(23, 59, 59).valueOf() - 7 * 1440 * 60 * 1000)
            start.setTime(start.setHours(0, 0, 0).valueOf() - 7 * 1440 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 厂选择器
      factoryOptions: [],
      // 区选择器
      workshopOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prodType: null,
        status: null,
        dtRange: []
      },
      rules: {},
      uploadData: {
        path: '' // 上传路径
      },
      uploadProgress: 0,
      editDialogVisible: false,
      editForm: {
        name: '',
        version: ''
      },
      selectedFiles: []
    }
  },
  methods: {
    getList() {
      this.loading = true
      listAaSoftwareInfo(this.queryParams).then(res => {
        this.fileList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    dataChange() {
      this.getList()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    downloadFile() {
      const hdfsPath = '/aa-std-program/C3HF06改机软件.zip'
      downloadAaSoftware(hdfsPath)
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', hdfsPath.substring(hdfsPath.lastIndexOf('/') + 1))
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$message.success('文件下载成功')
        })
        .catch(error => {
          console.error(error)
          this.$message.error('文件下载失败')
        })
    },
    fetchFiles() {
      // 调用后端接口获取文件列表
      // 根据 searchQuery 进行搜索过滤
    },
    beforeUpload(file) {
      this.uploadProgress = 0
    },
    handleUploadSuccess(response, file, fileList) {
      this.uploadProgress = 100
      this.fetchFiles() // 上传成功后重新获取文件列表
    },
    handleUploadError(err, file, fileList) {
      this.uploadProgress = 0
      // 处理上传失败
    },

    editFileInfo(file) {
      this.editForm = { ...file }
      this.editDialogVisible = true
    },
    deleteFile(file) {
      // 调用后端接口删除文件
    },
    submitEdit() {
      // 调用后端接口提交修改
      this.editDialogVisible = false
      this.fetchFiles() // 修改成功后重新获取文件列表
    },
    handleSelectionChange(selection) {
      this.selectedFiles = selection
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchFiles()
    },
    headerCellStyle() {
      return {
        backgroundColor: '#4fc3f7',  // 明亮的背景色
        color: '#ffffff',            // 白色字体，强烈对比
        fontWeight: 'bold',          // 粗体字体
        borderBottom: '1px solid #004d40', // 深绿色底部边框
        textAlign: 'center',         // 居中文本对齐
        fontSize: '14px'             // 清晰易读的字体大小
      }
    },
    rowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
    },
    cellStyle() {
      return {
        backgroundColor: '#e0f7fa',   // Clean, white background for clarity
        color: '#111111',             // Harmonious teal text color
        borderBottom: '1px solid #004d40', // Deep teal border for continuity
        textAlign: 'center',          // Centered text for uniformity
        fontSize: '15px',             // Slightly smaller font for readability
        fontWeight: 'bold',
      }
    },
    tableStyle() {
      return {
        border: '1px solid #4fc3f7',  // 深绿色边框
        borderRadius: '8px',          // 圆角边框
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 添加阴影
      }
    },
  },

  created() {
  },

  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
</style>
