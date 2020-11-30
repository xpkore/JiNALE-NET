<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <form @submit.prevent="doTransfer">
      <h5>{{$t('label_1')}}</h5>
      <p class="input-field">
        <input type="text" inputmode="decimal" id="cardno" name="cardno" autocomplete="off" autofocus v-model="cardno" :disabled="fetching" @input="cardnoInput" :class="cardnoValid ? '' : 'invalid'" maxlength="20"/>
        <label for="cardno">{{$t('label_2')}}</label>
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
    "title": "Transfer data",
    "label_1": "Enter new card number",
    "label_2": "20-digit card no",
    "btn_1":"Transfer",
    "msg_1":"Data transfer failed",
    "msg_2":"Data transfered",
    "msg_3":"Unknown error occured"
  },
  "zh": {
    "title": "数据转移",
    "label_1": "输入新卡号",
    "label_2": "20位卡号",
    "btn_1":"变更卡号",
    "msg_1":"变更卡号失败",
    "msg_2":"卡号已更新",
    "msg_3":"出现未知错误"
  }
}
</i18n>

<script>
import { checkTokenValidity, authHeader } from '@/components/accUtils'

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
      fetch(this.$store.state.endpoint + '/transferCard?newCard=' + this.cardno, {
        method: 'GET',
        headers: authHeader()
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0) {
          this.errorStr = this.$t('msg_1') + `: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = this.$t('msg_2')
        this.$store.commit('updateCardNo', this.cardno)
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
