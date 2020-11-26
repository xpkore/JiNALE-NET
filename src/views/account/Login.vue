<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <p>
      <span>{{$t('not_registered?')}}</span>
      <router-link to="/account/register">{{$t('register')}}</router-link>
    </p>
    <form @submit.prevent="doLogin">
      <p class="input-field">
        <input type="text" id="userid" name="userid" autocomplete="username" autofocus v-model="userid"/>
        <label for="userid">{{$t('label_1')}}</label>
      </p>
      <p class="input-field">
        <input type="password" id="pwd" name="pwd" autocomplete="current-password" v-model="pwd"/>
        <label for="pwd">{{$t('label_2')}}</label>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="$t('btn_1')" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Login",
    "not_registered?": "Not registered? ",
    "register": "Register here",
    "label_1": "Account name",
    "label_2": "Password",
    "btn_1":"Login",
    "msg_1":"Login failed",
    "msg_2":"Logged in, loading...",
    "msg_3":"Unkonwn error occured"
  },
  "zh": {
    "title": "注册新账号",
    "not_registered?": "还没注册？现在就可以",
    "register": "注册",
    "label_1": "用户名",
    "label_2": "密码",
    "btn_1":"登录",
    "msg_1":"登录失败",
    "msg_2":"已登录，读取中...",
    "msg_3":"出现未知错误"
  }
}
</i18n>

<script>
import { hashPassword, initMyInfo } from '@/components/accUtils'

export default {
  data: () => ({
    userid: '',
    pwd: '',
    fetching: false,
    errorStr: ''
  }),
  methods: {
    doLogin (e) {
      this.errorStr = ''
      if (this.userid === '') {
        userid.focus()
        return
      } else if (this.pwd === '') {
        pwd.focus()
        return
      }
      this.fetching = true
      const hashedPwd = hashPassword(this.pwd)
      let loginInfo
      fetch(this.$store.state.endpoint + '/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        body: `id=${encodeURIComponent(this.userid)}&hashed_pwd=${hashedPwd}`,
        credentials: 'include'
      }).then(r => r.json()).then(d => {
        if (d.code !== 0 || !d.token) {
          this.errorStr = this.$t('msg_1') + `: [${d.code}] ${d.msg}`
          return
        }

        localStorage.authToken = d.token
        this.errorStr = this.$t('msg_2')
        return initMyInfo.call(this).then(() => {
          if (!this.$store.state.loggedIn) throw new Error('init myinfo failed')
        })
      }).catch((e) => {
        this.errorStr = this.$t('msg_3')
        console.error(e)
      }).finally(() => {
        this.fetching = false

        if (this.$store.state.loggedIn) {
          this.$router.push('/player/home')
        }
      })
    }
  }
}
</script>
