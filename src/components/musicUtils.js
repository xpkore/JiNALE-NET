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
 * @return {string} artist name
 */
export function getMusicArtist (id) {
  return musicInfos[id] ? musicInfos[id].artist : ''
}

/**
 * 
 * @param {number} id music id
 * @return {string} jacket url
 */
export function getMusicJacketUrl (id) {
  if (id < 10) id = `00${id}`
  else if (id < 100) id = `0${id}`
  return `https://web-api.jinale.com/assets/jacket/${id}.jpg`
}

/**
 * 
 * @param {number} id music id
 * @return {boolean} music is deleted
 */
export function isMusicDeleted (id) {
  return musicInfos[id] && musicInfos[id].deleted ? true : false
}

/**
 * 
 * @param {number} id music id
 * @param {number} level music level
 * @return {number} chart rating constant
 */
export function getMusicLevelConstant (id, level) {
  return musicInfos[id] && musicInfos[id][`lvl${level}`] ? musicInfos[id][`lvl${level}`] : 0
}

/**
 * 
 * @param {number} id music id
 * @param {number} level music level
 * @return {string} charter
 */
export function getMusicLevelCharter (id, level) {
  return musicInfos[id] && musicInfos[id][`charter${level}`] ? musicInfos[id][`charter${level}`] : ''
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

function parseCsvLine (lineIn) {
  let quoted = false
  let quoteBlock = []
  let lineOut = []
  for (let i = 0; i < lineIn.length; i++) {
    const block = lineIn[i]
    if (!quoted) {
      if (block.substr(0, 1) === '"') {
        if (block.substr(-1, 1) === '"') {
          lineOut.push(block.slice(1, -1).replace(/""/g, '"'))
        } else {
          quoted = true
          quoteBlock.push(block)
        }
      } else {
        lineOut.push(block)
      }
    } else {
      quoteBlock.push(block)
      if (block.substr(-1, 1) === '"') {
        quoted = false
        lineOut.push(quoteBlock.join(',').slice(1, -1).replace(/""/g, '"'))
      }
    }
  }
  if (quoted) {
    throw new Error('CSV line parser: Expected quote, EOL found: ' + lineIn.join(','))
  }
  return lineOut
}

function parseMusicInfoCsv () {
  "use strict"
  const lines = localStorage.musicDataCsv.replace(/\r/g, '').trim().split('\n')
  const cols = lines.shift().split(',')
  musicInfos = {}
  const numCols = ['deleted', 'fanmade', 'dx_transform', 'genre', 'lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6']
  lines.forEach(line => {
    const vals = parseCsvLine(line.split(','))
    const musicInfo = {}
    for (let i = 0; i < cols.length; i++) {
      musicInfo[cols[i]] = numCols.indexOf(cols[i]) !== -1 ? parseNumValue(vals[i]) : vals[i]
    }
    const musicId = musicInfo.id
    musicInfos[musicId] = musicInfo
  })
}

export async function initMusicInfo () {
  if (musicInfos) return
  let musicDataVer
  try {
    musicDataVer = await fetch('https://web-api.jinale.com/cors_resources/musicData.json?prevent_cache='+Date.now()).then(r => r.json())
  } catch (e) {
    if (localStorage.musicDataCsv && localStorage.musicDataVer) {
      musicDataVer = { ver: localStorage.musicDataVer }
    }
  }
  if (!localStorage.musicDataCsv || localStorage.musicDataVer !== musicDataVer.ver) {
    const musicDataCsv = await fetch(`https://web-api.jinale.com/cors_resources/musicData.csv?${musicDataVer.ver}`).then(r => r.text())
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


/**
 * 
 * @param {Object} filter - filter config
 * @param {number} [filter.genre=0] - filter for genre
 * @param {boolean} [filter.default=false] - filter default songs
 * @param {boolean} [filter.deleted=false] - filter deleted songs
 * @param {boolean} [filter.fanmade=false] - filter fanmade songs
 * @param {boolean} [filter.dxTransform=false] - filter songs with dx transformed chart
 * @param {boolean} [filter.utage=false] - filter songs with utage charts
 * @return {Array} filtered music list
 */
export function getMusicList (filter) {
  filter = Object.assign({
    genre: 0,
    default: false,
    deleted: false,
    fanmade: false,
    dxTransform: false,
    utage: false,
  }, filter)

  const list = Object.values(musicInfos).filter(i => {
    if (filter.genre !== 0 && i.genre !== filter.genre) return false

    if (filter.utage && i.genre === 16) return true
    else if (!filter.utage && i.genre === 16) return false

    if (i.deleted) { if (filter.deleted) return true }
    else if (i.fanmade && filter.fanmade) return true
    else if (i.dx_transform && filter.dxTransform) return true
    else if (i.id <= 852 && filter.default) return true
    return false
  })
  return list
}
