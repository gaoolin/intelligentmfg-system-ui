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
        <div class="div" v-hasPermi="['fixture:factors:pogopin:upload']">
          <h2 class="body">PogoPin治具因子数据上传</h2>
          <el-upload
            ref="uploadFactorsPogopin"
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
                       @click="importTemplateFactorsPogopin"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUploadFactorsPogopin" >
              上 传 服 务 器
            </el-button>
          </div>
        </div>

        <div class="div" v-hasPermi="['fixture:factors:aa:upload']">
          <h2 class="body">AA治具因子数据上传</h2>
          <el-upload
            ref="uploadFactorsAa"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="uploadFactorsAa.headers"
            :action="uploadFactorsAa.url"
            :disabled="uploadFactorsAa.isUploading"
            :on-progress="handleFileUploadProgressFactorsAa"
            :on-success="handleFileSuccessFactorsAa"
            :auto-upload="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplateFactorsAa"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer" >
            <el-button type="primary" @click="submitUploadFactorsAa"> 上 传
              服 务 器
            </el-button>
          </div>
        </div>

        <div class="div" v-hasPermi="['fixture:factors:suofu:upload']">
          <h2 class="body">锁附治具因子数据上传</h2>
          <el-upload
            ref="uploadFactorsSuoFu"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="uploadFactorsSuoFu.headers"
            :action="uploadFactorsSuoFu.url"
            :disabled="uploadFactorsSuoFu.isUploading"
            :on-progress="handleFileUploadProgressFactorsSuoFu"
            :on-success="handleFileSuccessFactorsSuoFu"
            :auto-upload="false"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplateFactorsSuoFu"
              >下载模板
              </el-link>
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUploadFactorsSuoFu">
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
      uploadFactorsPogopin: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/factors/pogopin/upload',
        fileList: []
      },
      uploadFactorsAa: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/factors/aa/upload',
        fileList: []
      },
      uploadFactorsSuoFu: {
        isUploading: false,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/fixture/factors/suofu/upload',
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
    submitUploadFactorsPogopin() {
      this.$refs.uploadFactorsPogopin.submit()
    },
    submitUploadFactorsAa() {
      this.$refs.uploadFactorsAa.submit()
    },
    submitUploadFactorsSuoFu() {
      this.$refs.uploadFactorsSuoFu.submit()
    },

    /** 提交按钮 */

    /** 下载模板操作 */
    importTemplate() {
      this.download('/fixture/search/importTemplate', {}, `共治具导入模板.xlsx`)
    },
    /** 下载模板操作 */
    importTemplateFactorsPogopin() {
      this.download('/fixture/factors/pogopin/importTemplate', {}, `Pogopin因子导入模板.xlsx`)
    },
    importTemplateFactorsAa() {
      this.download('/fixture/factors/aa/importTemplate', {}, `AA因子导入模板.xlsx`)
    },
    importTemplateFactorsSuoFu() {
      this.download('/fixture/factors/suofu/importTemplate', {}, `锁附因子导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileUploadProgressFactorsPogopin(event, file, fileList) {
      this.uploadFactorsPogopin.isUploading = true
    },
    handleFileUploadProgressFactorsAa(event, file, fileList) {
      this.uploadFactorsAa.isUploading = true
    },
    handleFileUploadProgressFactorsSuoFu(event, file, fileList) {
      this.uploadFactorsSuoFu.isUploading = true
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessFactorsPogopin(response, file, fileList) {
      this.uploadFactorsPogopin.isUploading = false
      this.$refs.uploadFactorsPogopin.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessFactorsAa(response, file, fileList) {
      this.uploadFactorsAa.isUploading = false
      this.$refs.uploadFactorsAa.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
    },
    handleFileSuccessFactorsSuoFu(response, file, fileList) {
      this.uploadFactorsSuoFu.isUploading = false
      this.$refs.uploadFactorsSuoFu.clearFiles()
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
