<template>
  <div>
    <h1>变更密码</h1>
    <form @submit.prevent="doChangePwd">
      <h5>输入新密码</h5>
      <p class="input-field">
        <input type="text" id="userid" name="userid" :value="userid" disabled/>
        <label for="pwd" class="active">用户名</label>
      </p>
      <p class="input-field">
        <input type="password" autocomplete="new-password" minlength="8" id="pwd" name="pwd" v-model="pwd" :class="pwdValid ? '' : 'invalid'" @input="pwdInput"/>
        <label for="pwd">密码</label>
      </p>
      <p class="input-field">
        <input type="password" autocomplete="new-password" minlength="8" id="pwd_confirm" name="pwd_confirm" v-model="pwdConfirm" :class="pwdConfirmed ? '' : 'invalid'" @input="pwdConfirmInput"/>
        <label for="pwd_confirm">确认密码</label>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" value="变更密码" />
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
    fetching: false,

    pwd: '',
    pwdValid: true,
    pwdConfirm: '',
    pwdConfirmed: true,

    errorStr: ''
  }),
  computed: {
    userid () {
      return this.$store.state.loginInfo.id
    }
  },
  methods: {
    pwdInput () {
      this.pwdValid = this.pwd.length >= 8
    },
    pwdConfirmInput () {
      this.pwdConfirmed = this.pwd === this.pwdConfirm
    },
    doChangePwd () {
      this.fetching = true
      this.pwdInput()
      this.pwdConfirmInput()
      if (!this.pwdValid || !this.pwdConfirmed) {
        this.fetching = false
        return
      }
      const hashedPwd = hashPassword(this.pwd)
      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)
      h.append('Content-Type', 'application/x-www-form-urlencoded')
      fetch(this.$store.state.endpoint + '/changePwd', {
        method: 'POST',
        headers: h,
        body: `hashed_pwd=${hashedPwd}`
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0 || !d.token) {
          this.errorStr = `变更密码失败: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = '密码已更新'
        localStorage.authToken = d.token
        setTimeout(() => { this.$router.push('/player/home') }, 1000)
      }).catch((e) => {
        this.errorStr = '出现未知错误'
        console.error(e)
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>
