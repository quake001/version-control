<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>操作日志</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click.native.prevent="goJournals">查看全部</el-button>
    </div>
    <div class="drawer-container">
      <div>
        <div v-for="(val,index) in logInfo" :key="index" class="drawer-item">
          <span>{{ val.data }}</span>
          <span class="drawer-time">{{ val.operationDate }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { queryLog } from '@/api/log'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      logInfo: [],
    }
  },
  computed: {
    ...mapGetters(['userId']),
  },
  created() {
    this.queryLogInfo()
  },
  methods: {
    goJournals() {
      this.$router.push('/logs/monitor')
    },
    async queryLogInfo() {
      const data = {
        userId: this.userId,
        page: 1,
        size: 5,
      }
      const logInfo = await queryLog(data)
      logInfo.forEach((val, index) => {
        if (index < 5) {
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
        }
        else return false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
