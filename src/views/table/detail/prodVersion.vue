<template>
  <div>
    <div class="devepoment">
      <el-row :gutter="0">
        <el-col :sm="{span: 24}" :xs="{span: 22, offset: 1}">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="title">线上版本</span>
            </div>
            <el-table v-loading="listLoading" :data="prodlist" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column prop="row" align="center" label="ID" width="130">
                <template slot-scope="scope">{{ scope.row.id }}</template>
              </el-table-column>
              <el-table-column prop="projectId" label="版本名称" width="200">
                <template slot-scope="scope">{{ scope.row.projectId }}</template>
              </el-table-column>
              <el-table-column prop="textarea" label="版本介绍">
                <template slot-scope="scope">{{ scope.row.textarea }}</template>
              </el-table-column>
              <el-table-column prop="uri" label="下载路径" width="240" align="center">
                <template slot-scope="scope">
                  <el-link target="_blank" :href="scope.row.uri" :underline="false" @click.native="setDownloads">
                    {{ scope.row.uri }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="version" label="版本" width="130" align="center">
                <template slot-scope="scope">{{ scope.row.version }}</template>
              </el-table-column>
              <el-table-column label="编辑" width="180" align="center">
                <template slot-scope="scope">
                  <el-button style="margin-bottom: 10px;" type="primary" @click.native.prevent="detail(scope.row)">查看详情</el-button>
                  <el-button style="margin:0 0 10px 0;" type="primary" @click.native.prevent="dialogFormVisible = true">回滚版本</el-button>
                  <el-button style="margin-left:0;" type="danger" @click.native.prevent="off(scope.row)">下架</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog title="回滚版本" :visible.sync="dialogFormVisible" width="30%" center>
        <el-form :model="form">
          <el-form-item label="版本">
            <el-select v-model="form.rollBackVersion" placeholder="请选择回滚版本">
              <el-option v-for="val in versionList" :key="val" :label="val" :value="val" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="rollBack">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { addVersion, delVersion, getversion } from '@/api/table'
import { addInsertLog } from '@/api/log'

import { mapGetters } from 'vuex'

export default {
  props: ['projectId', 'prodData', 'versionData'],
  data() {
    return {
      listLoading: false,
      prodlist: [],
      dialogFormVisible: false,
      form: {
        rollBackVersion: '',
        thisVersion: ''
      },
      versionList: [],
      detailData: ''
    }
  },
  computed: {
    ...mapGetters(['token', 'userId'])
  },
  watch: {
    prodData(newValue) {
      this.prodlist = newValue
    },
    versionData(newValue) {
      this.versionList = newValue
    }
  },
  mounted() {
  },
  methods: {
    // 获取该项目的版本号
    async getVersionList() {
      const data = {
        userId: this.userId,
        projectId: this.projectId,
        token: this.token
      }
      const versionRes = await getversion(data)
      this.prodlist = this.prodControl(versionRes)
    },
    // 判断是否存在开发版本
    prodControl(data) {
      return data.filter((val) => {
        return val.projectId === this.projectId && JSON.parse(val.prodControl) === true
      })
    },
    // 查看详情
    detail(val) {
      this.$emit('showDetail', val)
    },
    // 下架
    async off(val) {
      val.prodControl = false
      val.token = this.token
      await delVersion(val.id)
      await addVersion(val)
      this.$emit('offVersion')
      this.$message({
        message: '下架成功',
        type: 'success'
      })
      const logInfo = {
        info: `下架了${val.projectId}项目：${val.version}版本`,
        id:Date.now()
      }
      await addInsertLog(logInfo)
    },
    // 跳转灰度页面
    grayMonitor({ key }) {
      window.localStorage.setItem('key', key)
      this.$router.push(`/version/grayMonitor`)
    },
    // 编辑版本
    editVersion() {
      this.$router.push(`/version/addVersion/${this.detailData.projectId}`)
      window.sessionStorage.setItem('editVersion', JSON.stringify(this.detailData))
    },
    // 回滚
    async rollBack() {
      this.form.thisVersion = this.prodlist.version
      console.log(this.prodlist)
      this.off(this.prodlist[0])
      const data = {
        projectId: this.projectId,
      }
      const versionRes1 = await getversion(data)
      const rollbackVersion = versionRes1.filter(val => {
        return val.version === this.form.rollBackVersion
      })
      rollbackVersion[0].prodControl = true
      rollbackVersion[0].token = this.token
      console.log(rollbackVersion[0])
      await delVersion(rollbackVersion[0].id)
       await addVersion(rollbackVersion[0])
      this.$message({
        message: '回滚成功',
        type: 'success'
      })
      const logInfo = {
        info: `回滚${this.projectId}项目：${rollbackVersion[0].version}版本`,
        id:Date.now()
      }
      await addInsertLog(logInfo)
      this.getVersionList()
      this.$emit('getversion')
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 50px 15px;
  }
}
.devepoment{
    margin-bottom: 30px;
}
.title{
  font-weight: 600;
}
.download:hover{
  cursor: pointer;
}
.drawer-container {
  // padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-time {
    float: right
  }
}
.drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 10px;
  }
  .line{
    display: inline;
  }
  .back-icon{
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    color: #1890ff;
    margin: 0 10px;
  }
  .btnCenter{
    text-align: center;
  }
</style>
