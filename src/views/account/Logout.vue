<template>
  <div>
    <h5>{{$t('title')}}</h5>
    <p>{{$t('label_1')}}</p>
    <p>{{$t('label_2')}}</p>
    <div class="row">
      <div class="col s1"></div>
      <router-link to="/player/home" class="col s4 waves-effect waves-light btn">{{$t('btn_1')}}</router-link>
      <div class="col s2"></div>
      <a class="col s4 waves-effect waves-light btn red" @click="doLogout">{{$t('btn_2')}}</a>
      <div class="col s1"></div>
    </div>
    <p v-if="doneLogout">
      <span>{{$t('label_3')}}</span>
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Log out",
    "label_1": "You are about to log out from Ji-Net",
    "label_2": "Confirm?",
    "label_3": "You are now logged out",
    "btn_1":"Return",
    "btn_2":"Log out"
  },
  "zh": {
    "title": "退出登录",
    "label_1": "将要退出当前账号的登录",
    "label_2": "确定要继续吗？",
    "label_3": "已退出",
    "btn_1":"返回",
    "btn_2":"退出登录"
  }
}
</i18n>

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
      this.doneLogout = true
      new Promise((resolve, reject) => setTimeout(resolve, 1000)).then(() => {
        this.$store.commit('updateLoginInfo')
        this.$router.push('/')
      })
    }
  }
}
</script>
