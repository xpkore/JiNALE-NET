import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const locale = navigator.language.indexOf('zh') !== -1 ? 'zh' : 'en'

document.body.setAttribute('lang', locale)

export default new VueI18n({
  locale: locale
})
