<template>
  <div class="col s12">
    <h3>User Home</h3>
    <div class="card horizontal">
      <div class="card-image">
        <img :alt="selectCharaName" style="width:150px;height:320px;object-fit:contain" :src="`${publicPath}assets/chara/${selectCharaName}.png`" />
      </div>
      <div class="card-stacked">
        <div class="card-content">
          <h6>{{ loginInfo.user_data.user_name }}</h6>
          <p class="card-no">{{ loginInfo.card.id.replace(/(.{4})(.{4})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4-$5') }}</p>
          <p class="shop-name">{{ lastShopName }}</p>
          <p class="play-date">{{ lastPlayDate }}</p>
          <hr>
          <p>Rating: {{ (loginInfo.user_data.player_rating / 100).toFixed(2) }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s4"></div>
      <router-link to="/logout" class="col s4 waves-effect waves-light btn">Log out</router-link>
      <div class="col s4"></div>
    </div>
    <div class="music-ranking">
      <h5>Music Ranking</h5>
    </div>
  </div>
</template>

<script>
import { getShopName } from '../../components/shopUtils'
import { dateToLocalStr } from '../../components/dateUtils'

export default {
  computed: {
    publicPath () { return process.env.BASE_URL },
    loginInfo () {
      return this.$store.state.loginInfo
    },
    lastShopName () {
      return getShopName(this.loginInfo.user_data.last_client_id)
    },
    lastPlayDate () {
      return dateToLocalStr(this.loginInfo.user_data.last_play_date)
    },
    selectCharaName () {
      const nameArr = ['', '', 'ras', 'chiffon', 'salt', 'otohime', 'syama', 'milk']
      return nameArr[this.loginInfo.user_data.select_chara]
    }
  }
}
</script>
