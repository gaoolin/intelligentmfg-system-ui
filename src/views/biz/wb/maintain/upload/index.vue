<template>
  <div class="app-container center">
    <h2 class="body">智慧打线图标准模版导入</h2>
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip text-center" slot="tip">
        <span>仅允许导入xls、xlsx格式文件。</span>
        <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                 @click="importTemplate"
        >下载模板
        </el-link>
      </div>
    </el-upload>
    <div slot="footer"  style="text-align: center; margin-top: 5px">
      <el-button type="primary" @click="submitUpload"> 上 传 服 务 器</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'index',
  data() {
    return {
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/wb/olp/upload/manual',
        // 上传的文件列表
        fileList: []
      }
    }
  },
  methods: {
    uploadFail() {
      this.$modal.msgError('远程服务异常！')
    },

    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit()
    },
    /** 提交按钮 */

    /** 下载模板操作 */
    importTemplate() {
      this.download('/wb/olp/upload/importTemplate', {}, `智慧打线图标准模版.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 文件上传返回后台信息
    handleResponse(response, file, fileList) {
      this.upload.isUploading = false
      if (response.code !== 200) {
        this.$modal.msgError(response.msg)
      } else {
        this.$modal.msgSuccess(response.msg)
      }
    }
  }
}
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
