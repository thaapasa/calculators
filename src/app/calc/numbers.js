import * as util from "../util/util"

export function intToBinaryStr(value) {
    if (!util.isDefined(value)) return
    let res = ""
    let remaining = strToInt(value)
    while (remaining > 1) {
        res += (remaining & 0b1)
        remaining >>= 1
    }
    res += remaining
    return util.reverse(res)
}

export function binaryStrToInt(value) {
    if (!util.isDefined(value) || value.match(/[^01]/)) return NaN
    return parseInt(value, 2)
}

export function decimalStrToInt(value) {
    if (!util.isDefined(value)) return NaN
    if (typeof value == "number") return value
    if (value.match(/[^0-9]/)) return NaN
    return parseInt(value, 10)
}

export function strToInt(v) { return decimalStrToInt(v) }

export function intToStr(value) { return util.isDefined(value) ? value.toString() : undefined }
