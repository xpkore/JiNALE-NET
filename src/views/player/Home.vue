<template>
  <div class="col s12">
    <h3>玩家首页</h3>
    <div class="card horizontal">
      <div class="card-image">
        <img :alt="selectCharaName" style="width:150px;height:320px;object-fit:contain" :src="`https://n.bzxyzt.cn/assets/chara/${selectCharaName}.png`" />
      </div>
      <div class="card-stacked">
        <div class="card-content user-info-card">
          <h6 class="user-name">{{ loginInfo.user_data.user_name }}</h6>
          <p class="card-no">
            <span>{{ cardNo }}</span>
          </p>
          <p class="show-card-no-toggle">
            <label>
              <input type="checkbox" id="showCardNo" v-model="showCardNo"/>
              <span>显示卡号</span>
            </label>
          </p>
          <div style="clear:both"></div>
          <hr>
          <p class="shop-name">{{ lastShopName }}</p>
          <p class="play-date">{{ lastPlayDate }}</p>
          <hr>
          <div class="user-play-info">
            <p>Rating: {{ (loginInfo.user_data.player_rating / 100).toFixed(2) }}</p>
            <p>总游玩次数: {{ loginInfo.user_data.play_count }}</p>
            <p>奶酪: {{ cheeseCount }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s2"></div>
      <router-link to="/player/transfer_card" class="col s3 waves-effect waves-light btn">转移数据</router-link>
      <div class="col s2"></div>
      <a v-if="cheeseCount < 1000" class="col s3 waves-effect waves-light btn" :class="{disabled:(!haveDailyBonus || this.fetchingDailyBonus)}" @click="getDailyBonus">{{ haveDailyBonus ? '签到(+10奶酪)' : '已签到'}}</a>
      <span v-else class="col s3 center">不足1000奶酪时<br>才能签到</span>
    </div>
    <div class="row">
      <div class="col s7"></div>
      <router-link to="/logout" class="col s4 waves-effect waves-light btn red">退出登录</router-link>
    </div>
    <div class="music-ranking">
      <h5>热门游玩榜</h5>
      <div v-if="!rankingLoaded">
        <p>获取中...</p>
      </div>
      <div v-else-if="rankingLoadFailed">
        <p>获取排行榜失败</p>
        <a class="col waves-effect waves-light btn" @click="loadRanking">重试</a>
      </div>
      <div v-else>
        <div class="row s12">
            <div class="col s3">今日排名</div>
            <div class="col s6">歌曲</div>
            <div class="col s3">昨日排名</div>
        </div>
        <template v-for="item in rankingData">
          <hr :key="`hr-${item.or}`" v-if="item.or > 1">
          <div class="row s12" :key="`div-${item.or}`">
            <div class="col s3">{{ item.or }}</div>
            <div class="col s6">{{ getMusicName(item.id) }}</div>
            <div class="col s3">{{ item.prev }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
import { getMusicName } from '@/components/musicUtils'

export default {
  data: () => ({
    showCardNo: false,
    rankingLoaded: false,
    rankingLoadFailed: false,
    rankingData: null,
    fetchingDailyBonus: false
  }),
  computed: {
    // publicPath () { return process.env.BASE_URL },
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
    },
    haveDailyBonus () {
      return this.loginInfo.have_daily_bonus
    },
    cheeseCount () {
      return this.loginInfo.user_data.event_point
    }
  },
  mounted () {
    this.loadRanking()
  },
  methods: {
    getMusicName (id) {
      return getMusicName(id)
    },
    loadRanking () {
      this.$data.rankingLoaded = false
      this.$data.rankingLoadFailed = false
      this.$data.rankingData = null

      fetch(this.$store.state.endpoint + '/musicRanking').then(r => r.json()).then(d => {
        if (d.code) {
          this.$data.rankingLoadFailed = true
        } else {
          const prevIndex = d['2'].map(i => i.id)
          let order = 1
          const rankingData = d['1'].map(i => ({ or: order++, id: i.id, prev: prevIndex.indexOf(i.id) + 1 }))
          this.$data.rankingData = rankingData
        }
        this.$data.rankingLoaded = true
      })
    },
    getDailyBonus () {
      if (!this.haveDailyBonus) return
      this.$data.fetchingDailyBonus = true

      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)
      fetch(this.$store.state.endpoint + '/dailyBonus', {
        method: 'GET',
        headers: h
      }).then(r => r.json()).then(d => {
        if (d.code === 0) {
          this.$store.commit('dailyBonus')
        }
      })
    }
  }
}
</script>
