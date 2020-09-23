<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :sm="{span: 24, offset: 0}" :xs="{span: 24}">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-back back-icon" @click="backProject"></i>
            <span class="title">灰度监控</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  data() {
    return {
      key: ''
    }
  },
  mounted() {
    this.key = window.localStorage.getItem('key')
  },
  methods: {
    // 回退到项目页
    backProject() {
      this.$router.go(-1)
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
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.title{
  font-weight: 600;
}
.back-icon{
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    color: #1890ff;
    margin: 0 10px;
  }
</style>
