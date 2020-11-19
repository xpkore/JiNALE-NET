import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endpoint: process.env.NODE_ENV === 'production' ? 'https://n.bzxyzt.cn/api' : 'http://localhost:9989/api',
    loggedIn: false,
    loginInfo: null
  },
  mutations: {
    updateLoginInfo (state, data) {
      if (data && data.uid) {
        state.loggedIn = true
        state.loginInfo = data
      } else {
        state.loggedIn = false
        state.loginInfo = null
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
