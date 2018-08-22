import { randomBytes } from 'crypto'

const allowedChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789-_=!*&'

export function getRandomString(len: number): string {
    const bytes = randomBytes(len)
    let result = ''
    bytes.forEach(b => result += allowedChars[b & 0x3f])
    return result
}
