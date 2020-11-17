import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import M from 'materialize-css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    // component: () => import('../views/Register.vue')
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/user/home',
    name: 'UserHome',
    component: () => import('../views/user/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  M.AutoInit()

  if (!router.currentRoute.matched.length) {
    router.replace('/')
  }
})

router.onError((e) => {
  console.error('router error', e)
  router.replace('/')
})

export default router
