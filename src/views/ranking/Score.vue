<template>
  <div>
    <PlayerNavBar></PlayerNavBar>
    <div class="narrow-column">
      <div>
        <div class="card" :class="getLevelClass(level)">
          <div class="flex flex-row flex-2">
            <span>
              <span class="level-icon"></span>
              <span>{{getLevelDifficulty(music_id, level)}}</span>
            </span>
          </div>
          <div class="music-name">{{ getMusicName(music_id) }}</div>
          <div class="row music-info">
            <div class="music-jacket" :class="{'music-deleted':isMusicDeleted(music_id)}"><img :src="getMusicJacketUrl(music_id)"></div>
            <div class="col s7 music-info-right">
              <div>{{$t('Artist')}}{{getMusicArtist(music_id)}}</div>
              <div>{{$t('Constant')}}{{getMusicLevelConstant(music_id, level).toFixed(1)}}</div>
              <div>{{charter ? $t('Charter') : ''}}{{charter}}</div>
            </div>
          </div>
        </div>
      </div>
      <PlayerScoreBox :music-id="music_id" :levels="[level]"></PlayerScoreBox>
      <hr>
      <div class="score-ranking">
        <h5>{{ $t('score_ranking') }}</h5>
        <div v-if="!rankingLoaded">
          <p>{{ $t('score_ranking_loading') }}</p>
        </div>
        <div v-else-if="rankingLoadFailed">
          <p>{{ $t('score_ranking_failed') }}</p>
          <a class="col waves-effect waves-light btn" @click="loadRanking">{{ $t('retry') }}</a>
        </div>
        <div v-else>
          <template v-for="item in rankingData">
            <div class="score-rank-item card" :class="{'player-rank':item.isPlayerRank}" :key="`div-${item.or}`">
              <div class="flex flex-row valign-wrapper ">
                <div class="score-rank-position" :class="`rank-${item.rank}`">{{ item.rank }}</div>
                <div class="score-rank-name">{{item.name}}</div>
                <div class="score-rank-achievement"><div class="result-icon" :class="getResultIconClass(item.fcap)"></div>{{ (item.achievement / 100).toFixed(2) }}%</div>
                <div class="score-rank-date hoveritem">
                  <span class="normal timeago" :datetime="playDate(item)">{{ playDateStr(item) }}</span>
                  <span class="hover">{{ playDateStr(item) }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "Artist": "Artist: ",
    "Constant": "Chart Constant: ",
    "Charter": "Chart Design: ",
    "score_ranking": "Score Ranking",
    "score_ranking_loading": "Loading...",
    "score_ranking_failed": "Failed loading rank data",
    "retry": "Retry"
  },
  "zh": {
    "Artist": "曲：",
    "Constant": "谱面定数：",
    "Charter": "谱面设计：",
    "score_ranking": "单曲分数榜",
    "score_ranking_loading": "获取中...",
    "score_ranking_failed": "获取排行榜失败",
    "retry": "重试"
  }
}
</i18n>

<style>
.row .col.music-info-right {
  margin-left: 10px;
  width: calc(100% - 138px)
}
.score-rank-item {
  padding: 10px 0;
  position: relative;
}
.score-rank-position {
  width: 30px;
  text-align: center
}
.score-rank-position.rank-1 { font-size: 30px; }
.score-rank-position.rank-2 { font-size: 25px; }
.score-rank-position.rank-3 { font-size: 20px; }
.score-rank-name {
  width: calc(100% - 180px);
  font-size: 17px;
}
.score-rank-achievement {
  width:150px;
  text-align:center;
  font-size:20px;
}
.score-rank-date {
  position: absolute;
  right:0;
  bottom:0;
  font-size:12px;
  width:150px;
  text-align:center;
}
.score-rank-item.player-rank .score-rank-name {
  color: rgb(255,174,0)
}
.score-rank-item .result-icon-none {
  display: none
}
</style>

<script>
import { getShopName } from '@/components/shopUtils'
import { standardizeDate, dateToLocalStr } from '@/components/dateUtils'
import { checkTokenValidity, fetchWithPostBody } from '@/components/accUtils'
import { getMusicName, getMusicArtist, getMusicJacketUrl, isMusicDeleted, getMusicLevelConstant, getMusicLevelCharter } from '@/components/musicUtils.js'
import PlayerNavBar from '@/components/PlayerNavBar'
import PlayerScoreBox from '@/components/PlayerScoreBox'

export default {
  components: {
    PlayerNavBar,
    PlayerScoreBox
  },
  data: () => ({
    rankingLoaded: false,
    rankingLoadFailed: false,
    rankingData: null
  }),
  computed: {
    music_id () {
      return this.$route.query.music_id | 0
    },
    level () {
      return this.$route.query.level | 0
    },
    charter () {
      return getMusicLevelCharter(this.music_id, this.level)
    }
  },
  mounted () {
    this.loadRanking()
  },
  methods: {
    getMusicName,
    getMusicArtist,
    getMusicJacketUrl,
    isMusicDeleted,
    getMusicLevelConstant,
    getLevelClass (lvl) {
      if (lvl === 1) return 'lvl-eas'
      if (lvl === 2) return 'lvl-bas'
      if (lvl === 3) return 'lvl-adv'
      if (lvl === 4) return 'lvl-exp'
      if (lvl === 5) return 'lvl-mas'
      if (lvl === 6) return 'lvl-rem'
      return 'lvl-utage'
    },
    getLevelDifficulty (music_id, level) {
      if (level < 1 || level > 6) return ''
      const constant = getMusicLevelConstant(music_id, level)
      if (constant === 0) return '?'
      const lvlBase = Math.floor(constant).toString()
      const constantMul = constant * 10
      if (constantMul < 130) {
        if ((constantMul % 10) < 7) return lvlBase
        return `${lvlBase}+`
      }
      if ((constantMul % 10) < 9) return lvlBase
      return `${lvlBase}+`
    },
    loadRanking () {
      this.rankingLoaded = false
      this.rankingLoadFailed = false
      this.rankingData = null

      fetchWithPostBody(
        this.$store.state.endpoint + '/RankingScore',
        `music_id=${this.music_id}&level=${this.level}`
      ).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code) {
          this.rankingLoadFailed = true
        } else {
          let prevScore = 0, prevRank = 0
          const rankingData = d.data.sort((a,b) => a[0] - b[0]).map(i => {
            const cur = {
              or: i[0],
              rank: i[0],
              name: i[1],
              score: i[2],
              achievement: i[3],
              date: i[4],
              fcap: i[5],
              isPlayerRank: i[0] === d.player_rank_order
            }
            if (prevScore === cur.score) {
              cur.rank = prevRank
            } else {
              prevRank = cur.rank
              prevScore = cur.score
            }
            return cur
          })
          this.rankingData = rankingData
          setTimeout(() => {
            window.dispatchEvent(new Event('trigger-timeago'))
          })
        }
        this.rankingLoaded = true
      })
    },
    playDate (item) {
      return standardizeDate(item.date).toISOString()
    },
    playDateStr (item) {
      return dateToLocalStr(item.date, true)
    },
    getResultIconClass (fcap) {
      switch (fcap) {
        case 1: {return 'result-icon-fc'}
        case 2: {return 'result-icon-fcp'}
        case 3: {return 'result-icon-ap'}
        case 4: {return 'result-icon-app'}
      }
      return 'result-icon-none'
    },
  }
}
</script>
