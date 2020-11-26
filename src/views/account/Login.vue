<template>
  <div>
    <h3>登录</h3>
    <p>
      <span>还没注册？现在就可以</span>
      <router-link to="/account/register">注册</router-link>
      <span>！</span>
    </p>
    <form @submit.prevent="doLogin">
      <p class="input-field">
        <input type="text" id="userid" name="userid" autocomplete="username" autofocus v-model="userid"/>
        <label for="userid">用户名</label>
      </p>
      <p class="input-field">
        <input type="password" id="pwd" name="pwd" autocomplete="current-password" v-model="pwd"/>
        <label for="pwd">密码</label>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" value="登录" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

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
          this.errorStr = `登录失败: [${d.code}] ${d.msg}`
          return
        }

        localStorage.authToken = d.token
        this.errorStr = '已登录，读取中...'
        return initMyInfo.call(this)
      }).then(() => {
        if (!this.$store.state.loggedIn) throw new Error('init myinfo failed')
      }).catch((e) => {
          this.errorStr = `出现未知错误`
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
