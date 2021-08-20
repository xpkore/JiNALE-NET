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
    <p class="flex flex-row flex-2 center-align">
      <span>
        <div class="input-field filter-select"><select id="filter-genre" v-model="filterGenre" @change="fillList">
          <option value="4">{{$t('label_genre_4')}}</option>
          <option value="5">{{$t('label_genre_5')}}</option>
          <option value="6">{{$t('label_genre_6')}}</option>
          <option value="7">{{$t('label_genre_7')}}</option>
          <option value="8">{{$t('label_genre_8')}}</option>
          <option value="9">{{$t('label_genre_9')}}</option>
          <option value="0">{{$t('label_genre_0')}}</option>
        </select>
        <label>{{ $t('filter-type-genre') }}</label></div>
      </span>
      <span>
        <div class="input-field filter-select"><select v-model="filterSort" @change="fillList">
          <option value="1">{{$t('label_sort_1')}}</option>
          <option value="11">{{$t('label_sort_11')}}</option>
        </select>
        <label>{{ $t('filter-type-sort') }}</label></div>
      </span>
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
    "label_genre_4": "Pops & Anime",
    "label_genre_5": "Vocaloid",
    "label_genre_6": "Touhou",
    "label_genre_7": "SEGA",
    "label_genre_8": "Variety",
    "label_genre_9": "Original",
    "label_genre_0": "All Musics",
    "filter-type-genre": "Genre",
    "label_sort_1": "Ascending (id)",
    "label_sort_11": "Descending (id)",
    "filter-type-sort" : "Sort order",
    "a": "z"
  },
  "zh": {
    "title": "歌曲列表",
    "filter-type-finale": "FiNALE",
    "filter-type-fanmade": "创作谱面",
    "filter-type-dx": "DX转谱",
    "label_genre_4": "流行&动漫",
    "label_genre_5": "Vocaloid",
    "label_genre_6": "东方",
    "label_genre_7": "SEGA",
    "label_genre_8": "其他游戏",
    "label_genre_9": "原创",
    "label_genre_0": "所有乐曲",
    "filter-type-genre": "分类",
    "label_sort_1": "升序 (id)",
    "label_sort_11": "降序 (id)",
    "filter-type-sort" : "排序",
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
.filter-select {
  width: 150px;
  text-align: center;
  margin: 1rem auto;
}
</style>

<script>
import PlayerNavBar from '@/components/PlayerNavBar'
import ScoreSubNavBar from '@/components/ScoreSubNavBar'
import { getMusicName, getMusicJacketUrl, isMusicDeleted, getMusicLevelConstant, getMusicList } from '@/components/musicUtils.js'
import M from 'materialize-css'

export default {
  components: {
    PlayerNavBar,
    ScoreSubNavBar
  },
  data: () => ({
    musicList: [],
    filterType: "default",
    filterGenre: "4",
    filterSort: "11",
  }),
  mounted () {
    M.FormSelect.init(document.querySelectorAll('select'))
    this.fillList()
  },
  methods: {
    isMusicDeleted,
    getMusicJacketUrl,
    fillList () {
      this.musicList = getMusicList({
        default: this.filterType === "default",
        fanmade: this.filterType === "fanmade",
        dxTransform: this.filterType === "dxTransform",
        genre: parseInt(this.filterGenre)
      })
      if (this.filterSort === '11') {
        this.musicList = this.musicList.reverse()
      }

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