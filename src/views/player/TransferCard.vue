<template>
  <div>
    <h1>数据转移</h1>
    <form @submit.prevent="doTransfer">
      <h5>输入新卡号</h5>
      <p class="input-field">
        <input type="text" inputmode="decimal" id="cardno" name="cardno" v-model="cardno" :disabled="fetching" @input="cardnoInput" :class="cardnoValid ? '' : 'invalid'" maxlength="20"/>
        <label for="cardno">20位卡号</label>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" value="变更卡号" />
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<script>
import { checkTokenValidity } from '@/components/accUtils'

export default {
  data: () => ({
    fetching: false,
    cardno: '',
    cardnoValid: true,
    errorStr: ''
  }),
  methods: {
    cardnoInput () {
      this.cardnoValid = this.cardno.match(/^\d{20}$/) !== null
    },
    doTransfer () {
      this.cardnoInput()
      if (!this.cardnoValid) {
        this.fetching = false
        return
      }
      // check card
      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)
      fetch(this.$store.state.endpoint + '/transferCard?newCard=' + this.cardno, {
        method: 'GET',
        headers: h
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0) {
          this.errorStr = `变更卡号失败: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = '卡号已更新'
        this.$store.commit('updateCardNo', this.cardno)
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
