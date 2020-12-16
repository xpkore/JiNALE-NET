import Vue from 'vue'
import VueRouter from 'vue-router'
import M from 'materialize-css'

import Home from '@/views/Home.vue'
import UpdateNotes from '@/views/UpdateNotes.vue'
import Register from '@/views/account/Register.vue'
import Login from '@/views/account/Login.vue'
import Logout from '@/views/account/Logout.vue'
import ChangePassword from '@/views/account/ChangePassword.vue'

import UserHome from '@/views/player/Home.vue'
import TransferCard from '@/views/player/TransferCard.vue'
import ChangeName from '@/views/player/ChangeName.vue'
import RecentPlay from '@/views/player/RecentPlay.vue'
import Option from '@/views/player/Option.vue'

import RankingScore from '@/views/ranking/Score.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/update_notes',
    name: 'UpdateNotes',
    component: UpdateNotes
  },
  {
    path: '/account/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/account/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/account/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/account/change_password',
    name: 'ChangePassword',
    component: ChangePassword
  },

  {
    path: '/player/home',
    name: 'UserHome',
    component: UserHome
  },
  {
    path: '/player/transfer_card',
    name: 'TransferCard',
    component: TransferCard
  },
  {
    path: '/player/change_name',
    name: 'ChangeName',
    component: ChangeName
  },
  {
    path: '/player/recent_play',
    name: 'RecentPlay',
    component: RecentPlay
  },
  {
    path: '/player/option',
    name: 'Option',
    component: Option
  },

  {
    path: '/ranking/score',
    name: 'RankingScore',
    component: RankingScore
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
