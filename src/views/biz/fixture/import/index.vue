<template>
  <div class="app-container center">
    <div>
      <h2 class="body">治具共用信息数据上传</h2>
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
      <br/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload" v-hasPermi="['fixture:search:upload']"> 上 传 服 务 器</el-button>
      </div>
    </div>

    <div>
      <h2 class="body">PogoPin治具因子数据上传</h2>
      <el-upload
        ref="uploadFactors"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadFactorsPogopin.headers"
        :action="uploadFactorsPogopin.url"
        :disabled="uploadFactorsPogopin.isUploading"
        :on-progress="handleFileUploadProgressFactorsPogopin"
        :on-success="handleFileSuccessFactorsPogopin"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplatePogopinFactors"
          >下载模板
          </el-link>
        </div>
      </el-upload>
      <br/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUploadFactorsPogopin" v-hasPermi="['fixture:factors:pogopin:upload']"> 上 传 服 务 器</el-button>
      </div>
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
        url: process.env.VUE_APP_BASE_API + '/fixture/search/upload',
        // 上传的文件列表
        fileList: []
      },
      uploadFactorsPogopin: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/factors/pogopin/upload',
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
    // 文件提交处理
    submitUploadFactorsPogopin() {
      this.$refs.uploadFactors.submit()
    },
    /** 提交按钮 */

    /** 下载模板操作 */
    importTemplate() {
      this.download('/fixture/search/importTemplate', {}, `共治具导入模板.xlsx`)
    },
    /** 下载模板操作 */
    importTemplatePogopinFactors() {
      this.download('/fixture/factors/pogopin/importTemplate', {}, `Pogopin因子导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传中处理
    handleFileUploadProgressFactorsPogopin(event, file, fileList) {
      this.uploadF.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.uploadFactorsPogopin.isUploading = false
      this.$refs.uploadFactors.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    // 文件上传成功处理
    handleFileSuccessFactorsPogopin(response, file, fileList) {
      this.uploadFactorsPogopin.isUploading = false
      this.$refs.uploadFactors.clearFiles()
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
