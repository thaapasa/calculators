import {getRandomInt} from '../util/util'

/* Bank reference number (viitenumero) */
/* ----------------------------------- */
export function generate(): string {
    return getRandomInt(100, 999999999).toString()
}

const BANK_CHECK_WEIGHTS = [7, 3, 1]

export function check(value: string): string {
    if (value === undefined || value == null || value.length < 1) {
        return ''
    }
    let sum = 0
    let c = 0
    for (let i = value.length - 1; i >= 0; i--) {
        const cur = parseInt(value.charAt(i), 10)
        if (isNaN(cur)) {
            return ''
        }
        sum += cur * BANK_CHECK_WEIGHTS[c++ % 3]
    }
    const diff = 10 - (sum % 10)
    return diff < 10 ? diff.toString() : '0'
}
