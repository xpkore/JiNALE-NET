<template>
  <div>
    <h1>登录</h1>
    <p>
      <span>还没注册？现在就可以</span>
      <router-link to="/register">注册</router-link>
      <span>！</span>
    </p>
    <form @submit.prevent="doLogin">
      <p class="input-field">
        <input type="text" id="userid" name="userid" v-model="userid"/>
        <label for="userid">用户名</label>
      </p>
      <p class="input-field">
        <input type="password" id="pwd" name="pwd" v-model="pwd"/>
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
import hashPassword from '@/components/hashPassword'

export default {
  data: () => ({
    userid: '',
    pwd: '',
    fetching: false,
    errorStr: ''
  }),
  methods: {
    doLogin (e) {
      this.$data.errorStr = ''
      this.$data.fetching = true
      const hashedPwd = hashPassword(this.$data.pwd)
      let loginInfo
      fetch(this.$store.state.endpoint + '/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        body: `id=${encodeURIComponent(this.$data.userid)}&hashed_pwd=${hashedPwd}`,
        credentials: 'include'
      }).then(r => r.json()).then(d => {
        if (d.code !== 0 || !d.token) {
          this.$data.errorStr = `登录失败: [${d.code}] ${d.msg}`
          return
        }

        localStorage.authToken = d.token
        this.$data.errorStr = '已登录，读取中...'
        const h = new Headers()
        h.append('Authorization', 'Bearer ' + localStorage.authToken)
        return fetch(this.$store.state.endpoint + '/myinfo', {
          method: 'GET',
          headers: h
        }).then(r => r.json())
      }).then(d => {
        if (d.code === 0) {
          loginInfo = d.data
        } else {
          this.$data.errorStr = `登录失败: [${d.code}] ${d.msg}`
        }
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        this.$data.fetching = false

        if (loginInfo) {
          this.$store.commit('updateLoginInfo', loginInfo)
          this.$router.push('/player/home')
        }
      })
    }
  }
}
</script>
