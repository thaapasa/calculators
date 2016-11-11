import {reverse} from "../util/util"

export function intToBinaryStr(value) {
    let res = ""
    let remaining = strToInt(value)
    while (remaining > 1) {
        res += (remaining & 0b1)
        remaining >>= 1
    }
    res += remaining
    return reverse(res)
}

export function binaryStrToInt(value) {
    return parseInt(value, 2)
}

export function strToInt(value) { return (typeof value == "number") ? value : parseInt(value, 10) }

export function intToStr(value) { return value.toString() }
