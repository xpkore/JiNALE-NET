<template>
  <div>
    <h3>{{ $t('title') }}</h3>
    <PlayerNavBar></PlayerNavBar>
    <div class="recent-plays">
      <form class="right-align">
        <p>
        <label>
          <input type="checkbox" autocomplete="off" @change="showAllDetailScore = !showAllDetailScore">
          <span>{{$t('show_all_details')}}</span>
        </label>
        </p>
      </form>
      <div v-if="!playlogLoaded">
        <p>{{ $t('playlog_loading') }}</p>
      </div>
      <div v-else-if="playlogLoadFailed">
        <p>{{ $t('playlog_failed') }}</p>
        <a class="col waves-effect waves-light btn" @click="loadPlaylog(loadingPage)">{{ $t('retry') }}</a>
      </div>
      <div v-else>
        <ul class="pagination row s12" v-if="pageInfo.pages > 1">
          <li class="col s2 waves-effect" v-if="pageInfo.page > 1"><a :data-page="pageInfo.page-1" @click="loadPlaylog($event.target.dataset.page)" href="javascript:">＜</a></li>
          <li class="col s2 waves-effect disabled" v-else><a>＜</a></li>
          <li class="col s8">{{pageInfo.page}}／{{pageInfo.pages}}</li>
          <li class="col s2 waves-effect" v-if="pageInfo.page < pageInfo.pages"><a :data-page="pageInfo.page+1" @click="loadPlaylog($event.target.dataset.page)" href="javascript:">＞</a></li>
          <li class="col s2 waves-effect disabled" v-else><a>＞</a></li>
        </ul>
        <template v-for="item in playlogData">
          <div class="playlog-item" :key="`playlog-${item.user_play_date}`">
            <div class="card" :class="getLevelClass(item)">
              <div class="flex flex-row flex-2">
                <span>
                  <span>Track {{item.track.toString().padStart(2, 0)}}</span>
                  <span class="level-icon"></span>
                </span>
                <span class="hoveritem right-align">
                  <span class="normal timeago" :datetime="playDate(item)">{{ playDateStr(item) }}</span>
                  <span class="hover">{{ playDateStr(item) }}</span>
                </span>
              </div>
              <div class="score-rank">{{item._rank}}</div>
              <div class="music-name">{{ getMusicName(item.music_id) }}</div>
              <div class="row playlog-info">
                <div class="music-jacket"><img :_src="getMusicJacketUrl(item.music_id)" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="></div>
                <div class="col s7 playlog-info-right">
                  <div class="flex flex-row">
                    <div class="achievement">
                      <span class="achievement-big">{{Math.floor(item.achievement/100)}}</span>
                      <span>{{((item.achievement%100)/100).toFixed(2).substr(1)}} %</span>
                      <span class="new-record" v-show="item.is_high_score === 'true'">{{$t('new_record')}}</span>
                    </div>
                    <div class="score center-align">
                      <span>{{formatScore(item.score)}}</span>
                      <span class="until-next-rank">{{$t('until_next_rank')}}{{formatScore(scoreUntilNextRank(item))}}</span>
                    </div>
                  </div>
                  <div class="combo-text">
                    <span>Combo: {{item.max_combo}} / {{item._total_notes}}</span>
                    <div class="result-icon" :class="getResultIconClass(item)"></div>
                    <div class="result-icon" :class="getMultiIconClass(item)"></div>
                  </div>
                  <div class="right-align" v-show="!showAllDetailScore">
                    <div class="detail-toggle-box" @click="toggleDetail(item.user_play_date)">{{$t(showDetailScore === item.user_play_date ? 'hide_detail' : 'show_detail')}}</div>
                  </div>
                </div>
                <div class="detail-box" :class="{show:showAllDetailScore || showDetailScore === item.user_play_date}">
                  <div class="flex flex-row flex-2 center-align" v-if="item.judge_style !== 0 || item.challenge_life > 0">
                    <span>{{item.judge_style ? $t('judge_style') + ['','マジ','ガチ','ゴリ'][item.judge_style] : ''}}</span>
                    <span>{{item.challenge_life ? ($t(item.is_challenge_track === 'true' ? 'challenge_track' : 'survival_track') + item.challenge_remain +'/'+ item.challenge_life) : ''}}</span>
                  </div>
                  <table class="score-detail-table">
                    <thead>
                      <tr>
                        <th></th><th>Perfect</th><th>Great</th><th>Good</th><th>Miss</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Tap</th><td>{{item.tap_perfect}}</td><td>{{item.tap_great}}</td><td>{{item.tap_good}}</td><td>{{item.tap_bad}}</td><td :class="{'perfect-score':isPerfectScore(item, 0)}">{{item.tap_score}}</td>
                      </tr>
                      <tr>
                        <th>Hold</th><td>{{item.hold_perfect}}</td><td>{{item.hold_great}}</td><td>{{item.hold_good}}</td><td>{{item.hold_bad}}</td><td :class="{'perfect-score':isPerfectScore(item, 1)}">{{item.hold_score}}</td>
                      </tr>
                      <tr>
                        <th>Slide</th><td>{{item.slide_perfect}}</td><td>{{item.slide_great}}</td><td>{{item.slide_good}}</td><td>{{item.slide_bad}}</td><td :class="{'perfect-score':isPerfectScore(item, 2)}">{{item.slide_score}}</td>
                      </tr>
                      <tr>
                        <th>Break</th><td>{{item.break_perfect}}</td><td>{{item.break_great}}</td><td>{{item.break_good}}</td><td>{{item.break_bad}}</td><td :class="{'perfect-score':isPerfectScore(item, 3)}">{{item.break_score}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="item.game_mode !== 0" class="multiplayer-list">
                    <div>{{$t((item.game_mode - 1) ? 'rivals' : 'friends')}}</div>
                    <div class="flex flex-row flex-3 center-align">
                      <div>{{item.played_user_name1}}</div>
                      <div>{{item.played_user_name2}}</div>
                      <div>{{item.played_user_name3}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <ul class="pagination row s12" v-if="pageInfo.pages > 1">
          <li class="col s2 waves-effect" v-if="pageInfo.page > 1"><a :data-page="pageInfo.page-1" @click="loadPlaylog($event.target.dataset.page)" href="javascript:">＜</a></li>
          <li class="col s2 waves-effect disabled" v-else><a>＜</a></li>
          <li class="col s8">{{pageInfo.page}}／{{pageInfo.pages}}</li>
          <li class="col s2 waves-effect" v-if="pageInfo.page < pageInfo.pages"><a :data-page="pageInfo.page+1" @click="loadPlaylog($event.target.dataset.page)" href="javascript:">＞</a></li>
          <li class="col s2 waves-effect disabled" v-else><a>＞</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Recent plays",
    "playlog_loading": "Loading...",
    "playlog_failed": "Failed loading recent plays",
    "retry": "Retry",
    "new_record": "New Record",
    "until_next_rank": "　Next rank: \n",
    "rivals": "Rivals",
    "friends": "Friends",
    "show_detail": "Show detail",
    "hide_detail": "Hide detail",
    "show_all_details": "Show all details",
    "judge_style": "Judge style: ",
    "challenge_track":"Challenge Track Life: ",
    "survival_track":"Survival Course Life: "
  },
  "zh": {
    "title": "游玩记录",
    "playlog_loading": "获取中...",
    "playlog_failed": "获取记录失败",
    "retry": "重试",
    "new_record": "新纪录",
    "until_next_rank": "　距下一评级：\n",
    "rivals": "对手",
    "friends": "好友",
    "show_detail": "显示详细",
    "hide_detail": "隐藏详细",
    "show_all_details": "展开所有详细",
    "judge_style": "严判：",
    "challenge_track":"Challenge Track血量：",
    "survival_track":"段位认证 血量："
  }
}
</i18n>

<style scoped>
.recent-plays {
  max-width:400px;
  margin:0 auto
}
.flex {display:flex}
.flex.flex-column {flex-direction: column}
.flex.flex-row {flex-direction: row}
.flex-2>* {width:50%}
.flex-3>* {width:calc(100% / 3)}
.level {margin-left:10px}
.score-rank {
  float:right;
  font-size:25px;
  margin-right:10px;
  font-weight: bold;
}
.music-name {
	padding: 10px;
	overflow: hidden;
	text-overflow: ellipsis;
}
.music-jacket {
  float:left;
}
.music-jacket>img {
  width:128px
}
.col.playlog-info-right {
  margin-left: 10px;
  width: calc(100% - 138px)
}
.achievement {
  font-size:20px;
  position: relative;
  white-space: pre;
  width:55%;
}
.achievement-big {
  font-size:30px
}
.new-record {
	font-size: 12px;
	font-weight: bold;
	position: absolute;
	top: 2px;
	left: 55px;
	line-height: 12px;
}
.score {
  font-size:16px;
  position: relative;
  width:45%;
}
.until-next-rank {
	font-size: 11px;
	position: absolute;
	top: 23px;
	left: 0;
	line-height: 11px;
	width: 100%;
  white-space: pre-wrap
}
.fc-text {
  font-weight: bold
}
.score-detail-table * {text-align: right}
.score-detail-table tr>:nth-child(2) {color: rgb(255,126,0);}
.score-detail-table tr>:nth-child(3) {color: rgb(255,47,116);}
.score-detail-table tr>:nth-child(4) {color: rgb(40,190,0);}
.score-detail-table tr>:nth-child(5) {color: rgb(114,114,114);}
.score-detail-table tbody .perfect-score {color:rgb(255,174,0)}
.multiplayer-list,.score-detail-table {
  border-top: solid 1px gray;
  padding-top:5px
}
.detail-box {
  overflow: hidden;
  width:100%;
  transition:max-height .5s;
  max-height:0
}
.detail-box.show {max-height:500px}
.detail-toggle-box {
  cursor:pointer;
  border-radius:10px;
  line-height:20px;
  background:darkgray;
  padding:5px 10px;
  display:inline;
  color:black
}
</style>

<script>
import { getShopName } from '@/components/shopUtils'
import { standardizeDate, dateToLocalStr } from '@/components/dateUtils'
import { checkTokenValidity, authHeader } from '@/components/accUtils'
import { getMusicName, getMusicJacketUrl } from '@/components/musicUtils.js'
import PlayerNavBar from '@/components/PlayerNavBar'

export default {
  components: {
    PlayerNavBar
  },
  data: () => ({
    playlogLoaded: false,
    playlogLoadFailed: false,
    playlogData: null,
    pageInfo: {},
    loadingPage: 0,

    showAllDetailScore: false,
    showDetailScore: ''
  }),
  mounted () {
    this.loadPlaylog()
  },
  methods: {
    loadPlaylog (page = 0) {
      this.playlogLoaded = false
      this.playlogLoadFailed = false
      this.playlogData = null

      this.loadPlaylogData(page).then(d => {
        if (d) {
          const cols = d.data.cols
          const playlogData = d.data.rows.map(r => {
            const row = {}
            for (let i = 0; i < cols.length; i++) {
              row[cols[i]] = r[i].toString().match(/^\d+(\.\d+)?$/) !== null ? parseFloat(r[i]) : r[i]
            }
            row._tap_notes = ['tap_perfect','tap_great','tap_good','tap_bad'].map(i => row[i] || 0).reduce((s,i) => s+i, 0)
            row._hold_notes = ['hold_perfect','hold_great','hold_good','hold_bad'].map(i => row[i] || 0).reduce((s,i) => s+i, 0)
            row._slide_notes = ['slide_perfect','slide_great','slide_good','slide_bad'].map(i => row[i] || 0).reduce((s,i) => s+i, 0)
            row._break_notes = ['break_perfect','break_great','break_good','break_bad'].map(i => row[i] || 0).reduce((s,i) => s+i, 0)
            row._total_notes = ['_tap_notes','_hold_notes','_slide_notes','_break_notes'].map(i => row[i] || 0).reduce((s,i) => s+i, 0)
            row._100p_score = row._tap_notes * 500 + row._hold_notes * 1000 + row._slide_notes * 1500 + row._break_notes * 2500
            row._rank = this.getScoreRank(row)
            return row
          })
          this.playlogData = playlogData
          this.pageInfo = d.data.page
          setTimeout(() => {
            window.dispatchEvent(new Event('trigger-timeago'))
            window.dispatchEvent(new Event('trigger-lazyload'))
          })
        } else {
          this.playlogLoadFailed = true
        }
        this.playlogLoaded = true
      })
    },
    loadPlaylogData (page) {
      this.loadingPage = page
      if (page == 0 && this.$store.state.playlogResponse) {
        return Promise.resolve(this.$store.state.playlogResponse)
      }
      return fetch(this.$store.state.endpoint + `/PlayerPlaylog?page=${page}`, {
        method: 'GET',
        headers: authHeader()
      }).then(checkTokenValidity.bind(this)).then(d => {
        if (d.code) {
          this.playlogLoadFailed = true
          return null
        } else {
          this.$store.commit('savePlaylogResponse', d)
          return d
        }
      })
    },
    getMusicName,
    getMusicJacketUrl,
    getResultIconClass (item) {
      if (item.is_all_perfect_plus === 1) {
        return 'result-icon-app'
      } else if (item.is_all_perfect === 'true') {
        return 'result-icon-ap'
      } else {
        const fc = item.full_combo
        switch (fc) {
          case 2: {
            return 'result-icon-fcp'
          }
          case 1: {
            return 'result-icon-fc'
          }
        }
        return 'result-icon-none'
      }
    },
    getMultiIconClass (item) {
      if (item.game_mode === 1) {
        if (item.sync_rate === 10000) {
          return 'result-icon-100sync'
        }
        return 'result-icon-sync'
      } else if (item.game_mode === 2) {
        switch (item.max_fever) {
          case 2: {
            return 'result-icon-mfp'
          }
          case 1: {
            return 'result-icon-mf'
          }
        }
      }
      return 'result-icon-none'
    },
    playDate (item) {
      return standardizeDate(item.user_play_date).toISOString()
    },
    playDateStr (item) {
      return dateToLocalStr(item.user_play_date, true)
    },
    isPerfectScore (item, noteType) {
      /**
       * noteType:
       * 0 = tap, 1 = hold, 2 = slide, 3 = break
       */
      const noteScore = [500, 1000, 1500, 2600][noteType]
      noteType = ['tap', 'hold', 'slide', 'break'][noteType]
      return item[`${noteType}_bad`] === 0
        && item[`${noteType}_good`] === 0
        && item[`${noteType}_great`] === 0
        && item[`${noteType}_score`] === item[`${noteType}_perfect`] * noteScore
    },
    getScoreRank (item) {
      const ach = item.achievement
      if (ach >= 10000) {
        if (item.score === item._100p_score + item._break_notes * 100) return 'SSS+'
        return 'SSS'
      } else if (ach >= 9950) {
        return 'SS+'
      } else if (ach >= 9900) {
        return 'SS'
      } else if (ach >= 9800) {
        return 'S+'
      } else if (ach >= 9700) {
        return 'S'
      } else if (ach >= 9400) {
        return 'AAA'
      } else if (ach >= 9000) {
        return 'AA'
      } else if (ach >= 8000) {
        return 'A'
      } else if (ach >= 6000) {
        return 'B'
      } else if (ach >= 4000) {
        return 'C'
      } else if (ach >= 2000) {
        return 'D'
      } else if (ach >= 1000) {
        return 'E'
      } else {
        return 'F'
      }
    },
    formatScore (s) {
      if (typeof s !== 'number') return s
      return s.toLocaleString('en')
    },
    scoreUntilNextRank (item) {
      const ach = item.achievement
      if (ach >= 10000) {
        const remaining = item._100p_score + item._break_notes * 100 - item.score
        if (remaining === 0) return 'MAX'
        return remaining
      } else {
        const nextRank = {'SS+':1,'SS':0.995,'S+':0.99,'S':0.98,'AAA':0.97,'AA':0.94,'A':0.9,'B':0.8,'C':0.6,'D':0.4,'E':0.2,'F':0.1}[item._rank]
        return Math.ceil(item._100p_score / 50 * nextRank) * 50 - item.score
      }
    },
    toggleDetail (d) {
      this.showDetailScore = this.showDetailScore === d ? '' : d
    },
    getLevel (item) {
      const lvl = item.level
      if (lvl === 1) return 'EASY'
      if (lvl === 2) return 'BASIC'
      if (lvl === 3) return 'ADVANCE'
      if (lvl === 4) return 'EXPERT'
      if (lvl === 5) return 'MASTER'
      if (lvl === 6) return 'Re:MASTER'
      return '宴会場'
    },
    getLevelClass (item) {
      const lvl = item.level
      if (lvl === 1) return 'lvl-eas'
      if (lvl === 2) return 'lvl-bas'
      if (lvl === 3) return 'lvl-adv'
      if (lvl === 4) return 'lvl-exp'
      if (lvl === 5) return 'lvl-mas'
      if (lvl === 6) return 'lvl-rem'
      return 'lvl-enkaijou'
    }
  }
}
</script>
