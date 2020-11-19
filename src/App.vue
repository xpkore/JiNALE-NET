<template>
  <div id="app">
    <router-view v-if="initialized" />
    <div v-else>
      <h4>正在初始化...</h4>
    </div>
    <footer>
      <p>JiNALE team &copy; 2020</p>
      <p>Make maimai FiNALE &amp; fanmade great again</p>
    </footer>
  </div>
</template>

<style>
body {
  width: 95%;
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
  html,body {background:black;color:#DDD}
  div.card,.dropdown-content {background:#1c1c1c}
  .select-wrapper input.select-dropdown {color:white}
  .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
  .pagination li a {color:white}
  img {filter:brightness(0.8)}
  input {color: inherit}
  input:not([type]):disabled, input:not([type])[readonly="readonly"], input[type="text"]:not(.browser-default):disabled, input[type="text"]:not(.browser-default)[readonly="readonly"], input[type="password"]:not(.browser-default):disabled, input[type="password"]:not(.browser-default)[readonly="readonly"], input[type="email"]:not(.browser-default):disabled, input[type="email"]:not(.browser-default)[readonly="readonly"], input[type="url"]:not(.browser-default):disabled, input[type="url"]:not(.browser-default)[readonly="readonly"], input[type="time"]:not(.browser-default):disabled, input[type="time"]:not(.browser-default)[readonly="readonly"], input[type="date"]:not(.browser-default):disabled, input[type="date"]:not(.browser-default)[readonly="readonly"], input[type="datetime"]:not(.browser-default):disabled, input[type="datetime"]:not(.browser-default)[readonly="readonly"], input[type="datetime-local"]:not(.browser-default):disabled, input[type="datetime-local"]:not(.browser-default)[readonly="readonly"], input[type="tel"]:not(.browser-default):disabled, input[type="tel"]:not(.browser-default)[readonly="readonly"], input[type="number"]:not(.browser-default):disabled, input[type="number"]:not(.browser-default)[readonly="readonly"], input[type="search"]:not(.browser-default):disabled, input[type="search"]:not(.browser-default)[readonly="readonly"], textarea.materialize-textarea:disabled, textarea.materialize-textarea[readonly="readonly"] {
    color: rgba(255,255,255,0.42);
    border-bottom: 1px dotted rgba(255,255,255,0.42)
  }
  input:not([type]):disabled + label, input:not([type])[readonly="readonly"] + label, input[type="text"]:not(.browser-default):disabled + label, input[type="text"]:not(.browser-default)[readonly="readonly"] + label, input[type="password"]:not(.browser-default):disabled + label, input[type="password"]:not(.browser-default)[readonly="readonly"] + label, input[type="email"]:not(.browser-default):disabled + label, input[type="email"]:not(.browser-default)[readonly="readonly"] + label, input[type="url"]:not(.browser-default):disabled + label, input[type="url"]:not(.browser-default)[readonly="readonly"] + label, input[type="time"]:not(.browser-default):disabled + label, input[type="time"]:not(.browser-default)[readonly="readonly"] + label, input[type="date"]:not(.browser-default):disabled + label, input[type="date"]:not(.browser-default)[readonly="readonly"] + label, input[type="datetime"]:not(.browser-default):disabled + label, input[type="datetime"]:not(.browser-default)[readonly="readonly"] + label, input[type="datetime-local"]:not(.browser-default):disabled + label, input[type="datetime-local"]:not(.browser-default)[readonly="readonly"] + label, input[type="tel"]:not(.browser-default):disabled + label, input[type="tel"]:not(.browser-default)[readonly="readonly"] + label, input[type="number"]:not(.browser-default):disabled + label, input[type="number"]:not(.browser-default)[readonly="readonly"] + label, input[type="search"]:not(.browser-default):disabled + label, input[type="search"]:not(.browser-default)[readonly="readonly"] + label, textarea.materialize-textarea:disabled + label, textarea.materialize-textarea[readonly="readonly"] + label {
    color: rgba(255,255,255,0.42);
  }
  footer {
    border-top-color: rgba(255,255,255,0.25)
  }
}
</style>

<script>
export default {
  data: () => ({
    initialized: false
  }),
  mounted: function () {
    let loginInfo
    fetch(this.$store.state.endpoint + '/myinfo', {
      method: 'GET',
      credentials: 'include'
    }).then(r => r.json()).then(d => {
      if (d.code === 0) {
        loginInfo = d.data
      }
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      if (loginInfo) {
        this.$store.commit('updateLoginInfo', loginInfo)
      } else if (location.pathname !== '/') {
        this.$router.replace('/')
      }
      this.$data.initialized = true
    })
  },
  methods: {
  }
}
</script>
