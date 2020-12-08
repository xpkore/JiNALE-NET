<template>
  <div>
    <div v-if="!playerScoreLoaded">
      <p>{{ $t('player_score_loading') }}</p>
    </div>
    <div v-else-if="playerScoreLoadFailed">
      <p>{{ $t('player_score_failed') }}</p>
      <a class="col waves-effect waves-light btn" @click="loadPlayerScores()">{{ $t('retry') }}</a>
    </div>
    <div v-else class="player-score-box" v-for="level in levelsData" :key="level">
      <div class="card" :class="getLevelClass(level.level)">
        <span class="level-icon"></span>
        <div v-if="level.data">
          <div class="flex flex-row valign-wrapper">
            <div class="player-score-box-level">{{ getLevelDifficulty(musicId, level.level) }}</div>
            <div class="result-icon" :class="getResultIconClass(level.data.fcap)"></div>
            <div class="result-icon" :class="getMultiIconClass(level.data)"></div>
            <div class="player-score-box-achievement">{{(level.data.achievement / 100).toFixed(2)}}%</div>
            <div class="player-score-box-score">{{formatScore(level.data.scoreMax)}}</div>
          </div>
          <div class="flex flex-row flex-2 player-score-box-count-box">
            <div>{{$t('play_count')}}{{level.data.playCount}}</div>
            <div>{{$t('max_sync')}}{{(level.data.syncRateMax / 100).toFixed(2)}}%</div>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-row valign-wrapper">
            <div class="player-score-box-level">{{ getLevelDifficulty(musicId, level.level) }}</div>
            <div class="result-icon result-icon-none"></div>
            <div class="result-icon result-icon-none"></div>
            <div class="player-score-box-achievement">---%</div>
            <div class="player-score-box-score">---,---</div>
          </div>
          <div class="flex flex-row flex-2 player-score-box-count-box">
            <div>{{$t('play_count')}}0</div>
            <div>{{$t('max_sync')}}---%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "player_score_loading": "Loading scores...",
    "player_score_failed": "Failed loading player scores",
    "retry": "Retry",
    "play_count": "Play Count: ",
    "max_sync": "Max Sync Rate: ",
    "":""
  },
  "zh": {
    "player_score_loading": "获取分数中...",
    "player_score_failed": "获取玩家分数失败",
    "retry": "重试",
    "play_count": "游玩次数：",
    "max_sync": "最大Sync：",
    "":""
  }
}
</i18n>

<style scoped>
.player-score-box-level {
  font-size:20px;
  width:100px;
  text-align:center;
  padding: 10px 0
}
.player-score-box-achievement {
  font-size: 25px;
}
.player-score-box-achievement,.player-score-box-score {
  width: calc((100% - 180px) / 2)
}
.player-score-box-count-box {
  padding:0 10px 10px
}
</style>

<script>
import { authHeader, checkTokenValidity } from '@/components/accUtils'
import { getMusicLevelConstant } from '@/components/musicUtils.js'

export default {
  props: {
    musicId: Number,
    levels: Array
  },
  data: () => ({
    playerScoreLoaded: false,
    playerScoreLoadFailed: false,
  }),
  computed: {
    levelsData () {
      return this.levels.map(level => {
        const lvlData = this.$store.state.playerScores[this.musicId][level]
        if (!lvlData) return {
          level,
          data: null
        }
        return {
          level,
          data: lvlData
        }
      })
    }
  },
  mounted () {
    this.loadPlayerScores()
  },
  methods: {
    getMusicLevelConstant,
    async loadPlayerScores () {
      if (!this.$store.state.playerScores) {
        this.playerScoreLoaded = false
        this.playerScoreLoadFailed = false
        try {
        const playerScoresJson = await fetch(this.$store.state.endpoint + '/PlayerScore', {
          headers: authHeader()
        }).then(checkTokenValidity.bind(this))
        //console.log(playerScoresJson)
        if (playerScoresJson.code !== 0) {
          this.playerScoreLoadFailed = true
          this.playerScoreLoaded = true
          return
        }
        const col = {}
        playerScoresJson.data.cols.forEach((i, idx) => col[i] = idx)
        const playerScores = {}
        playerScoresJson.data.rows.forEach(r => {
          const mid = r[col.music_id]
          if (!playerScores[mid]) playerScores[mid] = {}
          playerScores[mid][r[col.level]] = {
            playCount: r[col.play_count],
            achievement: r[col.achievement],
            scoreMax: r[col.score_max],
            syncRateMax: r[col.sync_rate_max],
            maxFever: r[col.max_fever],
            fcap: r[col.is_all_perfect_plus] === 'true' ? 4 : r[col.is_all_perfect] ? 3 : r[col.full_combo],
          }
        })
        this.$store.commit('setPlayerScores', playerScores)
        } catch (e) {
          this.playerScoreLoadFailed = true
          this.playerScoreLoaded = true
          return
        }
      }
      this.playerScoreLoaded = true
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
    getLevelClass (lvl) {
      if (lvl === 1) return 'lvl-eas'
      if (lvl === 2) return 'lvl-bas'
      if (lvl === 3) return 'lvl-adv'
      if (lvl === 4) return 'lvl-exp'
      if (lvl === 5) return 'lvl-mas'
      if (lvl === 6) return 'lvl-rem'
      return 'lvl-utage'
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
    getMultiIconClass (item) {
      if (item.syncRateMax === 10000) {
        return 'result-icon-100sync'
      }
      switch (item.maxFever) {
        case 2: {
          return 'result-icon-mfp'
        }
        case 1: {
          return 'result-icon-mf'
        }
      }
      if (item.syncRateMax > 0) {
        return 'result-icon-sync'
      }
      return 'result-icon-none'
    },
    formatScore (s) {
      if (typeof s !== 'number') return s
      return s.toLocaleString('en')
    },
  }
}
</script>