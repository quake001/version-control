<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}">
        <el-card shadow="hover">
          <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="top">
            <el-form-item label="项目名" prop="projectId">
              <el-input ref="focus" v-model="form.projectId" placeholder="请输入项目名" clearable readonly disabled />
            </el-form-item>
            <el-form-item label="版本号" prop="version">
              <el-input ref="version" v-model="form.version" placeholder="请输入版本号" clearable :disabled="editControl===null?false:true" />
            </el-form-item>
            <el-form-item label="上传文件">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button style="width:100%" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="下载路径" prop="uri">
              <el-input v-model="form.uri" readonly disabled />
            </el-form-item>
            <el-form-item label="介绍" prop="textarea">
              <el-input v-model="form.textarea" maxlength="200" show-word-limit type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="版本适配" prop="modelOptions">
              <adaptation :options="ModelOptions" :edit-options="form.modelOptions" @getOptions="getModelOptions" />
            </el-form-item>
            <el-form-item label="系统适配" prop="systemOptions">
              <adaptation :options="systemOptions" :edit-options="form.systemOptions" @getOptions="getSystemOptions" />
            </el-form-item>
            <el-form-item label="是否支持热更新">
              <el-switch v-model="form.hotUpdate" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
            <transition name="fade-transform" mode="out-in">
              <div v-show="form.hotUpdate">
                <el-form-item label="上传热更新文件">
                  <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-success="handleHotSuccess"
                    :on-error="handleError"
                    :on-remove="handleHotRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                  >
                    <el-button style="width:100%" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="下载路径">
                  <el-input v-model="form.hotUri" readonly disabled />
                </el-form-item>
              </div>
            </transition>

            <el-form-item style="width:100%; text-align:center;">
              <el-button type="primary" style="width:80%; margin:0 auto 30px auto;" @click="onSubmit">{{ addData }}</el-button>
              <el-button style="width:80%; margin:0 auto 30px auto;" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import validate from '@/commonent/validate.js'
import { addVersion, delKeys, delVersion, getversion, getversionById } from '@/api/table'
import { addInsertLog } from '@/api/log'
import { mapGetters } from 'vuex'
import adaptation from './options/index'
export default {
  name: 'AddVersion',
  components: {
    adaptation,
  },
  data() {
    return {
      form: {
        projectId: '',
        version: '',
        uri: '',
        textarea: '',
        modelOptions: [],
        systemOptions: [],
        hotUpdate: false,
        hotUri: '',
      },
      formData: {
        bucket: 'version-control-1253674864',
        region: 'ap-guangzhou',
        dir: '',
      },
      hotData: {
        bucket: 'version-control-1253674864',
        region: 'ap-guangzhou',
        dir: '',
      },
      addData: '新增',
      fileList: [],
      ModelOptions: ['苹果', '魅族', '小米', 'OPPO', '三星', '华为', 'VIVO', '1+', '其他'],
      systemOptions: ['IOS', 'Android'],
      editControl: null,
      rules: validate
    }
  },
  computed: {
    ...mapGetters(['token', 'userId', 'userData']),
  },
  mounted() {
    this.editControl = window.sessionStorage.getItem('editVersion')
    if (window.sessionStorage.getItem('editVersion')) {
      this.form = JSON.parse(window.sessionStorage.getItem('editVersion'))
      this.form.modelOptions = JSON.parse(this.form.modelOptions)
      this.form.systemOptions = JSON.parse(this.form.systemOptions)
      this.form.hotUpdate = JSON.parse(this.form.hotUpdate)
      this.addData = '编辑'
    } else this.addData = '新增'
    this.form.projectId = this.$route.params.projectId
    this.$refs.focus.focus()
  },
  beforeDestroy() {
    window.sessionStorage.removeItem('editVersion')
  },
  methods: {
    // 接受子组件传入的选择项
    getModelOptions(val) {
      this.form.modelOptions = val
    },
    // 接受子组件传入的选择项
    getSystemOptions(val) {
      this.form.systemOptions = val
    },
    // 点击提交按钮
    async onSubmit() {
      if (this.token !== '') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.form.hotUpdate === true) {
              if (this.form.hotUri === '') {
                this.$message({
                  message: '热更新下载路径不得为空',
                  type: 'error'
                })
              } else {
                this.refer()
              }
            } else {
              this.refer()
            }
          } else {
            return false
          }
        })
      } else {
        this.$message({
          message: '身份过期,请重新登录',
          type: 'error'
        })
        this.$route.push('/login')
        this.clearForm()
      }
    },
    // 取消操作
    async onCancel() {
      if (this.addData === '新增') {
        if (this.form.uri !== '') {
          // await delKeys(this.formData)
          // await delKeys(this.hotData)
          this.fileList = []
        }
        for (var key in this.form) {
          if (this.form[key] !== '') {
            this.form[key] = ''
            if (key === 'hotUpdate') {
              this.form[key] = false
            }
          }
        }
      } else {
        this.$router.go(-1)
      }
    },
    // 提交版本函数
    async refer() {
      // 存入时插入token和userId
      this.form.token = this.token
      if (!this.form.prodControl) {
        this.form.prodControl = false
      }
      if (!this.form.grayControl) {
        this.form.grayControl = false
      }
      if (this.editControl) {
        console.log(this.form)
        await delVersion(this.form.id)
      }
      // 存入时将数组转为字符串
      this.form.id = this.form.projectId + this.form.version
      this.form.modelOptions = JSON.stringify(this.form.modelOptions)
      this.form.systemOptions = JSON.stringify(this.form.systemOptions)
      await addVersion(this.form)
      this.fileList = []
      this.$message({
        message: '成功',
        type: 'success',
      })
      if (this.editControl) {
        const logInfo = {
          id: Date.now(),
          info: `编辑${this.form.projectId}项目：${this.form.version}版本`,
        }
        await addInsertLog(logInfo)
      } else {
        const logInfo = {
          id: Date.now(),
          info: `新增${this.form.projectId}项目：${this.form.version}版本`,
        }
        await addInsertLog(logInfo)
      }

      this.$router.push(`/version/detail/${this.form.projectId}`)
      this.clearForm()
    },
    handleHotSuccess(response, file, fileList) {
      this.form.hotUri = 'http://version-control-1253674864.cos.ap-guangzhou.myqcloud.com/587f6c0a08c94586a49a585003c1f350.rar'
    },
    async handleHotRemove(file, fileList) {
      this.form.hotUri = ''
    },
    handleSuccess(response, file, fileList) {
      this.form.uri = 'http://version-control-1253674864.cos.ap-guangzhou.myqcloud.com/587f6c0a08c94586a49a585003c1f350.rar'
    },
    async handleRemove(file, fileList) {
      this.form.uri = ''
    },
    handleError(err) {
      console.log(err)
      this.$message.error('不得上传该后缀格式文件')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    },
    clearForm() {
      // 清空表格内容
      this.form = {
        projectId: '',
        version: '',
        uri: '',
        key: '',
        textarea: '',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 50px;
  }
}
.line {
  text-align: center;
}
.centered {
  display: flex;
  justify-content: space-around;
}
</style>

<style>
.el-upload {
  display: block;
  width: 100%;
  cursor: pointer;
  outline: 0;
}
</style>
