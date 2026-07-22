import crypto from 'crypto'

export function generateSignerToken() {

  return crypto
    .randomBytes(16)
    .toString('hex')
    .toUpperCase()
}