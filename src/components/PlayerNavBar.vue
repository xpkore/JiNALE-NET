<template>
  <div>
    <div class="row center nav-item-row">
      <div class="col s6 nav-item"><router-link to="/player/home">
        <div><div class="nav-bar-icon icon-home"></div></div>
        <div>{{ $t('home') }}</div>
      </router-link></div>
      <div class="col s6 nav-item"><router-link to="/player/recent_play">
        <div><div class="nav-bar-icon icon-recent"></div></div>
        <div>{{ $t('recent') }}</div>
      </router-link></div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "home": "Home",
    "recent": "Scores"
  },
  "zh": {
    "home": "首页",
    "recent": "我的记录"
  }
}
</i18n>

<style scoped>
a {color:inherit}
.nav-bar-icon {
  height:64px;
  width: 64px;
  display:inline-block;
  background-size: auto 64px;
  background-position: center;
  background-repeat: no-repeat;
}
.icon-home {
  background-image: url('https://web-api.jinale.com/assets/chara/milk/sd_salt.png');
}
.icon-recent {
  background-image: url('https://web-api.jinale.com/assets/UI_MSS_MBase_Icon_APp@2x.png')
}
</style>
