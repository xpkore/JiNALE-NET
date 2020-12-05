import crypto from 'crypto'
const clientHashSalt = '3012efd1056e7b8bf0f19a79814e906ab0afc81c'
import { initMusicInfo } from './musicUtils'

/**
 * 
 * @param {string} pwd raw password to hash
 * @return {string} hmac hashed password
 */
export function hashPassword (pwd) {
  return crypto.createHmac('sha1', clientHashSalt)
    .update(pwd)
    .digest('hex').toLowerCase()
}

/**
 * 
 * @param {Response} r fetch response
 * @return {Promise<object>} resolved json object
 */
export function checkTokenValidity (r) {
  if (!this.$store) {
    throw new Error('initMyInfo not called with vue binding')
  }
  const tokenStatus = r.headers.get('X-Token-Status')
  if (tokenStatus === 'Revoked') {
    delete localStorage.authToken
    this.$store.commit('updateLoginInfo')
    throw new Error('Token is revoked')
  }
  return r.json()
}

/**
 * 
 * @return {Headers} Headers object with Authentication
 */
export function authHeader () {
  const h = new Headers()
  if (localStorage.authToken) {
    h.append('Authorization', 'Bearer ' + localStorage.authToken)
  }
  return h
}

export async function initMyInfo () {
  if (!this.$store) {
    throw new Error('initMyInfo not called with vue binding')
  }
  const d = await fetch(this.$store.state.endpoint + '/myinfo', {
    method: 'GET',
    headers: authHeader()
  }).then(checkTokenValidity.bind(this))
  if (d.code === 0) {
    this.$store.commit('updateLoginInfo', d.data)
    await initMusicInfo()
  } else {
    this.$store.commit('updateLoginInfo')
  }
}

/**
 * 
 * @param {string} url url to fetch
 * @param {string} body post body for fetch
 * @return {Promise<Response>} initiated fetch request
 */
export function fetchWithPostBody (url, body) {
  const h = authHeader()
  h.append('Content-Type', 'application/x-www-form-urlencoded')
  return fetch(url, {
    method: 'POST',
    headers: h,
    body: body
  })
}
