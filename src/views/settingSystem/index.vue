<template>
  <div class="dashboard-container">
    <el-row :gutter="0">
      <el-col :sm="{span: 16, offset: 4}" :xs="{span: 22, offset: 1}">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="title">系统布局配置</span>
          </div>
          <div class="drawer-container">
            <div>
              <div class="drawer-item">
                <span>主题颜色</span>
                <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
              </div>

              <div class="drawer-item">
                <span>开启 Tags-View</span>
                <el-switch v-model="tagsView" class="drawer-switch" />
              </div>

              <div class="drawer-item">
                <span>固定 Header</span>
                <el-switch v-model="fixedHeader" class="drawer-switch" />
              </div>

              <div class="drawer-item">
                <span>侧边栏 Logo</span>
                <el-switch v-model="sidebarLogo" class="drawer-switch" />
              </div>

            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="18" :offset="3" class="cardDown">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="international" />
            <span>切换语言</span>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
export default {
  name: 'SettingSystem',
  components: { ThemePicker },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
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
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
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

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
.title{
  font-weight: 600;
}
.cardDown{
  margin-top: 10px;
}
</style>
