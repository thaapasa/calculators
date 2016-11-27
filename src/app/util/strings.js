import { intToHexStr, hexStrToInt } from "../calc/numbers"

const zeroPadding = "0000000000000000000000000000000000000"

export function zeroPad(str, len, padRight) {
    if (!padRight) {
        return (zeroPadding + str).slice(-len)
    } else {
        return (str + zeroPadding).substring(0, len)
    }
}

export function toUpperCase(value) { return typeof value === "string" ? value.toUpperCase() : undefined }
export function toLowerCase(value) { return typeof value === "string" ? value.toLowerCase() : undefined }

export function reverse(value) { return typeof value === "string" ? value.split("").reverse().join("") : undefined }

export function toHexString(value) {
    if (typeof value !== "string") return
    let output = []
    for (let i = 0; i < value.length; ++i) {
        output.push(zeroPad(intToHexStr(value.charCodeAt(i)), 2))
    }
    return output.join("")
}

export function fromHexString(value) {
    if (typeof value !== "string") return
    let output = []
    for (let i = 0; i < value.length; i += 2) {
        if (i <= value.length - 2) {
            output.push(String.fromCharCode(hexStrToInt(`${value.charAt(i)}${value.charAt(i+1)}`)))
        }
    }
    return output.join("")
}
