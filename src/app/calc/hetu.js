import {getRandomInt} from "../util/util"
import {zeroPad} from "../util/strings"

/* Hetu (Henkilötunnus, Finnish Social Security Number) */
/* ---------------------------------------------------- */
const hetuChecks = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K',
    'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']

const hetuSeparators = ['A', '-', '+']

export function check(hetu) {
    if (hetu.length != 10) {
        return
    }
    const date = hetu.substr(0, 6)
    const mark = hetu.charAt(6)
    const start = 7
    if (hetuSeparators.indexOf(mark) == -1) {
        // Invalid separator
        return
    }
    // Get hetu order num
    const order = hetu.substr(start, 3)

    const num = parseInt(`${date}${order}`, 10)
    const check = num % 31
    return (check < 10) ? check : hetuChecks[check - 10]
}

export function generate() {
    // TODO: Use a date lib to generate all dates
    const day = getRandomInt(1, 29)
    const month = getRandomInt(1, 13)
    let year = getRandomInt(50, 114)
    let check = "-"
    if (year > 99) {
        year -= 100
        check = "A"
    }
    const counter = getRandomInt(1, 999)
    return zeroPad(day, 2) + zeroPad(month, 2) + zeroPad(year, 2) + check + zeroPad(counter, 3)
}
