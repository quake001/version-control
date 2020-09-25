<template>
  <div class="devepoment">
    <el-row :gutter="0">
      <el-col :sm="{span: 24}" :xs="{span: 22, offset: 1}">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="title">灰度测试</span>
          </div>
          <el-table v-loading="listLoading" :data="grayList" element-loading-text="Loading" border fit highlight-current-row>
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
                <el-button style="margin:0 0 10px 0;" type="primary" @click.native.prevent="prod(scope.row)">上架</el-button>
                <el-button style="margin-left:0;" type="danger" @click.native.prevent="off(scope.row)">下架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addVersion, delVersion } from '@/api/table'
import { addInsertLog } from '@/api/log'
import { mapGetters } from 'vuex'
export default {
  props: ['grayData', 'projectId'],
  data() {
    return {
      listLoading: false,
      grayList: []
    }
  },
  computed: {
    ...mapGetters(['token', 'userId'])
  },
  watch: {
    grayData(newValue) {
      this.grayList = newValue
    }
  },
  methods: {
    // 查看详情
    detail(val) {
      this.$emit('showDetail', val)
    },
    // 下架
    async off(val) {
      val.grayControl = false
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
    // 上架
    prod(val) {
      this.$emit('grayProd', val, 'prod')
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
