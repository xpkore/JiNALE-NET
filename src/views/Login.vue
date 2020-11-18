<template>
  <div>
    <h1>Login</h1>
    <p>
      <router-link to="/">Home</router-link>
    </p>
    <form @submit.prevent="doLogin">
      <p class="input-field">
        <input type="text" id="userid" name="userid" v-model="userid"/>
        <label for="userid">User ID</label>
      </p>
      <p class="input-field">
        <input type="password" id="pwd" name="pwd" v-model="pwd"/>
        <label for="pwd">Password</label>
      </p>
      <input :disabled="fetching === true" type="submit" value="Login" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<script>
import hashPassword from '../components/hashPassword'

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
        if (d.code !== 0) {
          this.$data.errorStr = `Login failed: [${d.code}] ${d.msg}`
          return
        }

        this.$data.errorStr = 'Logged in, loading...'
        return fetch(this.$store.state.endpoint + '/myinfo', {
          method: 'GET',
          credentials: 'include'
        }).then(r => r.json())

        // return new Promise((resolve, reject) => setTimeout(resolve, 1000))
      }).then(d => {
        if (d.code === 0) {
          loginInfo = d.data
        } else {
          this.$data.errorStr = `Login failed: [${d.code}] ${d.msg}`
        }

        // manual slow down
        return new Promise((resolve, reject) => setTimeout(resolve, 1000))
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        this.$data.fetching = false

        if (loginInfo) {
          this.$store.commit('updateLoginInfo', loginInfo)
          this.$router.push('/user/home')
        }
      })
    }
  }
}
</script>
