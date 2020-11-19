<template>
  <div class="home">
    <h2>Welcome to JiNALE-net</h2>
    <h5>A.K.A. My AiMe-CN</h5>
    <div class="row">
      <div class="col s1"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/register">Register</router-link>
      <div class="col s2"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/login">Login</router-link>
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
      this.$router.replace('/user/home')
    }
  }
}
</script>
