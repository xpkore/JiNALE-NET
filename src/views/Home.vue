<template>
  <div class="home">
    <h2>{{$t('welcome')}}</h2>
    <h5>{{$t('aka')}}</h5>
    <div class="row"></div>
    <div class="row"></div>
    <div class="row">
      <div class="col s1"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/account/register">{{$t('register')}}</router-link>
      <div class="col s2"></div>
      <router-link class="col s4 waves-effect waves-light btn" to="/account/login">{{$t('login')}}</router-link>
      <div class="col s1"></div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "welcome": "Welcome to JiNALE-net",
    "aka": "(A.K.A MyAiMe-CN)",
    "register": "New register",
    "login": "Login"
  },
  "zh": {
    "welcome": "欢迎来到 JiNALE-net",
    "aka": "（又名 MyAiMe-CN）",
    "register": "注册新账户",
    "login": "登录"
  }
}
</i18n>

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
