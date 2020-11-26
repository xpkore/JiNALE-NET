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

export async function initMusicList () {
  if (musicInfos) return
  const musicDataVer = await fetch('https://n.bzxyzt.cn/cors_resources/musicData.json').then(r => r.json())
  if (!localStorage.musicDataCsv || localStorage.musicDataVer !== musicDataVer.ver) {
    const musicDataCsv = await fetch(`https://n.bzxyzt.cn/cors_resources/musicData.csv?${musicDataVer.ver}`).then(r => r.text())
    localStorage.musicDataCsv = musicDataCsv
    localStorage.musicDataVer = musicDataVer.ver
  }
  parseMusicInfoCsv()
}
