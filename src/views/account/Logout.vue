<template>
  <div>
    <h5>退出登录</h5>
    <p>将要退出当前账号的登录</p>
    <p>确定要继续吗？</p>
    <div class="row">
      <div class="col s1"></div>
      <router-link to="/player/home" class="col s4 waves-effect waves-light btn">返回</router-link>
      <div class="col s2"></div>
      <a class="col s4 waves-effect waves-light btn red" :class="{ disabled:fetching === true }" @click="doLogout">退出登录</a>
      <div class="col s1"></div>
    </div>
    <p v-if="doneLogout">
      <span>已退出</span>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    doneLogout: false
  }),
  mounted () {
    if (!this.$store.state.loggedIn) {
      this.$router.replace('/')
    }
  },
  methods: {
    doLogout () {
      delete localStorage.authToken
      new Promise((resolve, reject) => setTimeout(resolve, 1000)).then(() => {
        this.$store.commit('updateLoginInfo')
        this.$router.push('/')
      })
    }
  }
}
</script>
