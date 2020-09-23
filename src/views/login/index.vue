<template>
  <div class="login-container">
    <!-- 登录界面 -->
    <el-form v-show="stateJudge" :rules="rules" ref="loginForm" :model="loginForm" autocomplete="off" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">登录界面</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          autocomplete="off"
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button style="width:100%;margin:0 0 30px 0;" @click.native.prevent="handleState">注册</el-button>
    </el-form>
    <!-- 注册界面 -->
    <el-form v-show="!stateJudge" :model="registForm" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">注册界面</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="username"
          autocomplete="off"
          v-model="registForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          autocomplete="off"
          :key="passwordType"
          ref="password"
          v-model="registForm.password"
          :type="passwordType"
          show-word-limit
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          autocomplete="off"
          :key="passwordType"
          v-model="passwordAgain"
          :type="passwordType"
          placeholder="请再次输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.native.prevent="handlePassword($event)"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" style="width:100%;margin:0 0 30px 0;" type="primary" native-type="submit" @click.native.prevent="handleRegist">注册</el-button>
      <el-button style="width:100%;margin:0 0 30px 0;" @click.native.prevent="handleState">返回</el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { Message } from 'element-ui'
import { regist } from '@/api/user'
export default {
  name: 'Login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateuserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    return {
      // 登录表单
      loginForm: {
        username: '',
        password: '',
      },
      // 注册表单
      registForm: {
        username: '',
        password: '',
      },
      // 总开关对注册表进行判断，只要有一项错误的就为false
      canRegist: false,
      // 再次输入密码
      passwordAgain: '',
      // 登录注册状态，用来跳转
      stateJudge: true,
      // 防抖
      timeout: null,
      // 节流
      vaild: true,
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      rules: {
        username: [
          {
            validator: validateuserName,
            trigger: 'blur',
          },
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    // 判断两次输入的密码是否一致
    handlePassword() {
      this.debounce(() => {
        if (this.passwordAgain !== this.registForm.password) {
          Message.error('两次输入的密码不一致！')
          this.canRegist = false
        } else {
          this.canRegist = true
        }
      }, 1000)
    },
    // 防抖
    debounce(fun, time) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        fun()
        this.timeout = false
      }, time)
    },
    // 注册登录页面的转换
    handleState() {
      if (this.stateJudge) {
        this.$refs.loginForm.resetFields()
      }
      this.stateJudge = !this.stateJudge
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 注册事件
    handleRegist() {
      this.loading = true
      if (this.canRegist === true) {
        this.registForm.userCode = this.registForm.username
        regist(this.registForm)
          .then((res) => {
            Message.success('注册成功')
            this.handleState()
            this.passwordAgain = ''
            this.registForm = {
              username: '',
              password: '',
            }
            this.loading = false
          })
          .catch((err) => {
            Message.error('注册失败，用户名重名')
            this.loading = false
          })
      } else {
        this.loading = false
        Message.error('请填写正确信息')
      }
    },
    // 登录事件
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((res) => {
              Message.error(res)
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .get-code {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
