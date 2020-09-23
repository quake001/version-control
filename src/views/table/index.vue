<template>
  <div class="dashboard-container">
    <div v-show="showDetail?false:true">
      <el-row>
        <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}" class="searchInput">
          <!-- <p>搜索项目</p> -->
          <el-input ref="focus" v-model="input" style="margin:10px 10px 10px 0" placeholder="请输入项目ID" clearable @keyup.native.prevent="onSearch($event)" />
        </el-col>
      </el-row>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column type="index" align="center" label="ID" width="130" />
        <el-table-column prop="projectId" label="项目名称" width="200">
          <template slot-scope="scope">{{ scope.row.projectId }}</template>
        </el-table-column>
        <el-table-column prop="textarea" label="项目介绍">
          <template slot-scope="scope">{{ scope.row.textarea }}</template>
        </el-table-column>
        <el-table-column label="编辑" width="130" align="center">
          <template slot-scope="scope">
            <el-button style="margin-bottom: 10px;" type="primary" @click.native.prevent="detail(scope.row)">管理</el-button>
            <el-button style="margin-left:0;" type="danger" @click.native.prevent="del(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getversion } from '@/api/table'
import { mapGetters } from 'vuex'
import { addInsertLog, queryProject, deleteProject } from '@/api/log'
export default {
  name: 'Table',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: null,
      listLoading: false,
      input: '',
      keyValue: '',
      timeout: null,
      showDetail: false,
      detailData: [],
      projectId: '',
    }
  },
  computed: {
    ...mapGetters(['token', 'userId']),
  },
  mounted() {
    this.$refs.focus.focus()
    this.fetchData(this.projectId)
  },
  methods: {
    // 搜索
    onSearch(e) {
      this.projectId = e.target.value
      if (e.target.value === '') {
        this.fetchData()
        clearTimeout(this.timeout)
      } else if (e.keyCode === 13) {
        this.fetchData()
        clearTimeout(this.timeout)
      } else {
        if (this.projectId !== '') {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.fetchData()
            this.timeout = false
          }, 1000)
        } else return
      }
    },
    // 获取列表
    async fetchData() {
      // 获取用户的项目目录信息
      this.listLoading = true
      const res = await queryProject(this.projectId)
      this.list = res
      this.listLoading = false
    },
    // 删除该条信息
    async del(val) {
      const { row } = val
      const delData = {
        projectId: row.projectId,
      }
      this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(async () => {
          const queryRes = await getversion(delData)
          console.log(queryRes)
          if (queryRes.length === 0 || this.DuplicateName(queryRes, row.projectId)) {
            delData.createDate = row.createDate
            const a = await deleteProject(delData)
            if (a.code === 200) {
              this.$message({
                message: `成功删除项目${row.projectId}`,
                type: 'success',
              })
              this.list = this.list.filter((val) => {
                return val.projectId !== row.projectId && val.createDate !== row.createDate
              })
              const logInfo = {
                info: `删除项目：${delData.projectId}`,
                userId: this.userId,
              }
              await addInsertLog(logInfo)
            }
          } else {
            this.$message({
              message: '该项目中有版本存在，无法直接删除',
              type: 'warning',
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除',
          })
        })
    },
    // 判断是否重名的方法
    DuplicateName(data, delProjectId) {
      return data.every((val) => {
        return val.projectId !== delProjectId
      })
    },
    // 查看详情
    detail(val) {
      this.$router.push(`/version/detail/${val.projectId}`)
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
</style>
