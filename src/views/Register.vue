<template>
  <div>
    <h1>Register</h1>
    <p>
      <span>Already registered? </span>
      <router-link to="/login">Login</router-link>
    </p>
    <form @submit.prevent="doReg">
      <h5>Enter Card Number</h5>
      <p class="input-field">
        <input type="text" id="cardno" name="cardno" v-model="cardno" :disabled="fetching || cardValidated"/>
        <label for="cardno">Card NO</label>
      </p>
      <template v-if="cardValidated">
        <p class="input-field">
          <input type="text" id="userid" name="userid" v-model="userid"/>
          <label for="userid">User ID</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd" name="pwd" v-model="pwd" :class="pwdValid ? '' : 'invalid'" @input="pwdInput"/>
          <label for="pwd">Password</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd_confirm" name="pwd_confirm" v-model="pwdConfirm" :class="pwdConfirmed ? '' : 'invalid'" @input="pwdConfirmInput"/>
          <label for="pwd_confirm">Confirm Password</label>
        </p>
      </template>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="cardValidated ? 'Register' : 'Check Card'" />
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
    cardValidated: false,
    fetching: false,
    cardno: '',

    userid: '',
    pwd: '',
    pwdValid: true,
    pwdConfirm: '',
    pwdConfirmed: true,

    errorStr: ''
  }),
  methods: {
    pwdInput (e) {
      this.$data.pwdValid = this.$data.pwd.length >= 8
    },
    pwdConfirmInput (e) {
      this.$data.pwdConfirmed = this.$data.pwd === this.$data.pwdConfirm
    },
    doReg (e) {
      this.$data.fetching = true
      if (!this.$data.cardValidated) {
        // check card
        fetch(this.$store.state.endpoint + '/chkcard?card=' + this.$data.cardno).then(r => r.json()).then(d => {
          if (d.code !== 0) {
            this.$data.errorStr = `Card validation failed: [${d.code}] ${d.msg}`
            return
          }
          this.$data.errorStr = 'Card validated, proceed with registring'
          setTimeout(() => { this.$data.errorStr = '' }, 3000)
          this.$data.cardValidated = true
        }).catch((e) => {
          this.$data.errorStr = 'Unknown error occured'
          console.error(e)
        }).finally(() => {
          this.$data.fetching = false
        })
      } else {
        // reg with pwd
        if (!this.$data.pwdValid || !this.$data.pwdConfirmed) return
        const hashedPwd = hashPassword(this.$data.pwd)
        let loginInfo
        fetch(this.$store.state.endpoint + '/register', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          body: `card=${this.$data.cardno}&id=${encodeURIComponent(this.$data.userid)}&hashed_pwd=${hashedPwd}`,
          credentials: 'include'
        }).then(r => r.json()).then(d => {
          if (d.code !== 0) {
            this.$data.errorStr = `Register failed: [${d.code}] ${d.msg}`
            return
          }
          this.$data.errorStr = 'Registered, loading...'
          return fetch(this.$store.state.endpoint + '/myinfo', {
            method: 'GET',
            credentials: 'include'
          }).then(r => r.json())
        }).then(d => {
          if (d.code === 0) {
            loginInfo = d.data
          } else {
            this.$data.errorStr = `Login failed: [${d.code}] ${d.msg}`
          }

          // manual slow down
          return new Promise((resolve, reject) => setTimeout(resolve, 1000))
        }).catch((e) => {
          this.$data.errorStr = 'Unknown error occured'
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
}
</script>
