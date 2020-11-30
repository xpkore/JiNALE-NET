<template>
  <div>
    <h3>{{ $t('title') }}</h3>
    <PlayerNavBar></PlayerNavBar>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Recent plays"
  },
  "zh": {
    "title": "游玩记录"
  }
}
</i18n>

<script>
import PlayerNavBar from '@/components/PlayerNavBar'

export default {
  components: {
    PlayerNavBar
  },
}
</script>
