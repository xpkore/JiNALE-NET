<template>
  <div id="app">
    <router-view v-if="initialized" />
    <div v-else>
      <p>{{$t('initializing')}}</p>
    </div>
    <footer v-if="notAtUpdateNotes" class="center">
      <router-link to="/update_notes">{{$t('update_notes')}}</router-link>
    </footer>
    <footer>
      <div class="row s12"><div class="col s4"></div><div class="input-field col s4">
        <select id="colorScheme" v-model="colorScheme" @change="colorSchemeChanged">
          <option value="auto">{{$t('cs_auto')}}</option>
          <option value="light">{{$t('cs_light')}}</option>
          <option value="dark">{{$t('cs_dark')}}</option>
        </select>
        <label>{{$t('color_scheme')}}: </label>
      </div></div>
      <p>JiNALE team &copy; 2020</p>
      <p>Make maimai FiNALE &amp; fanmade great again</p>
      <p>
        <a href="https://github.com/esterTion/jinale-net/" target="_blank">GitHub</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="http://web.jinale.com/tools/jinale.apk" target="_blank">安卓app</a> Via: bbs_jy (功能更新晚于网站)
      </p>
      <p>
        <a href="http://maimai.best/" target="_blank" style="margin-right:10px"
title="「所以你们maimai.best啥时候上线.jpg」
Yuuki：「十年后吧」
「？」">茶盘</a>
        <a href="http://finale.plus/" target="_blank" style="margin-left:10px"
title="🏀：「xs」
🏀：「人均在鸽」
🏀：「我这都懒得动」">球盘</a>
      </p>
    </footer>
  </div>
</template>

<i18n>
{
  "en": {
    "initializing": "Initializing...",
    "update_notes": "JiNet Update Notes",
    "cs_auto": "System default",
    "cs_light": "Light",
    "cs_dark": "Dark",
    "color_scheme": "Color scheme"
  },
  "zh": {
    "initializing": "正在初始化...",
    "update_notes": "JiNet更新日志",
    "cs_auto": "跟随系统",
    "cs_light": "亮色",
    "cs_dark": "暗色",
    "color_scheme": "页面主题配色"
  }
}
</i18n>

<style>
body {
  width: calc(100vw - 10px);
  max-width: 600px;
  margin: 5px auto;
  background: #efeff4;
  cursor: default;
  font-family: Arial,"Microsoft YaHei"
}
footer {
  text-align: center;
  color:#888;
  margin-top:40px;
  padding-top:20px;
  border-top:1px solid rgba(0,0,0,0.14)
}

.hoveritem>.hover{display:none}
.hoveritem:hover>.normal{display:none}
.hoveritem:hover>.hover{display:inline}

@media (prefers-color-scheme: dark) {
  [color-scheme=auto],[color-scheme=auto] body {background:black;color:#DDD}
  [color-scheme=auto] .card,[color-scheme=auto] .dropdown-content {background:#1c1c1c}
  [color-scheme=auto] .select-wrapper input.select-dropdown {color:white}
  [color-scheme=auto] .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
  [color-scheme=auto] .pagination a {color:white}
  [color-scheme=auto] img {filter:brightness(0.8)}
  [color-scheme=auto] input {color: inherit}
  [color-scheme=auto] input:not([type]):disabled, [color-scheme=auto] input:not([type])[readonly="readonly"], [color-scheme=auto] input[type="text"]:not(.browser-default):disabled, [color-scheme=auto] input[type="text"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="password"]:not(.browser-default):disabled, [color-scheme=auto] input[type="password"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="email"]:not(.browser-default):disabled, [color-scheme=auto] input[type="email"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="url"]:not(.browser-default):disabled, [color-scheme=auto] input[type="url"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="time"]:not(.browser-default):disabled, [color-scheme=auto] input[type="time"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="date"]:not(.browser-default):disabled, [color-scheme=auto] input[type="date"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="datetime"]:not(.browser-default):disabled, [color-scheme=auto] input[type="datetime"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="datetime-local"]:not(.browser-default):disabled, [color-scheme=auto] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="tel"]:not(.browser-default):disabled, [color-scheme=auto] input[type="tel"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="number"]:not(.browser-default):disabled, [color-scheme=auto] input[type="number"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] input[type="search"]:not(.browser-default):disabled, [color-scheme=auto] input[type="search"]:not(.browser-default)[readonly="readonly"], [color-scheme=auto] textarea.materialize-textarea:disabled, [color-scheme=auto] textarea.materialize-textarea[readonly="readonly"] {
    color: rgba(255,255,255,0.42);
    border-bottom: 1px dotted rgba(255,255,255,0.42)
  }
  input:not([type]):disabled + label, [color-scheme=auto] input:not([type])[readonly="readonly"] + label, [color-scheme=auto] input[type="text"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="text"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="password"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="password"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="email"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="email"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="url"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="url"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="time"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="time"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="date"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="date"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="datetime"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="datetime"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="datetime-local"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="tel"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="tel"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="number"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="number"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] input[type="search"]:not(.browser-default):disabled + label, [color-scheme=auto] input[type="search"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=auto] textarea.materialize-textarea:disabled + label, [color-scheme=auto] textarea.materialize-textarea[readonly="readonly"] + label {
    color: rgba(255,255,255,0.42);
  }
  [color-scheme=auto] footer {
    border-top-color: rgba(255,255,255,0.25)
  }
  [color-scheme=auto] .input-field .helper-text {
    color: rgba(255,255,255,.54)
  }
}

[color-scheme=dark],[color-scheme=dark] body {background:black;color:#DDD}
[color-scheme=dark] .card,[color-scheme=dark] .dropdown-content {background:#1c1c1c}
[color-scheme=dark] .select-wrapper input.select-dropdown {color:white}
[color-scheme=dark] .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
[color-scheme=dark] .pagination a {color:white}
[color-scheme=dark] img {filter:brightness(0.8)}
[color-scheme=dark] input {color: inherit}
[color-scheme=dark] input:not([type]):disabled, [color-scheme=dark] input:not([type])[readonly="readonly"], [color-scheme=dark] input[type="text"]:not(.browser-default):disabled, [color-scheme=dark] input[type="text"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="password"]:not(.browser-default):disabled, [color-scheme=dark] input[type="password"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="email"]:not(.browser-default):disabled, [color-scheme=dark] input[type="email"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="url"]:not(.browser-default):disabled, [color-scheme=dark] input[type="url"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="time"]:not(.browser-default):disabled, [color-scheme=dark] input[type="time"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="date"]:not(.browser-default):disabled, [color-scheme=dark] input[type="date"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="datetime"]:not(.browser-default):disabled, [color-scheme=dark] input[type="datetime"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="datetime-local"]:not(.browser-default):disabled, [color-scheme=dark] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="tel"]:not(.browser-default):disabled, [color-scheme=dark] input[type="tel"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="number"]:not(.browser-default):disabled, [color-scheme=dark] input[type="number"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] input[type="search"]:not(.browser-default):disabled, [color-scheme=dark] input[type="search"]:not(.browser-default)[readonly="readonly"], [color-scheme=dark] textarea.materialize-textarea:disabled, [color-scheme=dark] textarea.materialize-textarea[readonly="readonly"] {
  color: rgba(255,255,255,0.42);
  border-bottom: 1px dotted rgba(255,255,255,0.42)
}
input:not([type]):disabled + label, [color-scheme=dark] input:not([type])[readonly="readonly"] + label, [color-scheme=dark] input[type="text"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="text"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="password"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="password"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="email"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="email"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="url"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="url"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="time"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="time"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="date"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="date"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="datetime"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="datetime"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="datetime-local"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="tel"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="tel"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="number"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="number"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] input[type="search"]:not(.browser-default):disabled + label, [color-scheme=dark] input[type="search"]:not(.browser-default)[readonly="readonly"] + label, [color-scheme=dark] textarea.materialize-textarea:disabled + label, [color-scheme=dark] textarea.materialize-textarea[readonly="readonly"] + label {
  color: rgba(255,255,255,0.42);
}
[color-scheme=dark] footer {
  border-top-color: rgba(255,255,255,0.25)
}
[color-scheme=dark] .input-field .helper-text {
  color: rgba(255,255,255,.54)
}

.result-icon {
  background-image:url('https://n.bzxyzt.cn/assets/icon_result.png');
  background-size: 80px auto;
  display:inline-block;
  height:40px;
  width:40px;
  vertical-align: middle;
}
.result-icon-none{background:none}
.result-icon-fc     {background-position:0 -2px}
.result-icon-fcp    {background-position:0 -42px}
.result-icon-ap     {background-position:0 -82px}
.result-icon-app    {background-position:0 -122px}
.result-icon-sync   {background-position:40px -2px}
.result-icon-mf     {background-position:40px -42px}
.result-icon-mfp    {background-position:40px -82px}
.result-icon-100sync{background-position:40px -122px}
.level-icon {
  background-image:url('https://n.bzxyzt.cn/assets/icon_level.png');
  background-size: 60px auto;
  display:inline-block;
  height:15px;
  width:60px;
  vertical-align: middle;
}
div.card.lvl-eas .level-icon {background-position-y:0}
div.card.lvl-bas .level-icon {background-position-y:-15px}
div.card.lvl-adv .level-icon {background-position-y:-30px}
div.card.lvl-exp .level-icon {background-position-y:-45px}
div.card.lvl-mas .level-icon {background-position-y:-60px}
div.card.lvl-rem .level-icon {background-position-y:-75px}
div.card.lvl-enkaijou .level-icon {background:none}
</style>

<script>
import { initMyInfo } from '@/components/accUtils'
import M from 'materialize-css'

export default {
  data: () => ({
    initialized: false,
    notAtUpdateNotes: true,
    colorScheme: 'auto'
  }),
  mounted: function () {
    if (localStorage.colorScheme) {
      this.colorScheme = localStorage.colorScheme
      const ele = document.querySelector(`#colorScheme>option[value=${this.colorScheme}]`)
      if (ele) ele.setAttribute('selected', '')
    }
    this.colorSchemeChanged()
    M.FormSelect.init(document.querySelectorAll('select'))

    let loginInfo
    if (localStorage.authToken !== undefined) {
      initMyInfo.call(this).then(() => {
        if (!this.$store.state.loggedIn) throw new Error('init myinfo failed')
      }).catch((e) => {
        console.log(e)
        if (location.pathname !== '/' && location.pathname.substr(0, 9) !== '/account/') {
          this.$router.replace('/')
        }
      }).finally(() => {
        this.initialized = true
      })
    } else {
      if (location.pathname !== '/' && location.pathname.substr(0, 9) !== '/account/') {
        this.$router.replace('/')
      }
      this.initialized = true
    }

    this.$router.afterEach(() => {
      this.notAtUpdateNotes = location.pathname !== '/update_notes'
    })
  },
  methods: {
    colorSchemeChanged () {
      localStorage.colorScheme = this.colorScheme
      document.body.parentNode.setAttribute('color-scheme', this.colorScheme)
    }
  }
}
</script>
