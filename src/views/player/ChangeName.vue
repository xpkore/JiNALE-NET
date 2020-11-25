<template>
  <div>
    <h3>变更名称</h3>
    <form @submit.prevent="doChangeName">
      <p class="input-field">
        <input type="text" id="new_user_name" name="new_user_name" autocomplete="off" autofocus v-model="new_user_name" :disabled="fetching" @input="usernameInput" maxlength="8" data-length="8"/>
        <label for="new_user_name">新ID</label>
        <span class="helper-text">玩家名最多可以包含8个全角/半角的英文字母、数字或以下的特殊符号</span>
      </p>
      <input class="btn waves-effect waves-light" :disabled="fetching === true" type="submit" value="变更名称" />
    </form>
    <div class="card">
      <div class="card-content center" @click="appendSymbol">
        <span class="symbol-item" v-for="symbol in symbolList" :key="symbol[1]" :title="symbol[0]" :data-symbol="symbol[1]">{{ symbol[1] }}</span>
      </div>
    </div>
    <p v-if="errorStr">
      <span>{{ errorStr }}</span>
    </p>
  </div>
</template>

<style scoped>
.symbol-item {
  display:inline-block;
  width:25px;
  height:25px;
  margin: 10px;
  background:#DDD;
  border-radius: 5px;
}
@media (prefers-color-scheme: dark) {
  html[color-scheme=auto] .symbol-item { background:#444; }
}
html[color-scheme=dark] .symbol-item { background:#444; }
</style>

<script>
import M from 'materialize-css'
import { checkTokenValidity } from '@/components/accUtils'

export default {
  data: () => ({
    new_user_name: '',
    fetching: false,
    errorStr: '',
    symbolList: [
      ["间隔号"/*"TYUUTEN"   */, "・"],
      ["冒号"/* "COLON"      */, "："],
      ["分号"/* "SEMICOLON"  */, "；"],
      ["问号"/* "QUESTION"   */, "？"],
      ["叹号"/* "EXCLAMATION"*/, "！"],
      ["波浪线"/*"TILDE"     */, "～"],
      ["斜杠"/* "SLASH"      */, "／"],
      ["加号"/* "PLUS"       */, "＋"],
      ["减号"/* "MINUS"      */, "－"],
      ["乘号"/* "KAKERU"     */, "×"],
      ["除号"/* "WARU"       */, "÷"],
      ["等号"/* "EQUAL"      */, "＝"],
      ["雄性"/* "OSU"        */, "♂"],
      ["雌性"/* "MESU"       */, "♀"],
      ["所有"/* "SUBETE"     */, "∀"],
      ["井号"/* "SHARP"      */, "＃"],
      ["与"/*   "AMPERSAND"  */, "＆"],
      ["星号"/* "ASTERISK"   */, "＊"],
      ["at"/*   "AT"         */, "＠"],
      ["星"/*   "STAR"       */, "☆"],
      ["圆"/*   "MARU"       */, "○"],
      ["同心圆"/*"2MARU"     */, "◎"],
      ["菱形"/*  "KUKEI"     */, "◇"],
      ["方形"/*  "SQUARE"    */, "□"],
      ["三角"/*  "TRIANGLE"  */, "△"],
      ["倒三角"/*"TRIANGLE2" */, "▽"],
      ["音符"/*  "ONNPU"     */, "♪"],
      ["剑标"/*  "DAGGER"    */, "†"],
      ["双剑标"/*"D_DAGGER"  */, "‡"],
      ["希格玛"/*"SIGMA"     */, "Σ"],
      ["alpha"/*"ALPHA"     */, "α"],
      ["beta"/* "BETA"      */, "β"],
      ["gamma"/*"GAMMA"     */, "γ"],
      ["theta"/*"THETA"     */, "θ"],
      ["phi"/*  "PHI"       */, "φ"],
      ["psi"/*  "PSI"       */, "ψ"],
      ["omega"/*"OMEGA"     */, "ω"],
      ["de"/*   "DE"        */, "Д"],
      ["yo"/*   "YO"        */, "ё"],
      ["美元"/*  "DOLLAR"    */, "＄"],
      ["左括号"/*"LEFT_PARENTHESIS"*/, "（"],
      ["右括号"/*"RIGHT_PARENTHESIS"*/, "）"],
      ["句号"/*  "PERIOD"    */, "．"],
      ["下划线"/*"LOW_LINE"  */, "＿"]
    ]
  }),
  mounted () {
    new M.CharacterCounter(new_user_name)
    new_user_name.dispatchEvent(new Event('input'))
  },
  methods: {
    usernameInput () {
      this.new_user_name = this.new_user_name.replace(/[^0-9A-Za-z\uff10-\uff19\uff21-\uff3a\uff41-\uff5a・：；？！～／＋－×÷＝♂♀∀＃＆＊＠☆○◎◇□△▽♪†‡ΣαβγθφψωДё＄（）．＿ \u3000]/g, '').substr(0, 8)
    },
    appendSymbol (e) {
      if (this.fetching) return
      if (!e.target.dataset.symbol) return
      this.new_user_name += e.target.dataset.symbol
      new_user_name.focus()
      Promise.resolve().then(() => {
        new_user_name.dispatchEvent(new Event('input'))
      })
    },
    doChangeName () {
      this.usernameInput()
      this.fetching = true
      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)

      const newName = this.new_user_name.replace(/[\w\W]/g, c => {
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
        headers: h
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code !== 0) {
          this.errorStr = `变更名称失败: [${d.code}] ${d.msg}`
          return
        }
        this.errorStr = '玩家名已更新'
        this.$store.commit('updatePlayerName', newName)
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
