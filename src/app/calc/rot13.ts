const a = "a".charCodeAt(0)
const A = "A".charCodeAt(0)
const z = "z".charCodeAt(0)
const Z = "Z".charCodeAt(0)

export function rotN(input, n) {
    if (input == null || input == undefined || typeof input !== "string")
        return

    let output = []
    for (let i = 0; i < input.length; ++i) {
        let c = input.charCodeAt(i)
        if (c >= a && c <= z) c = ((c - a) + n) % 26 + a
        else if (c >= A && c <= Z) c = ((c - A) + n) % 26 + A
        output.push(String.fromCharCode(c))
    }
    return output.join("")
}

export default function rot13(input) {
    return rotN(input, 13)
}
