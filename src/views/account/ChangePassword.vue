<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <PlayerNavBar></PlayerNavBar>
    <form @submit.prevent="doChangePwd">
      <h5>{{$t('label_1')}}</h5>
      <p class="input-field">
        <input type="text" id="userid" name="userid" :value="userid" disabled/>
        <label for="pwd" class="active">{{$t('label_2')}}</label>
      </p>
      <p class="input-field">
        <input type="password" autocomplete="new-password" minlength="8" id="pwd" name="pwd" autofocus v-model="pwd" :class="pwdValid ? '' : 'invalid'" @input="pwdInput"/>
        <label for="pwd">{{$t('label_3')}}</label>
      </p>
      <p class="input-field">
        <input type="password" autocomplete="new-password" minlength="8" id="pwd_confirm" name="pwd_confirm" v-model="pwdConfirm" :class="pwdConfirmed ? '' : 'invalid'" @input="pwdConfirmInput"/>
        <label for="pwd_confirm">{{$t('label_4')}}</label>
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
    "title": "Change password",
    "label_1": "Enter new password",
    "label_2": "Account name",
    "label_3": "New password",
    "label_4": "Confirm new password",
    "btn_1":"Change password",
    "msg_1":"Change password failed",
    "msg_2":"Password updated",
    "msg_3":"Unkonwn error occured"
  },
  "zh": {
    "title": "变更密码",
    "label_1": "输入新密码",
    "label_2": "用户名",
    "label_3": "密码",
    "label_4": "确认密码",
    "btn_1":"变更密码",
    "msg_1":"变更密码失败",
    "msg_2":"密码已更新",
    "msg_3":"出现未知错误"
  }
}
</i18n>

<script>
import { hashPassword, checkTokenValidity, fetchWithPostBody } from '@/components/accUtils'
import PlayerNavBar from '@/components/PlayerNavBar'

export default {
  components: {
    PlayerNavBar
  },
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
      fetchWithPostBody(
        this.$store.state.endpoint + '/changePwd',
        `hashed_pwd=${hashedPwd}`
      ).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0 || !d.token) {
          this.errorStr = this.$t('msg_1') + `: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = this.$t('msg_2')
        localStorage.authToken = d.token
        setTimeout(() => { this.$router.push('/player/home') }, 1000)
      }).catch((e) => {
        this.errorStr = this.$t('msg_3')
        console.error(e)
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>
