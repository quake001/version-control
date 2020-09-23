<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('lastMonth')">
        <div class="card-panel-icon-wrapper icon-people">
          <i class="el-icon-download card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            历史下载
          </div>
          <count-to :start-val="0" :end-val="lastMonth" autoplay :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('thisMonth')">
        <div class="card-panel-icon-wrapper icon-message">
          <i class="el-icon-download card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本月下载
          </div>
          <count-to ref="ss" :start-val="0" :end-val="thisMonth" autoplay :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <i class="el-icon-download card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总下载
          </div>
          <count-to :start-val="0" :end-val="total" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    totalDownloads: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      thisMonth: 0,
      lastMonth: 0
    }
  },
  computed: {
    total() {
      return this.thisMonth + this.lastMonth
    }
  },
  watch: {
    totalDownloads: {
      deep: true,
      handler(val) {
        this.thisMonth = val.thisMonth
        this.lastMonth = val.lastMonth
      }
    }
  },
  mounted() {
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    change() {
      this.thisMonth = this.totalDownloads.thisMonth
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    border-radius: 10px;
  }

  .card-panel {
    border-radius: 10px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    // display: flex;
    // justify-content: space-around;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      // margin: 14px 0 0 14px;
      // padding: 16px;
      margin: 26px 0 26px 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
      font-weight: 600;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 10px 26px 0;
      // position: absolute;
      // right: 0;
      // top: 50%;
      // transform: translateY(-50%);
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  // .card-panel-description {
  //   display: none;
  // }

  // .card-panel-icon-wrapper {
  //   float: right !important;
  //   width: 100%;
  //   height: 100%;
  //   margin: 0 !important;

  //   .svg-icon {
  //     display: block;
  //     margin: 14px auto !important;
  //     float: none !important;
  //   }
  // }
}
</style>
