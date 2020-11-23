import crypto from 'crypto'
const clientHashSalt = '3012efd1056e7b8bf0f19a79814e906ab0afc81c'

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
 * @return {Promise<string>}
 */
export function checkTokenValidity (r) {
  const tokenStatus = r.headers.get('X-Token-Status')
  if (tokenStatus === 'Revoked') {
    delete localStorage.authToken
    if (this.$store) this.$store.commit('updateLoginInfo')
    throw new Error('Token is revoked')
  }
  return r.json()
}
