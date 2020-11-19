<template>
  <div id="app">
    <router-view v-if="initialized" />
    <div v-else>
      <h4>Loading...</h4>
    </div>
  </div>
</template>

<style>
html {
  width: 95%;
  max-width: 600px;
  margin: 5px auto;
  background: #efeff4;
  cursor: default;
  font-family: Arial,"Microsoft YaHei"
}
@media (prefers-color-scheme: dark) {
  html,body {background:black;color:#DDD}
  div.card,.dropdown-content {background:#1c1c1c}
  .select-wrapper input.select-dropdown {color:white}
  .select-wrapper .caret {fill:rgba(255,255,255,0.87)}
  .pagination li a {color:white}
  img {filter:brightness(0.8)}
  input {color: inherit}
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

      // manual slow down
      return new Promise((resolve, reject) => setTimeout(resolve, 1000))
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      if (loginInfo) {
        this.$store.commit('updateLoginInfo', loginInfo)
      } else {
        this.$router.replace('/')
      }
      this.$data.initialized = true
    })
  },
  methods: {
  }
}
</script>
