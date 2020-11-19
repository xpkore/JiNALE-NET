<template>
  <div class="home">
    <h2>欢迎来到 JiNALE-net</h2>
    <h5>（又名 MyAiMe-CN）</h5>
    <div class="row"></div>
    <div class="row"></div>
    <div class="row">
      <div class="col s1"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/register">注册新账户</router-link>
      <div class="col s2"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/login">登录</router-link>
      <div class="col s1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  beforeMount: function () {
    if (this.$store.state.loggedIn) {
      this.$router.replace('/player/home')
    }
  }
}
</script>
