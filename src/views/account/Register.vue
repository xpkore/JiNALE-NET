<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <p>
      <span>{{$t('registered?')}}</span>
      <router-link to="/account/login">{{$t('login')}}</router-link>
    </p>
    <form @submit.prevent="doReg">
      <h5>{{$t('label_1')}}</h5>
      <p class="input-field">
        <input type="text" inputmode="decimal" id="cardno" name="cardno" autocomplete="off" autofocus v-model="cardno" :disabled="fetching || cardValidated" @input="cardnoInput" :class="cardnoValid ? '' : 'invalid'" maxlength="20"/>
        <label for="cardno">{{$t('label_2')}}</label>
      </p>
      <template v-if="cardValidated">
        <h5>{{$t('label_3')}}</h5>
        <p class="input-field">
          <input type="text" id="userid" name="userid" v-model="userid"/>
          <label for="userid">{{$t('label_4')}}</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd" name="pwd" v-model="pwd" :class="pwdValid ? '' : 'invalid'" @input="pwdInput"/>
          <label for="pwd">{{$t('label_5')}}</label>
        </p>
        <p class="input-field">
          <input type="password" autocomplete="new-password" minlength="8" id="pwd_confirm" name="pwd_confirm" v-model="pwdConfirm" :class="pwdConfirmed ? '' : 'invalid'" @input="pwdConfirmInput"/>
          <label for="pwd_confirm">{{$t('label_6')}}</label>
        </p>
      </template>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="cardValidated ? $t('btn_1') : $t('btn_2')" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Register new account",
    "registered?": "Already registered? ",
    "login": "Login here",
    "label_1": "Enter card number",
    "label_2": "20-digit card no",
    "label_3": "Enter user info",
    "label_4": "Account name",
    "label_5": "Password",
    "label_6": "Confirm password",
    "btn_1":"Register",
    "btn_2":"Check card",
    "msg_1":"Card validation failed",
    "msg_2":"Card validated, continue registration",
    "msg_3":"Unknown error occured",
    "msg_4":"Register failed",
    "msg_5":"Registered, loading..."
  },
  "zh": {
    "title": "注册新账号",
    "registered?": "注册过了？直接",
    "login": "登录",
    "label_1": "输入卡号",
    "label_2": "20位卡号",
    "label_3": "输入注册信息",
    "label_4": "用户名",
    "label_5": "密码",
    "label_6": "确认密码",
    "btn_1":"注册",
    "btn_2":"查找卡号",
    "msg_1":"卡号验证失败",
    "msg_2":"卡号已确认，继续进行注册",
    "msg_3":"出现未知错误",
    "msg_4":"注册失败",
    "msg_5":"已注册，读取中..."
  }
}
</i18n>

<script>
import { hashPassword, initMyInfo, fetchWithPostBody } from '@/components/accUtils'

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
  mounted () {
    let match
    if ((match = location.search.match(/\?cardno=(\d{20})/)) !== null) {
      document.getElementById('cardno').nextElementSibling.classList.add('active')
      this.cardno = match[1]
      this.doReg()
    }
  },
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
            this.errorStr = this.$t('msg_1')+`: [${d.code}] ${d.msg}`
            return
          }
          this.errorStr = this.$t('msg_2')
          setTimeout(() => { this.errorStr = '' }, 3000)
          this.cardValidated = true
        }).catch((e) => {
          this.errorStr = this.$t('msg_3')
          console.error(e)
        }).finally(() => {
          this.fetching = false
        })
      } else {
        this.pwdInput()
        this.pwdConfirmInput()
        // reg with pwd
        if (!this.pwdValid || !this.pwdConfirmed) {
          if (!this.pwdValid) {
            pwd.focus()
          } else {
            pwd_confirm.focus()
          }
          this.fetching = false
          return
        }
        const hashedPwd = hashPassword(this.pwd)
        let loginInfo
        fetchWithPostBody(
          this.$store.state.endpoint + '/register',
          `card=${this.cardno}&id=${encodeURIComponent(this.userid)}&hashed_pwd=${hashedPwd}`
        ).then(r => r.json()).then(d => {
          if (d.code !== 0 || !d.token) {
            this.errorStr = this.$t('msg_4')+`: [${d.code}] ${d.msg}`
            return
          }
          localStorage.authToken = d.token
          this.errorStr = this.$t('msg_5')
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
}
</script>
