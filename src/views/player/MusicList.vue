<template>
  <div>
    <h3>{{ $t('title') }}</h3>
    <PlayerNavBar></PlayerNavBar>
    <ScoreSubNavBar></ScoreSubNavBar>
    <p class="flex flex-row flex-3 center-align">
      <label>
        <input type="radio" name="filter-type" value="default" v-model="filterType" @change="fillList" checked />
        <span>{{ $t('filter-type-finale') }}</span>
      </label>
      <label>
        <input type="radio" name="filter-type" value="fanmade" v-model="filterType" @change="fillList" />
        <span>{{ $t('filter-type-fanmade') }}</span>
      </label>
      <label>
        <input type="radio" name="filter-type" value="dxTransform" v-model="filterType" @change="fillList" />
        <span>{{ $t('filter-type-dx') }}</span>
      </label>
    </p>
    <div class="narrow-column">
      <div v-for="item in musicList" :key="item.id" class="card music-item row">
        <div class="music-jacket" :class="{'music-deleted':isMusicDeleted(item.id)}"><img :_src="getMusicJacketUrl(item.id)" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="></div>
        <div class="col s10">
          <div class="text-overflow-hide">{{ item.title }}</div>
          <hr>
          <div class="text-overflow-hide">{{ item.artist }}</div>
        </div>
        <div class="difficulty-box center-align">
          <div class="flex flex-row flex-3">
            <div><div class="lvl-eas" v-show="item.lvl1"><router-link :to="`/ranking/score?music_id=${item.id}&level=1`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl1) }}</span></router-link></div></div>
            <div><div class="lvl-bas" v-show="item.lvl2"><router-link :to="`/ranking/score?music_id=${item.id}&level=2`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl2) }}</span></router-link></div></div>
            <div><div class="lvl-adv" v-show="item.lvl3"><router-link :to="`/ranking/score?music_id=${item.id}&level=3`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl3) }}</span></router-link></div></div>
          </div>
          <div class="flex flex-row flex-3">
            <div><div class="lvl-exp" v-show="item.lvl4"><router-link :to="`/ranking/score?music_id=${item.id}&level=4`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl4) }}</span></router-link></div></div>
            <div><div class="lvl-mas" v-show="item.lvl5"><router-link :to="`/ranking/score?music_id=${item.id}&level=5`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl5) }}</span></router-link></div></div>
            <div><div class="lvl-rem" v-show="item.lvl6"><router-link :to="`/ranking/score?music_id=${item.id}&level=6`"><span class="level-icon"></span><span class="diffi-text right-align">{{ getLevelDifficulty(item.lvl6) }}</span></router-link></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Music List",
    "filter-type-finale": "FiNALE",
    "filter-type-fanmade": "Fanmade",
    "filter-type-dx": "From DX",
    "a": "z"
  },
  "zh": {
    "title": "歌曲列表",
    "filter-type-finale": "FiNALE",
    "filter-type-fanmade": "创作谱面",
    "filter-type-dx": "DX转谱",
    "a": "z"
  }
}
</i18n>

<style scoped>
.music-jacket {
  float:left
}
.music-jacket>img {
  width:50px
}
.difficulty-box {
  clear:both
}
hr {
  margin: 3px 0
}
a {
  color:inherit
}
.music-jacket.music-deleted::after{
  width:50px;
  height:50px;
  background-size:50px 50px;
}
.difficulty-box > div > div > div {
  padding: 5px 0
}
.difficulty-box > div > div > div > a {
	width: 100%;
	height: 100%;
	display: block;
}
.diffi-text {
  width: 2em;
  display:inline-block;
}
</style>

<script>
import PlayerNavBar from '@/components/PlayerNavBar'
import ScoreSubNavBar from '@/components/ScoreSubNavBar'
import { getMusicName, getMusicJacketUrl, isMusicDeleted, getMusicLevelConstant, getMusicList } from '@/components/musicUtils.js'

export default {
  components: {
    PlayerNavBar,
    ScoreSubNavBar
  },
  data: () => ({
    musicList: [],
    filterType: "default"
  }),
  mounted () {
    this.fillList()
  },
  methods: {
    isMusicDeleted,
    getMusicJacketUrl,
    fillList () {
      this.musicList = getMusicList({
        default: this.filterType === "default",
        fanmade: this.filterType === "fanmade",
        dxTransform: this.filterType === "dxTransform"
      })

      setTimeout(() => {
        window.dispatchEvent(new Event('trigger-timeago'))
        window.dispatchEvent(new Event('trigger-lazyload'))
      })
    },
    getLevelDifficulty (constant) {
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
  }
}
</script>