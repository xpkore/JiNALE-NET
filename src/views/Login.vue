<template>
  <div>
    <h1>Login</h1>
    <p>
      <router-link to="/">Home</router-link>
    </p>
    <form @submit.prevent="doLogin">
      <p class="input-field">
        <input type="text" id="userid" name="userid"/>
        <label for="userid">User ID</label>
      </p>
      <p class="input-field">
        <input type="password" id="pwd" name="pwd"/>
        <label for="pwd">Password</label>
      </p>
      <input type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    doLogin: e => {
      const form = e.target
      form.pwd.setAttribute('disabled', '')
      const hashedPwd = form.pwd.value
      fetch('/api/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        body: `id=${encodeURIComponent(form.userid.value)}&hashed_pwd=${hashedPwd}`
      }).then(r => r.json()).then(d => {
        console.log(d)
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        form.pwd.removeAttribute('disabled')
      })
    }
  }
}
</script>
