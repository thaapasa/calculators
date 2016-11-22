import * as Bacon from "baconjs"
import log from "./log"

export function addBaconSafeLog() {
    Bacon.Observable.prototype.safeLog = function (title) {
        return this.map(safeLog(title))
    }
}

export function safeLog(title) {
    return function (value) {
        log(`${title}: ${value}`)
        return value
    }
}
