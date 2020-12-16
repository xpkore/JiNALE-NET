<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <PlayerNavBar></PlayerNavBar>
    <form @submit.prevent="doChangeName">
      <p class="input-field">
        <input type="text" id="new_player_name" name="new_player_name" autocomplete="off" autofocus v-model="new_player_name" :disabled="fetching" @input="usernameInput" maxlength="8" data-length="8"/>
        <label for="new_player_name">{{$t('label_1')}}</label>
        <span class="helper-text">{{$t('label_2')}}</span>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" :value="$t('btn_1')" />
    </form>
    <div class="card">
      <div class="card-content center" @click="appendSymbol">
        <span class="symbol-item" v-for="symbol in symbolList" :key="symbol[1]" :title="symbol[$t('symbol_title_key')]" :data-symbol="symbol[1]">{{ symbol[1] }}</span>
      </div>
    </div>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Change player name",
    "label_1": "New player name",
    "label_2": "Player name can include up to 8 full-width / half-width alphabets, numbers or symbols listed below",
    "btn_1":"Change Name",
    "msg_1":"Change name failed",
    "msg_2":"Player name updated",
    "msg_3":"Unknown error occured",
    "symbol_title_key": "2"
  },
  "zh": {
    "title": "变更名称",
    "label_1": "新玩家名",
    "label_2": "玩家名最多可以包含8个全角/半角的英文字母、数字或以下的特殊符号",
    "btn_1":"变更名称",
    "msg_1":"变更名称失败",
    "msg_2":"玩家名已更新",
    "msg_3":"出现未知错误",
    "symbol_title_key": "0"
  }
}
</i18n>

<style scoped>
.symbol-item {
  display:inline-block;
  width:25px;
  height:25px;
  margin: 10px;
  background:#DDD;
  border-radius: 5px;
  line-height: 25px;
}
@media (prefers-color-scheme: dark) {
  html[color-scheme=auto] .symbol-item { background:#444; }
}
html[color-scheme=dark] .symbol-item { background:#444; }
</style>

<script>
import M from 'materialize-css'
import { checkTokenValidity, authHeader } from '@/components/accUtils'
import PlayerNavBar from '@/components/PlayerNavBar'

export default {
  components: {
    PlayerNavBar
  },
  data: () => ({
    new_player_name: '',
    fetching: false,
    errorStr: '',
    symbolList: [
      ["间隔号"/*"TYUUTEN"   */, "・", "Seperation mark"],
      ["冒号"/* "COLON"      */, "：", "Colon"],
      ["分号"/* "SEMICOLON"  */, "；", "Semicolon"],
      ["问号"/* "QUESTION"   */, "？", "Question mark"],
      ["叹号"/* "EXCLAMATION"*/, "！", "Exclamation mark"],
      ["波浪线"/*"TILDE"     */, "～", "Tilde"],
      ["斜杠"/* "SLASH"      */, "／", "Slash"],
      ["加号"/* "PLUS"       */, "＋", "Plus sign"],
      ["减号"/* "MINUS"      */, "－", "Minus sign"],
      ["乘号"/* "KAKERU"     */, "×", "Multiply sign"],
      ["除号"/* "WARU"       */, "÷", "Divide sign"],
      ["等号"/* "EQUAL"      */, "＝", "Equal sign"],
      ["雄性"/* "OSU"        */, "♂", "Male mark"],
      ["雌性"/* "MESU"       */, "♀", "Female mark"],
      ["所有"/* "SUBETE"     */, "∀", "All mark"],
      ["井号"/* "SHARP"      */, "＃", "Sharp"],
      ["与"/*   "AMPERSAND"  */, "＆", "Ampersand"],
      ["星号"/* "ASTERISK"   */, "＊", "Asterisk"],
      ["at"/*   "AT"         */, "＠", "At"],
      ["星"/*   "STAR"       */, "☆", "Star"],
      ["圆"/*   "MARU"       */, "○", "Circle"],
      ["同心圆"/*"2MARU"     */, "◎", "Circle-in-circle"],
      ["菱形"/*  "KUKEI"     */, "◇", "Diamond"],
      ["方形"/*  "SQUARE"    */, "□", "Square"],
      ["三角"/*  "TRIANGLE"  */, "△", "Triangle"],
      ["倒三角"/*"TRIANGLE2" */, "▽", "Upside-down triangle"],
      ["音符"/*  "ONNPU"     */, "♪", "Musical note"],
      ["剑标"/*  "DAGGER"    */, "†", "Dagger"],
      ["双剑标"/*"D_DAGGER"  */, "‡", "Double dagger"],
      ["希格玛"/*"SIGMA"     */, "Σ", "Sigma"],
      ["alpha"/*"ALPHA"     */, "α", "Alpha"],
      ["beta"/* "BETA"      */, "β", "Beta"],
      ["gamma"/*"GAMMA"     */, "γ", "Gamma"],
      ["theta"/*"THETA"     */, "θ", "Theta"],
      ["phi"/*  "PHI"       */, "φ", "Phi"],
      ["psi"/*  "PSI"       */, "ψ", "Psi"],
      ["omega"/*"OMEGA"     */, "ω", "Omega"],
      ["de"/*   "DE"        */, "Д", "De"],
      ["yo"/*   "YO"        */, "ё", "Yo"],
      ["美元"/*  "DOLLAR"    */, "＄", "Dollar"],
      ["左括号"/*"LEFT_PARENTHESIS"*/, "（", "Left parenthesis"],
      ["右括号"/*"RIGHT_PARENTHESIS"*/, "）", "Right parenthesis"],
      ["句号"/*  "PERIOD"    */, "．", "Period mark"],
      ["下划线"/*"LOW_LINE"  */, "＿", "Underscore"]
    ]
  }),
  mounted () {
    new M.CharacterCounter(new_player_name)
    new_player_name.dispatchEvent(new Event('input'))
  },
  methods: {
    usernameInput () {
      this.new_player_name = this.new_player_name.replace(/[^0-9A-Za-z\uff10-\uff19\uff21-\uff3a\uff41-\uff5a・：；？！～／＋－×÷＝♂♀∀＃＆＊＠☆○◎◇□△▽♪†‡ΣαβγθφψωДё＄（）．＿ \u3000]/g, '').substr(0, 8)
    },
    appendSymbol (e) {
      if (this.fetching) return
      if (!e.target.dataset.symbol) return
      this.new_player_name += e.target.dataset.symbol
      new_player_name.focus()
      Promise.resolve().then(() => {
        new_player_name.dispatchEvent(new Event('input'))
      })
    },
    doChangeName () {
      this.usernameInput()
      this.fetching = true

      const newName = this.new_player_name.replace(/[\w\W]/g, c => {
        const cc = c.charCodeAt(0)
        if (cc>=0x30 && cc <= 0x39) { return JSON.parse('"\\u' + (0xff10 + cc - 0x30).toString(16) + '"'); } // 0-9
        if (cc>=0x41 && cc <= 0x5a) { return JSON.parse('"\\u' + (0xff21 + cc - 0x41).toString(16) + '"'); } // A-Z
        if (cc>=0x61 && cc <= 0x7a) { return JSON.parse('"\\u' + (0xff41 + cc - 0x61).toString(16) + '"'); } // a-z
        if (c === ' ') return '\u3000'
        if ('・：；？！～／＋－×÷＝♂♀∀＃＆＊＠☆○◎◇□△▽♪†‡ΣαβγθφψωДё＄（）．＿\u3000'.indexOf(c) !== -1) return c
        return ''
      })
      fetch(this.$store.state.endpoint + '/changeName?newName=' + newName, {
        method: 'GET',
        headers: authHeader()
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0) {
          this.errorStr = this.$t('msg_1') + `: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = this.$t('msg_2')
        this.$store.commit('updatePlayerName', newName)
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
