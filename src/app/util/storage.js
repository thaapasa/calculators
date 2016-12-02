import {isObject,isArray} from "./util"

const storage = isObject(window.localStorage) ? window.localStorage : {}

export function set(key, value) {
    storage[key] = value
    return this
}

export function get(key) {
    return storage[key]
}

export function setArray(key, arr) {
    if (isArray(arr)) {
        deleteArray(key)
        storage[`${key}.length`] = arr.length
        for (let i = 0; i < arr.length; ++i) {
            storage[`${key}.${i}`] = arr[i]
        }
    }
}

export function deleteArray(key) {
    const n = parseInt(storage[`${key}.length`], 10)
    for (let i = 0; i < n; ++i) {
        delete storage[`${key}.${i}`]
    }
    delete storage[`${key}.length`]
}

export function getArray(key) {
    const n = parseInt(storage[`${key}.length`], 10)
    if (n === 0 || n > 0) {
        const res = []
        for (let i = 0; i < n; ++i) {
            res.push(storage[`${key}.${i}`])
        }
        return res
    }
}
