import crypto from 'crypto'
const clientHashSalt = '3012efd1056e7b8bf0f19a79814e906ab0afc81c'

export function hashPassword (pwd) {
  return crypto.createHmac('sha1', clientHashSalt)
    .update(pwd)
    .digest('hex').toLowerCase()
}
