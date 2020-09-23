import {
  login,
  // getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import router from '@/router'
import { Message } from 'element-ui'
const getDefaultState = () => {
  return {
    token: getToken(),
    userData: '',
    userId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERDATA: (state, name) => {
    state.userData = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        if(response.length===0){
          reject('账号或密码错误')
        }
        commit('SET_TOKEN', response[0].access_token)
        setToken(response[0].access_token)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo().then(response => {
  //       const {
  //         user
  //       } = response.principal
  //       commit('SET_USERDATA', user)
  //       commit('SET_USERID', user.id)
  //       resolve(response)
  //     }).catch(() => {
  //       Message({
  //         message: '身份过期重新登录',
  //         type: 'warning'
  //       })
  //       router.push('/login')
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //     })
  //   })
  // },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
