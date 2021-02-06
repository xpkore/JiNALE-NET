<template>
  <div>
    <div class="row center nav-item-row">
      <div class="col s6 nav-item"><router-link to="/player/recent_play">
        <div>{{ $t('recent') }}</div>
      </router-link></div>
      <div class="col s6 nav-item"><router-link to="/player/music_list">
        <div>{{ $t('list') }}</div>
      </router-link></div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "list": "Music list",
    "recent": "Recent play"
  },
  "zh": {
    "list": "歌曲列表",
    "recent": "最近游玩"
  }
}
</i18n>

<style scoped>
a {color:inherit}
.nav-item-row {
  margin-left: 40px;
  margin-right: 40px;
}
</style>
