<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <PlayerNavBar></PlayerNavBar>
    <form @submit.prevent="saveOptions" class="narrow-column">
      <div class="row flex flex-row option-item">
        <div>{{$t('label_1')}}</div>
        <div class="switch"><label><input type="checkbox" v-model="disp_rate"><span class="lever"></span></label></div>
      </div>
      <div class="row flex flex-row option-item">
        <div>{{$t('label_2')}}</div>
        <div class="input-field"><select v-model="disp_judge_style" id="disp_judge_style">
          <option value="0">{{$t('label_3')}}</option>
          <option value="1">{{$t('label_4')}}</option>
          <option value="2">{{$t('label_5')}}</option>
        </select></div>
      </div>
      <div class="row flex flex-row option-item">
        <div>{{$t('label_6')}}</div>
        <div class="switch"><label><input type="checkbox" v-model="disp_rank"><span class="lever"></span></label></div>
      </div>
      <div class="row flex flex-row option-item">
        <div>{{$t('label_7')}}</div>
        <div class="switch"><label><input type="checkbox" v-model="disp_total_lv"><span class="lever"></span></label></div>
      </div>
      <div class="row center-align">
        <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="$t('btn_1')" />
      </div>
    </form>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Game Options",
    "label_1": "Show rating",
    "label_2": "Judge Style",
    "label_3": "Disable",
    "label_4": "Enable, include into rating",
    "label_5": "Enable, exclude from rating",
    "label_6": "Show course rank",
    "label_7": "Show total character level",
    "btn_1":"Update",
    "msg_1":"Update game options failed",
    "msg_2":"Game options updated",
    "msg_3":"Unknown error occured"
  },
  "zh": {
    "title": "游戏设置",
    "label_1": "显示rating",
    "label_2": "严判",
    "label_3": "禁用",
    "label_4": "开启，计入ra",
    "label_5": "开启，不计入ra",
    "label_6": "显示段位",
    "label_7": "显示看板总等级",
    "btn_1":"保存",
    "msg_1":"保存设置失败",
    "msg_2":"设置已保存",
    "msg_3":"出现未知错误"
  }
}
</i18n>

<style>
.option-item {
	align-items: center;
  height:60px;
}
.option-item>:first-child {
  width: calc(100% - 150px)
}
.option-item>:last-child {
  width: 150px;
  text-align: center;
  display:grid;
}
.switch label .lever {
  background-color:#656565
}
</style>

<script>
import { checkTokenValidity, fetchWithPostBody } from '@/components/accUtils'
import PlayerNavBar from '@/components/PlayerNavBar'
import M from 'materialize-css'

export default {
  components: {
    PlayerNavBar
  },
  data: () => ({
    fetching: false,
    errorStr: '',
    disp_rate: false,
    disp_judge_style: '0',
    disp_rank: false,
    disp_total_lv: false,
  }),
  mounted () {
    const userData = this.$store.state.loginInfo.user_data
    this.disp_rate = userData.disp_rate === '1'
    this.disp_judge_style = userData.disp_judge_style
    this.disp_rank = userData.disp_rank === '1'
    this.disp_total_lv = userData.disp_total_lv === '1'
    document.getElementById('disp_judge_style').options[this.disp_judge_style].setAttribute('selected', '')

    M.FormSelect.init(document.querySelectorAll('select'))
  },
  methods: {
    saveOptions () {
      this.fetching = true
      this.errorStr = ''

      fetchWithPostBody(
        this.$store.state.endpoint + '/PlayerUpdateOption',
        'web_option=' + encodeURIComponent(JSON.stringify({
          disp_rate: this.disp_rate ? 1 : 0,
          disp_judge_style: this.disp_judge_style,
          disp_rank: this.disp_rank ? 1 : 0,
          disp_total_lv: this.disp_total_lv ? 1 : 0,
        }))
      ).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0) {
          this.errorStr = this.$t('msg_1') + `: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = this.$t('msg_2')
        this.$store.commit('saveOptions', d.data)
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
