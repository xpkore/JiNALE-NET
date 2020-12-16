import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endpoint: process.env.NODE_ENV === 'production' ? 'https://n.bzxyzt.cn/api' : location.origin.replace(/:\d+/, ':9989/api'),
    loggedIn: false,
    loginInfo: null,
    playlogResponse: null,
    playerScores: null
  },
  mutations: {
    updateLoginInfo (state, data) {
      if (data && data.uid) {
        for (let k in data.user_data) {
          data.user_data[k] = data.user_data[k].toString()
        }
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
    },
    savePlaylogResponse (state, r) {
      state.playlogResponse = r
    },
    setPlayerScores (state, ps) {
      state.playerScores = ps
    },
    saveOptions (state, data) {
      if (!state.loggedIn) return
      for (let k in data) {
        state.loginInfo.user_data[k] = data[k]
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
