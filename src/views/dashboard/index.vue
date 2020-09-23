<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :sm="{span: 22, offset: 1}" :xs="{span: 22, offset: 1}">
        <panel-group :total-downloads="totalDownloads" @handleSetLineChartData="handleSetLineChartData" />
      </el-col>
    </el-row>
    <el-row style="margin-bottom:32px;">
      <el-col :sm="{span: 22, offset: 1}" :xs="{span: 22, offset: 1}">
        <el-card style="background:#fff;" class="box-card" shadow="hover">
          <line-chart :chart-data="lineChartData" />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="{span: 22, offset: 1}" :xs="{span: 22, offset: 1}">
        <journal />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { queryDownloads } from '@/api/log'
import Journal from './components/journal'
const lineChartData = {
  lastMonth: {
    title: 'last',
    expectedData: [],
    rowData: []
  },
  thisMonth: {
    title: 'this',
    expectedData: [],
    rowData: []
  },
  totalMonth: {
    expectedData: []
  }
}
export default {
  name: 'Dashboard',
  components: {
    PanelGroup, LineChart, Journal
  },
  data() {
    return {
      lineChartData: lineChartData.lastMonth,
      totalDownloads: {
        thisMonth: '',
        lastMonth: ''
      }
    }
  },
  computed: {
  },
  created () {
    this.getDownloadsList()
  },

  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    // 获取下载表的信息，将数据传递给组件
    async getDownloadsList() {
      const queryData = {
        userId: this.userId
      }
      const res = await queryDownloads(queryData)
      if (res.length !== 0) {
        const { lastMonth, thisMonth } = res[0]
        const myDate = new Date()
        const getMonth = myDate.getMonth()
        const toMonth = JSON.parse(lastMonth).splice(getMonth - 1, 1)
        this.totalDownloads.lastMonth = toMonth.reduce(this.getSum)
        this.totalDownloads.thisMonth = JSON.parse(lastMonth).reduce(this.getSum)
        lineChartData.lastMonth.expectedData = JSON.parse(lastMonth)
        lineChartData.thisMonth.expectedData = JSON.parse(thisMonth)
        if (lineChartData.thisMonth.rowData.length === 0 && lineChartData.lastMonth.rowData.length === 0) {
          for (let i = 1; i <= 31; i++) {
            lineChartData.thisMonth.rowData.push(i + '号')
          }
          for (let i = 1; i <= 12; i++) {
            lineChartData.lastMonth.rowData.push(i + '月')
          }
        }
      } else return
    },
    getSum(total, num) {
      return total + num
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding-top: 50px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

</style>
