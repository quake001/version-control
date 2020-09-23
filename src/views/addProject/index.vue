<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}">
        <el-card shadow="hover">
          <el-form ref="form" :model="form" label-width="80px" label-position="top">
            <el-form-item label="项目名">
              <el-input ref="focus" v-model="form.projectId" placeholder="请输入项目名" clearable />
            </el-form-item>
            <el-form-item label="介绍">
              <el-input v-model="form.textarea" maxlength="200" show-word-limit type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item style="width:100%; text-align:center;">
              <el-button type="primary" style="width:60%; margin:0 auto 30px auto;" @click="onSubmit">新增</el-button>
              <el-button style="width:60%; margin:0 auto 30px auto;" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addProject, queryProject } from '@/api/log'
export default {
  data() {
    return {
      form: {
        projectId: '',
        textarea: ''
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
  },
  methods: {
    onCancel() {
      this.form = {
        projectId: '',
        textarea: ''
      }
    },
    async onSubmit() {
      if (this.form.projectId.trim() === '') {
        this.$message({
          message: '项目名不得为空',
          type: 'error'
        })
      } else {
        if (this.form.textarea.trim() === '') {
          this.$message({
            message: '项目介绍不得为空',
            type: 'error'
          })
        } else {
          const projectId = this.form.projectId
          const queryRes = await queryProject(projectId)
          console.log(queryRes)
          if (queryRes.length === 0 || this.DuplicateName(queryRes)) {
            this.form.id=this.form.projectId
            await addProject(this.form)
            this.form = {
              id:'',
              projectId: '',
              textarea: ''
            }
            this.$message({
              message: '新建项目成功',
              type: 'success'
            })
          } else {
            // 存在项目名就报错
            this.$message({
              message: '该项目名已存在！',
              type: 'error'
            })
          }
        }
      }
    },
    // 判断是否重名的方法
    DuplicateName(data) {
      return data.every((val) => {
        return val.projectId !== this.form.projectId
      })
    }
  }
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

