<template>
  <div class="dashboard-container">
    <el-row :gutter="0">
      <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>操作日志</span>
          </div>
          <div class="drawer-container">
            <div>
              <div v-for="(val,index) in logInfo" :key="index" class="drawer-item">
                <span>{{ val.data }}</span>
                <span class="drawer-time">{{ val.operationDate }}</span>
              </div>
            </div>
          </div>
          <el-pagination
            background
            layout="pager"
            :total='totalList'
            style="margin-top: 10px;text-align: center;"
            @current-change="changePage"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryLog, deleteLog } from '@/api/log'
export default {
  data() {
    return {
      logInfo: [],
      totalList: 0,
      startTotal:0,
      endTotal:10,
      value:0
    }
  },
  computed: {
  },
  created() {
    this.queryLogInfo(1)

  },
  methods: {
    // 对获取到的操作日志数据进行渲染，并修改日期
    async queryLogInfo(value) {
      const logInfo = await queryLog()
      this.totalList = logInfo.length
      this.startTotal=(value-1)*10
      this.endTotal=value*10
      this.logInfo = []
      logInfo.forEach((val, index) => {
        if (index >= this.startTotal && index < this.endTotal) {
          let minute = Math.floor((Date.now() - val.id) / 60000)
          let hour
          let day
          if (minute === 0) {
            minute = 1
          }
          if (minute >= 1 && minute < 60) {
            minute = `${minute}分钟前`
          } else if (minute >= 60 && minute < 60 * 24) {
            hour = Math.floor(minute / 60)
            minute = `${hour}小时前`
          } else if (minute >= 60 * 24) {
            day = Math.floor(minute / (60 * 24))
            minute = `${day}天前`
          }
          const info = {
            data: val.info,
            operationDate: minute,
          }
          this.logInfo.push(info)
        } else return false
      })
    },
    changePage(val) {
      this.queryLogInfo(val)
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

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 10px;
  }
  .drawer-item:hover {
    background: #f0f2f5;
    border-radius: 10px;
  }
  .drawer-time {
    float: right;
  }
}
</style>
