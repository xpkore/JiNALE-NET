<template>
  <div>
    <h1>注册新账号</h1>
    <p>
      <span>注册过了？直接</span>
      <router-link to="/account/login">登录</router-link>
    </p>
    <form @submit.prevent="doReg">
      <h5>输入卡号</h5>
      <p class="input-field">
        <input type="text" inputmode="decimal" id="cardno" name="cardno" v-model="cardno" :disabled="fetching || cardValidated" @input="cardnoInput" :class="cardnoValid ? '' : 'invalid'" maxlength="20"/>
        <label for="cardno">20位卡号</label>
      </p>
      <template v-if="cardValidated">
        <p class="input-field">
          <input type="text" id="userid" name="userid" v-model="userid"/>
          <label for="userid">用户名</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd" name="pwd" v-model="pwd" :class="pwdValid ? '' : 'invalid'" @input="pwdInput"/>
          <label for="pwd">密码</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd_confirm" name="pwd_confirm" v-model="pwdConfirm" :class="pwdConfirmed ? '' : 'invalid'" @input="pwdConfirmInput"/>
          <label for="pwd_confirm">确认密码</label>
        </p>
      </template>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="cardValidated ? '注册' : '查找卡号'" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<script>
import { hashPassword, checkTokenValidity } from '@/components/accUtils'

export default {
  data: () => ({
    cardValidated: false,
    fetching: false,
    cardno: '',
    cardnoValid: true,

    userid: '',
    pwd: '',
    pwdValid: true,
    pwdConfirm: '',
    pwdConfirmed: true,

    errorStr: ''
  }),
  methods: {
    cardnoInput () {
      this.cardnoValid = this.cardno.match(/^\d{20}$/) !== null
    },
    pwdInput () {
      this.pwdValid = this.pwd.length >= 8
    },
    pwdConfirmInput () {
      this.pwdConfirmed = this.pwd === this.pwdConfirm
    },
    doReg () {
      this.fetching = true
      if (!this.cardValidated) {
        this.cardnoInput()
        if (!this.cardnoValid) {
          this.fetching = false
          return
        }
        // check card
        fetch(this.$store.state.endpoint + '/chkcard?card=' + this.cardno).then(r => r.json()).then(d => {
          if (d.code !== 0) {
            this.errorStr = `卡号验证失败: [${d.code}] ${d.msg}`
            return
          }
          this.errorStr = '卡号已确认，继续进行注册'
          setTimeout(() => { this.errorStr = '' }, 3000)
          this.cardValidated = true
        }).catch((e) => {
          this.errorStr = '出现未知错误'
          console.error(e)
        }).finally(() => {
          this.fetching = false
        })
      } else {
        this.pwdInput()
        this.pwdConfirmInput()
        // reg with pwd
        if (!this.pwdValid || !this.pwdConfirmed) {
          this.fetching = false
          return
        }
        const hashedPwd = hashPassword(this.pwd)
        let loginInfo
        fetch(this.$store.state.endpoint + '/register', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          body: `card=${this.cardno}&id=${encodeURIComponent(this.userid)}&hashed_pwd=${hashedPwd}`
        }).then(r => r.json()).then(d => {
          if (d.code !== 0 || !d.token) {
            this.errorStr = `注册失败: [${d.code}] ${d.msg}`
            return
          }
          localStorage.authToken = d.token
          this.errorStr = '已注册，读取中...'
          const h = new Headers()
          h.append('Authorization', 'Bearer ' + localStorage.authToken)
          return fetch(this.$store.state.endpoint + '/myinfo', {
            method: 'GET',
            headers: h
          }).then(checkTokenValidity.bind(this))
        }).then(d => {
          if (d.code === 0) {
            loginInfo = d.data
          } else {
            this.errorStr = `登录失败: [${d.code}] ${d.msg}`
          }
        }).catch((e) => {
          this.errorStr = '出现未知错误'
          console.error(e)
        }).finally(() => {
          this.fetching = false

          if (loginInfo) {
            this.$store.commit('updateLoginInfo', loginInfo)
            this.$router.push('/player/home')
          }
        })
      }
    }
  }
}
</script>