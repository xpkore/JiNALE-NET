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
    path: '/update_notes',
    name: 'UpdateNotes',
    component: () => import('../views/UpdateNotes.vue')
  },
  {
    path: '/account/register',
    name: 'Register',
    component: () => import('../views/account/Register.vue')
  },
  {
    path: '/account/login',
    name: 'Login',
    component: () => import('../views/account/Login.vue')
  },
  {
    path: '/account/logout',
    name: 'Logout',
    component: () => import('../views/account/Logout.vue')
  },
  {
    path: '/account/change_password',
    name: 'ChangePassword',
    component: () => import('../views/account/ChangePassword.vue')
  },

  {
    path: '/player/home',
    name: 'UserHome',
    component: () => import('../views/player/Home.vue')
  },
  {
    path: '/player/transfer_card',
    name: 'TransferCard',
    component: () => import('../views/player/TransferCard.vue')
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
