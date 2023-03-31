<template>
  <div class="app-container center">
    <h2 class="body">金线标准用量数据上传</h2>
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
                 @click="importTemplate">下载模板
        </el-link>
      </div>
    </el-upload>
    <br/>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload"> 上 传 服 务 器</el-button>
    </div>
  </div>
</template>

<script>
import { uploadStdModel } from '@/api/biz/standard/import'
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
        url: process.env.VUE_APP_BASE_API + '/biz/standard/import',
        // 上传的文件列表
        fileList: []
      }
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      if (response.code !== 200) {
        this.$modal.msgError(response.msg)
      } else {
        this.$modal.msgSuccess(response.msg)
      }
    },

    uploadFail() {
      this.$modal.msgError('远程服务异常！')
    },

    httpRequest() {
      uploadStdModel().then(res => {
        if (res.data.code !== 200) {
          this.$modal.msgError('模板上传失败！')
        } else {
          this.$modal.msgSuccess('模板上传成功！')
        }
      })
    },

    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit()
    },
    /** 提交按钮 */

    /** 下载模板操作 */
    importTemplate() {
      this.download('biz/standard/importTemplate', {}, `金线标准用量表.xlsx`)
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
