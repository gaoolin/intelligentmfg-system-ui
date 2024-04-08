<template>
  <div class="app-container center">
    <el-row>
      <div v-hasPermi="['fixture:search:upload']">
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
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitUpload" > 上 传 服 务 器</el-button>
        </div>
      </div>
    </el-row>

    <el-row :gutter="20" class="mb8">
      <div class="upload-div">
        <div class="div" v-hasPermi="['fixture:params:pogopin:upload']">
          <h2 class="body">PogoPin治具因子数据上传</h2>
          <el-upload
            ref="uploadparamsPogopin"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="uploadparamsPogopin.headers"
            :action="uploadparamsPogopin.url"
            :disabled="uploadparamsPogopin.isUploading"
            :on-progress="handleFileUploadProgressparamsPogopin"
            :on-success="handleFileSuccessparamsPogopin"
            :auto-upload="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplateparamsPogopin"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUploadparamsPogopin" >
              上 传 服 务 器
            </el-button>
          </div>
        </div>

        <div class="div" v-hasPermi="['fixture:params:aa:upload']">
          <h2 class="body">AA治具因子数据上传</h2>
          <el-upload
            ref="uploadparamsAa"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="uploadparamsAa.headers"
            :action="uploadparamsAa.url"
            :disabled="uploadparamsAa.isUploading"
            :on-progress="handleFileUploadProgressparamsAa"
            :on-success="handleFileSuccessparamsAa"
            :auto-upload="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplateparamsAa"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer" >
            <el-button type="primary" @click="submitUploadparamsAa"> 上 传
              服 务 器
            </el-button>
          </div>
        </div>

        <div class="div" v-hasPermi="['fixture:params:suofu:upload']">
          <h2 class="body">锁附治具因子数据上传</h2>
          <el-upload
            ref="uploadparamsSuoFu"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="uploadparamsSuoFu.headers"
            :action="uploadparamsSuoFu.url"
            :disabled="uploadparamsSuoFu.isUploading"
            :on-progress="handleFileUploadProgressparamsSuoFu"
            :on-success="handleFileSuccessparamsSuoFu"
            :auto-upload="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplateparamsSuoFu"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUploadparamsSuoFu">
              上 传 服 务 器
            </el-button>
          </div>
        </div>
      </div>
    </el-row>
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
      uploadparamsPogopin: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/params/pogopin/upload',
        fileList: []
      },
      uploadparamsAa: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/params/aa/upload',
        fileList: []
      },
      uploadparamsSuoFu: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/params/lock/upload',
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
    submitUploadparamsPogopin() {
      this.$refs.uploadparamsPogopin.submit()
    },
    submitUploadparamsAa() {
      this.$refs.uploadparamsAa.submit()
    },
    submitUploadparamsSuoFu() {
      this.$refs.uploadparamsSuoFu.submit()
    },

    /** 提交按钮 */

    /** 下载模板操作 */
    importTemplate() {
      this.download('/fixture/search/importTemplate', {}, `共治具导入模板.xlsx`)
    },
    /** 下载模板操作 */
    importTemplateparamsPogopin() {
      this.download('/fixture/params/pogopin/importTemplate', {}, `Pogopin因子导入模板.xlsx`)
    },
    importTemplateparamsAa() {
      this.download('/fixture/params/aa/importTemplate', {}, `AA因子导入模板.xlsx`)
    },
    importTemplateparamsSuoFu() {
      this.download('/fixture/params/lock/importTemplate', {}, `锁附因子导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileUploadProgressparamsPogopin(event, file, fileList) {
      this.uploadparamsPogopin.isUploading = true
    },
    handleFileUploadProgressparamsAa(event, file, fileList) {
      this.uploadparamsAa.isUploading = true
    },
    handleFileUploadProgressparamsSuoFu(event, file, fileList) {
      this.uploadparamsSuoFu.isUploading = true
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessparamsPogopin(response, file, fileList) {
      this.uploadparamsPogopin.isUploading = false
      this.$refs.uploadparamsPogopin.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessparamsAa(response, file, fileList) {
      this.uploadparamsAa.isUploading = false
      this.$refs.uploadparamsAa.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessparamsSuoFu(response, file, fileList) {
      this.uploadparamsSuoFu.isUploading = false
      this.$refs.uploadparamsSuoFu.clearFiles()
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

<style scoped lang="scss">
.center {
  text-align: center;
}

.upload-div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div {
  margin: 5px;
}

</style>
