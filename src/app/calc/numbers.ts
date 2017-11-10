import {isDefined,isNumber} from "../util/util"

const binCharsRE = /[^01]/
const octCharsRE = /[^0-7]/
const decCharsRE = /[^0-9]/
const hexCharsRE = /[^0-9A-Fa-f]/
const numChars = "0123456789ABCDEF"

export function binaryStrToInt(value) {
    return strToIntChecked(value, 2, binCharsRE)
}

export function octalStrToInt(value) {
    return strToIntChecked(value, 8, octCharsRE)
}

export function decimalStrToInt(value) {
    return strToIntChecked(value, 10, decCharsRE)
}

export function hexStrToInt(value) {
    return strToIntChecked(value, 16, hexCharsRE)
}

export function strToInt(v) { return decimalStrToInt(v) }

export function intToStr(value) { return isDefined(value) ? value.toString() : undefined }

export function intToHexStr(value): string {
    return intToStrBPC(value, 4)
}

export function intToOctalStr(value) {
    return intToStrBPC(value, 3)
}

export function intToBinaryStr(value) {
    return intToStrBPC(value, 1)
}

export function charToInt(value) {
    if (!isDefined(value)) return NaN
    if (typeof value == "number") return value
    if (typeof value != "string" || value.length === 0) return NaN
    return value.charCodeAt(0)
}

export function intToChar(value) {
    return (typeof value === "number" && !isNaN(value)) ? String.fromCharCode(value) : undefined
}

/* Helper functions */
function strToIntChecked(value, radix, validChars) {
    if (!isDefined(value)) return NaN
    if (typeof value == "number") return value
    if (typeof value != "string") return NaN
    if (value.match(validChars)) return NaN
    return parseInt(value, radix)
}

function toChar(value, radix) {
    if (!isNumber(value) || value < 0 || value >= radix || value >= numChars.length) return
    return numChars.charAt(value)
}

function intToStrBPC(value, bitsPerChar) {
    const radix = 1 << bitsPerChar
    const mask = (1 << bitsPerChar) - 1
    if (!isDefined(value) || typeof value == "object" || isNaN(value)) return
    let remaining = value
    let str = []
    while (remaining > 0) {
        str.push(toChar(remaining & mask, radix))
        remaining >>= bitsPerChar
    }
    if (str.length == 0) str.push("0")
    return str.reverse().join("")
}

