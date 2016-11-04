import * as util from "../util/util"

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
    const day = util.getRandomInt(1, 29)
    const month = util.getRandomInt(1, 13)
    let year = util.getRandomInt(50, 114)
    let check = "-"
    if (year > 99) {
        year -= 100
        check = "A"
    }
    const counter = util.getRandomInt(1, 999)
    return util.zeroPad(day, 2) + util.zeroPad(month, 2) + util.zeroPad(year, 2) + check + util.zeroPad(counter, 3)
}
