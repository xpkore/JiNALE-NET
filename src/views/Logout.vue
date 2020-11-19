<template>
  <div>
    <h6>Log out</h6>
    <p>You are about to log out</p>
    <p>Confirm? </p>
    <div class="row">
      <div class="col s1"></div>
      <router-link to="/user/home" class="col s4 waves-effect waves-light btn">Back</router-link>
      <div class="col s2"></div>
      <a class="col s4 waves-effect waves-light btn danger" @click="doLogout">Confirm</a>
      <div class="col s1"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    if (!this.$store.state.loggedIn) {
      this.$router.replace('/')
    }
  },
  methods: {
    doLogout () {
      fetch(this.$store.state.endpoint + '/logout', {
        credentials: 'include'
      })
    }
  }
}
</script>
