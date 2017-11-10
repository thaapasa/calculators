import {isObject,isArray} from "./util"

interface StorageType {
    [key: string]: string
}
const storage: StorageType = isObject(window.localStorage) ? window.localStorage : {}

export function set(key: string, value: string): any {
    storage[key] = value
}

export function get(key: string) {
    return storage[key]
}

export function setArray(key: string, arr: string[]) {
    if (isArray(arr)) {
        deleteArray(key)
        storage[`${key}.length`] = arr.length.toString()
        for (let i = 0; i < arr.length; ++i) {
            storage[`${key}.${i}`] = arr[i]
        }
    }
}

export function deleteArray(key: string) {
    const n = parseInt(storage[`${key}.length`], 10)
    for (let i = 0; i < n; ++i) {
        delete storage[`${key}.${i}`]
    }
    delete storage[`${key}.length`]
}

export function getArray(key: string): string[] {
    const n = parseInt(storage[`${key}.length`], 10)
    if (n === 0 || n > 0) {
        const res = []
        for (let i = 0; i < n; ++i) {
            res.push(storage[`${key}.${i}`])
        }
        return res
    }
    return []
}
