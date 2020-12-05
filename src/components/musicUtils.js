let musicInfos

/**
 * 
 * @param {number} id music id
 * @return {string} music name
 */
export function getMusicName (id) {
  return musicInfos[id] ? musicInfos[id].title : `id ${id}`
}

/**
 * 
 * @param {number} id music id
 * @return {string} jacket url
 */
export function getMusicJacketUrl (id) {
  if (id < 10) id = `00${id}`
  else if (id < 100) id = `0${id}`
  return `https://n.bzxyzt.cn/assets/jacket/${id}.jpg`
}

/**
 * 
 * @param {string} i input string
 * @return {number} value as number
 */
function parseNumValue (i) {
  const out = parseFloat(i)
  if (isNaN(out)) return 0
  return out
}

function parseMusicInfoCsv () {
  "use strict"
  const lines = localStorage.musicDataCsv.replace(/\r/g, '').trim().split('\n')
  const cols = lines.shift().split(',')
  musicInfos = {}
  const numCols = ['deleted', 'genre', 'lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6', 'scr1', 'scr2', 'scr3', 'scr4', 'scr5', 'scr6']
  lines.forEach(line => {
    const vals = line.split(',')
    const musicInfo = {}
    for (let i = 0; i < cols.length; i++) {
      musicInfo[cols[i]] = numCols.indexOf(cols[i]) !== -1 ? parseNumValue(vals[i]) : vals[i]
    }
    const musicId = musicInfo.id
    delete musicInfo.id
    musicInfos[musicId] = musicInfo
  })
}

export async function initMusicInfo () {
  if (musicInfos) return
  let musicDataVer
  try {
    musicDataVer = await fetch('https://n.bzxyzt.cn/cors_resources/musicData.json').then(r => r.json())
  } catch (e) {
    if (localStorage.musicDataCsv && localStorage.musicDataVer) {
      musicDataVer = { ver: localStorage.musicDataVer }
    }
  }
  if (!localStorage.musicDataCsv || localStorage.musicDataVer !== musicDataVer.ver) {
    const musicDataCsv = await fetch(`https://n.bzxyzt.cn/cors_resources/musicData.csv?${musicDataVer.ver}`).then(r => r.text())
    localStorage.musicDataCsv = musicDataCsv
    localStorage.musicDataVer = musicDataVer.ver
  }
  parseMusicInfoCsv()
}

function img_lazyload (){
  var t = [].slice.call(document.getElementsByTagName("img"));
  t.forEach(function (t) {
    if (t.hasAttribute("_src")) {
      var e = t.getBoundingClientRect();
      e.bottom < -100 || e.top > innerHeight + 1000 || e.right < -1000 || e.left > innerWidth + 100 || (t.setAttribute("src", t.getAttribute("_src")), t.removeAttribute("_src"))
    }
  })
}
window.addEventListener("scroll", img_lazyload)
window.addEventListener("resize", img_lazyload)
window.addEventListener("trigger-lazyload", img_lazyload)
