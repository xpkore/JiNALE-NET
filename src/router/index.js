import Vue from 'vue'
import VueRouter from 'vue-router'
import M from 'materialize-css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
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

export default router