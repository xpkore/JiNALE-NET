<template>
  <div>
    <h3>{{ $t('title') }}</h3>
    <div class="card horizontal">
      <div class="card-image">
        <img :alt="selectCharaName" style="width:150px;height:320px;object-fit:contain" :src="`https://n.bzxyzt.cn/assets/chara/${selectCharaName}.png`" />
      </div>
      <div class="card-stacked">
        <div class="card-content user-info-card">
          <h6 class="user-name">{{ loginInfo.user_data.user_name }}</h6>
          <div><router-link to="/player/change_name">{{ $t('change_name_btn') }}</router-link></div>
          <p class="card-no">
            <span v-if="showCardNo">{{ loginInfo.card.id.replace(/(.{4})(.{4})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4-$5') }}</span>
            <span v-else>{{ loginInfo.card.id.replace(/(.{4})(.{4})(.{4})(.{4})(.{4})/, '$1-$2-****-****-$5') }}</span>
          </p>
          <p class="show-card-no-toggle">
            <label>
              <input type="checkbox" id="showCardNo" v-model="showCardNo"/>
              <span>{{ $t('show_cardno_label') }}</span>
            </label>
          </p>
          <div style="clear:both"></div>
          <hr>
          <p class="shop-name">{{ lastShopName }}</p>
          <p class="play-date"><span class="hoveritem">
            <span class="normal timeago" :datetime="lastPlayDate">{{ lastPlayDateStr }}</span>
            <span class="hover">{{ lastPlayDateStr }}</span>
          </span></p>
          <hr>
          <div class="user-play-info">
            <p>Rating: {{ (loginInfo.user_data.player_rating / 100).toFixed(2) }}</p>
            <p>{{ $t('play_count') }}: {{ loginInfo.user_data.play_count }}</p>
            <p>{{ $t('cheese') }}: {{ cheeseCount }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s0 m2"></div>
      <router-link to="/player/transfer_card" class="col s5 m3 waves-effect waves-light btn">{{ $t('transfer_data') }}</router-link>
      <div class="col s1 m2"></div>
      <a v-if="cheeseCount < 1000" class="col s5 m3 waves-effect waves-light btn small-btn-text" :class="{disabled:(!haveDailyBonus || this.fetchingDailyBonus)}" @click="getDailyBonus">{{ haveDailyBonus ? $t('daily_bonus') : $t('daily_bonus_got')}}</a>
      <span v-else class="col s5 m3 center">{{ $t('no_daily_bonus') }}</span>
    </div>
    <div class="music-ranking">
      <h5>{{ $t('music_ranking') }}</h5>
      <label v-if="rankingDate">{{ $t('music_ranking_updated_at') }} {{ rankingDate }}</label>
      <div v-if="!rankingLoaded">
        <p>{{ $t('music_ranking_loading') }}</p>
      </div>
      <div v-else-if="rankingLoadFailed">
        <p>{{ $t('music_ranking_failed') }}</p>
        <a class="col waves-effect waves-light btn" @click="loadRanking">{{ $t('retry') }}</a>
      </div>
      <div v-else>
        <template v-for="item in rankingData">
          <div class="valign-wrapper rank-music-item" :class="`rank-${rankRelativePosition(item)}`" :key="`div-${item.or}`">
            <div class="rank-music-order" :class="`rank-${item.or}`">{{ item.or }}</div>
            <div class="rank-music-jacket"><img :src="getMusicJacketUrl(item.id)"></div>
            <div class="rank-music-name">{{ getMusicName(item.id) }}</div>
            <div class="rank-music-prev">{{ item.prev }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="row center">
      <div class="col s0 m1"></div>
      <div class="col s12 m4" style="margin:10px 0">
        <div class="col s2 m0"></div>
        <router-link to="/account/change_password" class="col s8 m12 waves-effect waves-light btn small-btn-text">{{ $t('change_pwd') }}</router-link>
      </div>
      <div class="col s0 m2"></div>
      <div class="col s12 m4" style="margin:10px 0">
        <div class="col s2 m0"></div>
        <router-link to="/account/logout" class="col s8 m12 waves-effect waves-light btn red">{{ $t('logout') }}</router-link>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Player Home",
    "change_name_btn": "Change player name",
    "show_cardno_label": "Show Card NO",
    "play_count": "Play count",
    "cheese": "Cheese",
    "transfer_data": "Transfer data",
    "daily_bonus": "Daily cheese",
    "daily_bonus_got": "Checked-in",
    "no_daily_bonus": "Can check-in when under 1000 cheese",
    "music_ranking": "Popular Ranking",
    "music_ranking_updated_at": "Ranking updated at",
    "music_ranking_loading": "Loading...",
    "music_ranking_failed": "Failed loading rank data",
    "retry": "Retry",
    "change_pwd": "Change password",
    "logout": "Log out"
  },
  "zh": {
    "title": "玩家首页",
    "change_name_btn": "变更玩家名",
    "show_cardno_label": "显示卡号",
    "play_count": "总游玩次数",
    "cheese": "奶酪",
    "transfer_data": "转移数据",
    "daily_bonus": "签到(+10奶酪)",
    "daily_bonus_got": "已签到",
    "no_daily_bonus": "不足1000奶酪时才能签到",
    "music_ranking": "热门游玩榜",
    "music_ranking_updated_at": "排名更新于",
    "music_ranking_loading": "获取中...",
    "music_ranking_failed": "获取排行榜失败",
    "retry": "重试",
    "change_pwd": "修改密码",
    "logout": "退出登录"
  }
}
</i18n>

<style scoped>
.user-play-info {
  text-align: right
}
.show-card-no-toggle, .transfer-card-btn {
  float: right
}

.rank-music-item {
  position: relative;
  height: 80px;
  line-height: 80px;
}
.rank-music-item:not(:first-of-type) {
  border-top: 1px solid gray
}
.rank-music-item>div {
  display: inline-block;
}
.rank-music-order {
  width: 40px;
  text-align: center
}
.rank-music-order.rank-1 { font-size: 30px; }
.rank-music-order.rank-2 { font-size: 25px; }
.rank-music-order.rank-3 { font-size: 20px; }
.rank-music-jacket img {
  height: 60px;
  vertical-align: middle;
}
.rank-music-name {
  overflow:hidden;
  margin-left: 5px;
  width: calc(100% - 146px);
  text-overflow: ellipsis;
  white-space: pre;
}
.rank-music-prev {
  line-height:20px;
  margin-top:60px;
  width:40px;
  text-align: center;
  color: gray;
}
.rank-music-item:after {
  content: "";
  position: absolute;
  top: 20px;
  right: 0;
  height: 40px;
  width: 40px;
  background-image: url("https://n.bzxyzt.cn/assets/ranking.png");
  background-size: 40px auto
}
.rank-music-item.rank-up:after { background-position: 0 80px; }
.rank-music-item.rank-down:after { background-position: 0 160px; }
</style>

<script>
import { getShopName } from '@/components/shopUtils'
import { standardizeDate, dateToLocalStr } from '@/components/dateUtils'
import { getMusicName, getMusicJacketUrl } from '@/components/musicUtils.js'
import { checkTokenValidity } from '@/components/accUtils'

export default {
  data: () => ({
    showCardNo: false,
    rankingLoaded: false,
    rankingLoadFailed: false,
    rankingData: null,
    rankingDate: '',
    fetchingDailyBonus: false
  }),
  updated () {
    window.dispatchEvent(new Event('trigger-timeago'))
  },
  computed: {
    // publicPath () { return process.env.BASE_URL },
    loginInfo () {
      return this.$store.state.loginInfo
    },
    lastShopName () {
      return getShopName(this.loginInfo.user_data.last_client_id)
    },
    lastPlayDate () {
      return standardizeDate(this.loginInfo.user_data.last_play_date).toISOString()
    },
    lastPlayDateStr () {
      return dateToLocalStr(this.loginInfo.user_data.last_play_date, true)
    },
    selectCharaName () {
      const nameArr = ['', '', 'ras', 'chiffon', 'salt', 'otohime', 'syama', 'milk']
      return nameArr[this.loginInfo.user_data.select_chara]
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
      this.rankingLoaded = false
      this.rankingLoadFailed = false
      this.rankingData = null

      fetch(this.$store.state.endpoint + '/musicRanking').then(r => r.json()).then(d => {
        if (d.code) {
          this.rankingLoadFailed = true
        } else {
          const prevIndex = d['2'].map(i => i.id)
          let order = 1
          const rankingData = d['1'].map(i => ({ or: order++, id: i.id, prev: prevIndex.indexOf(i.id) + 1 }))
          this.rankingData = rankingData
          this.rankingDate = d.updated
        }
        this.rankingLoaded = true
      })
    },
    getDailyBonus () {
      if (!this.haveDailyBonus) return
      this.fetchingDailyBonus = true

      const h = new Headers()
      h.append('Authorization', 'Bearer ' + localStorage.authToken)
      fetch(this.$store.state.endpoint + '/dailyBonus', {
        method: 'GET',
        headers: h
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code === 0) {
          this.$store.commit('dailyBonus')
        }
      })
    },
    rankRelativePosition (item) {
      if (item.prev === 0) return 'up'
      if (item.prev > item.or) return 'up'
      if (item.prev < item.or) return 'down'
      return 'keep'
    },
    getMusicJacketUrl (id) {
      return getMusicJacketUrl(id)
    }
  }
}
</script>
