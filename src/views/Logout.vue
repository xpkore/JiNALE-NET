<template>
  <div>
    <h5>Log out</h5>
    <p>You are about to log out</p>
    <p>Confirm? </p>
    <div class="row">
      <div class="col s1"></div>
      <router-link to="/user/home" class="col s4 waves-effect waves-light btn">Back</router-link>
      <div class="col s2"></div>
      <a class="col s4 waves-effect waves-light btn red" :class="{ disabled:fetching === true }" @click="doLogout">Confirm</a>
      <div class="col s1"></div>
    </div>
    <p v-if="doneLogout">
      <span>Logged out</span>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    doneLogout: false
  }),
  mounted () {
    if (!this.$store.state.loggedIn) {
      this.$router.replace('/')
    }
  },
  methods: {
    doLogout () {
      fetch(this.$store.state.endpoint + '/logout', {
        credentials: 'include'
      }).then(r => r.json()).then(d => {
        this.$data.doneLogout = true
        // manual slow down
        return new Promise((resolve, reject) => setTimeout(resolve, 1000))
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        this.$store.commit('updateLoginInfo')
        this.$router.push('/')
      })
    }
  }
}
</script>
