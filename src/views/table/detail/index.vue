<template>
  <div class="dashboard-container">
    <prod-version
      v-show="showDetail?false:true"
      :version-data="versionData"
      :project-id="projectId"
      :prod-data="prodlist"
      @getversion="getVersionList"
      @offVersion="offVersion"
      @showDetail="show"
    />
    <gray-version
      v-show="showDetail?false:true"
      :gray-data="graylist"
      :project-id="projectId"
      @grayProd="grayProd"
      @showDetail="show"
      @offVersion="offVersion"
    />
    <div class="devepoment">
      <div v-show="showDetail?false:true">
        <el-row :gutter="0">
          <el-col :sm="{span: 24}" :xs="{span: 22, offset: 1}">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">开发版本</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click.native="addVersion">新建版本</el-button>
              </div>
              <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
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
                    <el-link target="_blank" :href="scope.row.uri" :underline="false" @click.native="setDownloads">{{ scope.row.uri }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="version" sortable label="版本" width="130" align="center">
                  <template slot-scope="scope">{{ scope.row.version }}</template>
                </el-table-column>
                <el-table-column label="编辑" width="180" align="center">
                  <template slot-scope="scope">
                    <el-button style="margin-bottom: 10px;" type="primary" @click.native.prevent="detail(scope.row)">查看详情</el-button>
                    <el-button style="margin:0 0 10px 0;" type="primary" @click.native.prevent="prod(scope.row)">发布版本</el-button>
                    <el-button style="margin:0 0 10px 0;" type="primary" @click.native.prevent="gray(scope.row)">灰度发布</el-button>
                    <el-button style="margin-left:0;" type="danger" @click.native.prevent="del(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-show="showDetail">
        <el-row :gutter="0">
          <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}">
            <el-card class="box-card" shadow="hover">
              <div class="drawer-item">
                <span>ID:</span>
                <span class="interval">{{ detailData.id }}</span>
              </div>
              <div class="drawer-item">
                <span>项目名:</span>
                <span class="interval">{{ detailData.projectId }}</span>
              </div>
              <div class="drawer-item">
                <span>版本号:</span>
                <span class="interval">{{ detailData.version }}</span>
              </div>
              <div class="drawer-item">
                <span>下载地址:</span>
                <el-link target="_blank" style="line" :underline="false" :href="detailData.uri" @click.native="setDownloads">{{ detailData.uri }}</el-link>
              </div>
              <div class="drawer-item">
                <span>机型适配:</span>
                <span class="interval">{{ detailData.modelOptions }}</span>
              </div>
              <div class="drawer-item">
                <span>系统适配:</span>
                <span class="interval">{{ detailData.systemOptions }}</span>
              </div>
              <div class="drawer-item">
                <span>支持热更新:</span>
                <span class="interval">{{ hotUpdate }}</span>
              </div>
              <div class="btnCenter">
                <el-button type="primary" @click="editVersion">编辑</el-button>
                <el-button type="primary" @click="showDetail=!showDetail">退出</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { addVersion, getversion, delVersion } from '@/api/table'
import { queryDownloads, addDownloads, updateDownloads, addInsertLog } from '@/api/log'
import { mapGetters } from 'vuex'
import prodVersion from './prodVersion'
import grayVersion from './grayVersion'
export default {
  components: {
    prodVersion,
    grayVersion,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      showDetail: false,
      detailData: [],
      projectId: '',
      prodlist: '',
      graylist: '',
      versionData: '',
    }
  },
  computed: {
    ...mapGetters(['token', 'userId']),
    hotUpdate() {
      return this.detailData.hotUpdate ? '支持' : '不支持'
    },
  },
  created() {
    this.projectId = this.$route.params.projectId
  },
  mounted() {
    this.getVersionList()
  },
  methods: {
    // 显示隐藏界面
    show(val) {
      this.detail(val)
    },
    // 增加下载量信息
    async setDownloads() {
      const queryData = {
        userId: this.userId,
      }
      const existence = await queryDownloads(queryData)
      if (existence.hits.length === 0) {
        const thisMonthdata = []
        for (let i = 1; i <= 31; i++) {
          thisMonthdata.push(0)
        }
        const addData = {
          userId: this.userId,
          thisMonth: thisMonthdata,
          lastMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
        const myDate = new Date()
        const getMonth = myDate.getMonth()
        const getday = myDate.getDate()
        addData.lastMonth[getMonth] += 1
        addData.thisMonth[getday - 1] += 1
        await addDownloads(addData)
      } else {
        const addData = {
          thisMonth: JSON.parse(existence.hits[0].thisMonth),
          lastMonth: JSON.parse(existence.hits[0].lastMonth),
          userId: this.userId,
        }
        const myDate = new Date()
        const getMonth = myDate.getMonth()
        const getday = myDate.getDate()
        addData.lastMonth[getMonth] += 1
        addData.thisMonth[getday - 1] += 1
        await updateDownloads(addData)
      }
    },
    // 删除该条信息
    del(val) {
      const { row } = val
      const delData = {
        projectId: row.projectId,
        version: row.version,
      }
      this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(async () => {
          const delRes = await delVersion(row.id)
          const logInfo = {
            info: `删除${this.projectId}项目：${delData.version}版本`,
            userId: this.userId,
          }
          await addInsertLog(logInfo)
          this.getVersionList()
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除',
          })
        })
    },
    // 编辑版本
    editVersion() {
      this.$router.push(`/version/addVersion/${this.detailData.projectId}`)
      window.sessionStorage.setItem('editVersion', JSON.stringify(this.detailData))
    },
    // 查看详情
    detail(val) {
      this.showDetail = !this.showDetail
      val.hotUpdate = JSON.parse(val.hotUpdate)
      this.detailData = val
    },
    // 下架操作
    offVersion() {
      this.getVersionList()
    },
    // 发布灰度
    async gray(val) {
      const data = {
        projectId: this.projectId,
      }
      const queryVersion = await getversion(data)
      if (this.grayControl(queryVersion).length !== 0) {
        this.$confirm('此操作将提交并覆盖灰度版本,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 1：先把线上灰度版本下架
            const graylist = this.grayControl(queryVersion)
            graylist[0].grayControl = false
            graylist[0].token = this.token
            await delVersion(graylist[0].id)
            await addVersion(graylist[0])
            const offfo = {
              info: `下架了${graylist[0].projectId}项目：${graylist[0].version}灰度版本`,
              od: Date.now(),
            }
            await addInsertLog(offfo)
            // 2：发布灰度版本
            val.grayControl = true
            val.token = this.token
            await delVersion(val.id)
            await addVersion(val)
            this.$message({
              message: '发布成功',
              type: 'success',
            })
            const logInfo = {
              info: `发布${val.projectId}项目：${val.version}灰度版本`,
              id:Date.now()
            }
            await addInsertLog(logInfo)
            this.getVersionList()
          })
          .catch(() => {
            this.$message({
              type: 'success',
              message: '已取消发布',
            })
          })
      } else {
        val.grayControl = true
        val.token = this.token
        await delVersion(val.id)
        await addVersion(val)
        this.$message({
          message: '发布成功',
          type: 'success',
        })
        const logInfo = {
          info: `发布${val.projectId}项目：${val.version}灰度版本`,
          id:Date.now()
        }
        await addInsertLog(logInfo)
        this.getVersionList()
      }
    },
    // 将灰度版本发布至线上版本
    async grayProd(val) {
      const data = {
        projectId: this.projectId,
      }
      const queryVersion = await getversion(data)
      if (this.prodControl(queryVersion).length !== 0) {
        this.$confirm('此操作将提交并覆盖线上版本,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 1：先把存在的线上版本下架
            const prodlist = this.prodControl(queryVersion)
            prodlist[0].prodControl = false
            prodlist[0].token = this.token
            await delVersion(prodlist[0].id)
            await addVersion(prodlist[0])
            const offfo = {
              info: `下架了${prodlist[0].projectId}项目：${prodlist[0].version}版本`,
              id:Date.now()
            }
            await addInsertLog(offfo)
            // 2：把当前灰度版本下架然后发布版本
            val.prodControl = true
            val.grayControl = false
            val.token = this.token
            await delVersion(val.id)
            await addVersion(val)
            this.$message({
              message: '上架成功',
              type: 'success',
            })
            const off = {
              info: `下架了${val.projectId}项目：${val.version}灰度版本`,
              id:Date.now()
            }
            await addInsertLog(off)
            const logInfo = {
              info: `发布${val.projectId}项目：${val.version}版本`,
              id:Date.now()
            }
            await addInsertLog(logInfo)
            this.getVersionList()
          })
          .catch(() => {
            this.$message({
              type: 'success',
              message: '已取消发布',
            })
          })
      } else {
        // 1:把当前灰度版本下架并且发布正式版本
        val.grayControl = false
        val.prodControl = true
        val.token = this.token
        await delVersion(val.id)
        await addVersion(val)
        this.$message({
          message: '下架成功',
          type: 'success',
        })
        const off = {
          info: `下架了${val.projectId}项目：${val.version}灰度版本`,
          id:Date.now()
        }
        await addInsertLog(off)
        const logInfo = {
          info: `发布${val.projectId}项目：${val.version}版本`,
          id:Date.now()
        }
        await addInsertLog(logInfo)
        this.getVersionList()
      }
    },
    // 发布版本
    async prod(val) {
      const data = {
        projectId: this.projectId,
      }
      const queryVersion = await getversion(data)
      if (this.prodControl(queryVersion).length !== 0) {
        this.$confirm('此操作将提交并覆盖线上版本,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 1：先把线上版本下架
            const prodlist = this.prodControl(queryVersion)
            console.log(prodlist)
            prodlist[0].prodControl = false
            prodlist[0].token = this.token
            await delVersion(prodlist[0].id)
            await addVersion(prodlist[0])
            const offfo = {
              id: Date.now(),
              info: `下架了${prodlist[0].projectId}项目：${prodlist[0].version}版本`,
            }
            await addInsertLog(offfo)
            // 2：发布版本
            await delVersion(val.id)
            val.prodControl = true
            val.token = this.token
            console.log(val)
            let a = await addVersion(val)
            this.$message({
              message: '成功',
              type: 'success',
            })
            const logInfo = {
              id: Date.now(),
              info: `发布${val.projectId}项目：${val.version}版本`,
            }
            await addInsertLog(logInfo)
            this.getVersionList()
          })
          .catch(() => {
            this.$message({
              type: 'success',
              message: '已取消发布',
            })
          })
      } else {
        await delVersion(val.id)
        val.prodControl = true
        val.token = this.token
        await addVersion(val)
        this.$message({
          message: '成功',
          type: 'success',
        })
        const logInfo = {
          id: Date.now(),
          info: `发布${val.projectId}项目：${val.version}版本`,
        }
        await addInsertLog(logInfo)
        this.getVersionList()
      }
    },
    // 获取该项目的版本号
    async getVersionList() {
      const data = {
        projectId: this.projectId,
      }
      const versionRes = await getversion(data)
      const Stand = []
      this.DuplicateName(versionRes).forEach((val) => {
        Stand.push(val.version)
      })
      this.versionData = Stand
      this.list = this.DuplicateName(versionRes)
      console.log(versionRes)
      this.prodlist = this.prodControl(versionRes)
      this.graylist = this.grayControl(versionRes)
    },
    // 点击新建版本
    addVersion() {
      this.$router.push(`/version/addVersion/${this.projectId}`)
    },
    // 判断是否重名的方法
    DuplicateName(data) {
      return data.filter((val) => {
        if (!val.grayControl) {
          val.grayControl = 'false'
        } else if (!val.prodControl) {
          val.prodControl = 'false'
        }
        return val.projectId === this.projectId && JSON.parse(val.prodControl) === false && JSON.parse(val.grayControl) === false
      })
    },
    // 判断是否存在开发版本
    prodControl(data) {
      return data.filter((val) => {
        return val.projectId === this.projectId && JSON.parse(val.prodControl) === true
      })
    },
    // 判断是否存在灰度版本
    grayControl(data) {
      return data.filter((val) => {
        return val.projectId === this.projectId && JSON.parse(val.grayControl) === true
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 50px 15px;
  }
}
.title {
  font-weight: 600;
}
.download:hover {
  cursor: pointer;
}
.drawer-container {
  // padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-time {
    float: right;
  }
}
.drawer-item {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  padding: 12px 10px;
}
.line {
  display: inline;
}

.btnCenter {
  text-align: center;
}
.interval {
  margin-left: 10px;
}
</style>
