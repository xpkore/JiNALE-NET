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
    },
    updateCardNo (state, newCard) {
      if (state.loggedIn) {
        state.loginInfo.card.id = newCard
      }
    },
    dailyBonus (state) {
      if (state.loggedIn) {
        state.loginInfo.have_daily_bonus = false
        state.loginInfo.user_data.event_point += 10
      }
    },
    updatePlayerName (state, newName) {
      if (state.loggedIn) {
        state.loginInfo.user_data.user_name = newName
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
