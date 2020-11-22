<template>
  <div id="app">
    <router-view v-if="initialized" />
    <div v-else>
      <p>正在初始化...</p>
    </div>
    <footer v-if="notAtUpdateNotes" class="center">
      <router-link to="/update_notes">JiNet更新日志</router-link>
    </footer>
    <footer>
      <div class="row s12"><div class="col s4"></div><div class="input-field col s4">
        <select id="colorScheme" v-model="colorScheme" @change="colorSchemeChanged">
          <option value="auto">跟随系统</option>
          <option value="light">亮色</option>
          <option value="dark">暗色</option>
        </select>
        <label>页面主题配色：</label>
      </div></div>
      <p>JiNALE team &copy; 2020</p>
      <p>Make maimai FiNALE &amp; fanmade great again</p>
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
@media (prefers-color-scheme: dark) {
  html[color-scheme=auto],html[color-scheme=auto] body {background:black;color:#DDD}
  html[color-scheme=auto] div.card,html[color-scheme=auto] .dropdown-content {background:#1c1c1c}
  html[color-scheme=auto] .select-wrapper input.select-dropdown {color:white}
  html[color-scheme=auto] .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
  html[color-scheme=auto] .pagination li a {color:white}
  html[color-scheme=auto] img {filter:brightness(0.8)}
  html[color-scheme=auto] input {color: inherit}
  html[color-scheme=auto] input:not([type]):disabled, html[color-scheme=auto] input:not([type])[readonly="readonly"], html[color-scheme=auto] input[type="text"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="text"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="password"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="password"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="email"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="email"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="url"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="url"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="time"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="time"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="date"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="date"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="datetime"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="datetime"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="datetime-local"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="tel"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="tel"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="number"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="number"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] input[type="search"]:not(.browser-default):disabled, html[color-scheme=auto] input[type="search"]:not(.browser-default)[readonly="readonly"], html[color-scheme=auto] textarea.materialize-textarea:disabled, html[color-scheme=auto] textarea.materialize-textarea[readonly="readonly"] {
    color: rgba(255,255,255,0.42);
    border-bottom: 1px dotted rgba(255,255,255,0.42)
  }
  input:not([type]):disabled + label, html[color-scheme=auto] input:not([type])[readonly="readonly"] + label, html[color-scheme=auto] input[type="text"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="text"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="password"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="password"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="email"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="email"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="url"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="url"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="time"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="time"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="date"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="date"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="datetime"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="datetime"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="datetime-local"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="tel"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="tel"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="number"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="number"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] input[type="search"]:not(.browser-default):disabled + label, html[color-scheme=auto] input[type="search"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=auto] textarea.materialize-textarea:disabled + label, html[color-scheme=auto] textarea.materialize-textarea[readonly="readonly"] + label {
    color: rgba(255,255,255,0.42);
  }
  html[color-scheme=auto] footer {
    border-top-color: rgba(255,255,255,0.25)
  }
}

html[color-scheme=dark],html[color-scheme=dark] body {background:black;color:#DDD}
html[color-scheme=dark] div.card,html[color-scheme=dark] .dropdown-content {background:#1c1c1c}
html[color-scheme=dark] .select-wrapper input.select-dropdown {color:white}
html[color-scheme=dark] .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
html[color-scheme=dark] .pagination li a {color:white}
html[color-scheme=dark] img {filter:brightness(0.8)}
html[color-scheme=dark] input {color: inherit}
html[color-scheme=dark] input:not([type]):disabled, html[color-scheme=dark] input:not([type])[readonly="readonly"], html[color-scheme=dark] input[type="text"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="text"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="password"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="password"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="email"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="email"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="url"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="url"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="time"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="time"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="date"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="date"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="datetime"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="datetime"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="datetime-local"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="tel"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="tel"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="number"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="number"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] input[type="search"]:not(.browser-default):disabled, html[color-scheme=dark] input[type="search"]:not(.browser-default)[readonly="readonly"], html[color-scheme=dark] textarea.materialize-textarea:disabled, html[color-scheme=dark] textarea.materialize-textarea[readonly="readonly"] {
  color: rgba(255,255,255,0.42);
  border-bottom: 1px dotted rgba(255,255,255,0.42)
}
input:not([type]):disabled + label, html[color-scheme=dark] input:not([type])[readonly="readonly"] + label, html[color-scheme=dark] input[type="text"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="text"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="password"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="password"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="email"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="email"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="url"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="url"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="time"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="time"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="date"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="date"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="datetime"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="datetime"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="datetime-local"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="datetime-local"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="tel"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="tel"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="number"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="number"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] input[type="search"]:not(.browser-default):disabled + label, html[color-scheme=dark] input[type="search"]:not(.browser-default)[readonly="readonly"] + label, html[color-scheme=dark] textarea.materialize-textarea:disabled + label, html[color-scheme=dark] textarea.materialize-textarea[readonly="readonly"] + label {
  color: rgba(255,255,255,0.42);
}
html[color-scheme=dark] footer {
  border-top-color: rgba(255,255,255,0.25)
}
</style>

<script>
import { checkTokenValidity } from '@/components/accUtils'
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
      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)
      fetch(this.$store.state.endpoint + '/myinfo', {
        method: 'GET',
        headers: h
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code === 0) {
          loginInfo = d.data
        }
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        if (loginInfo) {
          this.$store.commit('updateLoginInfo', loginInfo)
        } else if (location.pathname !== '/' && location.pathname.substr(0, 9) !== '/account/') {
          this.$router.replace('/')
        }
        this.initialized = true
      })
    } else {
      if (location.pathname !== '/') {
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
