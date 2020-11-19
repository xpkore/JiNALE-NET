<template>
  <div class="col s12">
    <h3>User Home</h3>
    <div class="card horizontal">
      <div class="card-image">
        <img :alt="selectCharaName" style="width:150px;height:320px;object-fit:contain" :src="`${publicPath}assets/chara/${selectCharaName}.png`" />
      </div>
      <div class="card-stacked">
        <div class="card-content user-info-card">
          <h6 class="user-name">{{ loginInfo.user_data.user_name }}</h6>
          <p class="card-no">
            <span>{{ cardNo }}</span>
            <span class="transfer-card-btn"><router-link to="/user/transfer_card">Data Transfer</router-link></span>
          </p>
          <p class="show-card-no-toggle">
            <label>
              <input type="checkbox" id="showCardNo" v-model="showCardNo"/>
              <span>Show Card No</span>
            </label>
          </p>
          <div style="clear:both"></div>
          <hr>
          <p class="shop-name">{{ lastShopName }}</p>
          <p class="play-date">{{ lastPlayDate }}</p>
          <hr>
          <div class="user-play-info">
            <p>Rating: {{ (loginInfo.user_data.player_rating / 100).toFixed(2) }}</p>
            <p>Play Count: {{ loginInfo.user_data.play_count }}</p>
            <p>Cheese: {{ loginInfo.user_data.event_point }}</p>
          </div>
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
      <div v-if="!rankingLoaded">
        <p>Loading...</p>
      </div>
      <div v-else-if="rankingLoadFailed">
        <p>Load music ranking failed</p>
        <a class="col waves-effect waves-light btn" @click="loadRanking">Retry</a>
      </div>
      <div v-else>
      </div>
    </div>
  </div>
</template>

<style>
.user-play-info {
  text-align: right
}
.show-card-no-toggle, .transfer-card-btn {
  float: right
}
</style>

<script>
import { getShopName } from '@/components/shopUtils'
import { dateToLocalStr } from '@/components/dateUtils'

export default {
  data: () => ({
    showCardNo: false,
    rankingLoaded: false,
    rankingLoadFailed: false,
    rankingData: null
  }),
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
    },
    cardNo () {
      return this.loginInfo.card.id.replace(/(.{4})(.{4})(.{4})(.{4})(.{4})/, this.showCardNo ? '$1-$2-$3-$4-$5' : '$1-$2-****-****-$5')
    }
  },
  mounted () {
    this.loadRanking()
  },
  methods: {
    loadRanking () {
      this.$data.rankingLoaded = false
      this.$data.rankingLoadFailed = false
      this.$data.rankingData = null

      setTimeout(() => {
        this.$data.rankingLoadFailed = true
        this.$data.rankingLoaded = true
      }, 1000)
    }
  }
}
</script>
