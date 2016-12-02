import * as Bacon from "baconjs"
import log from "./log"

export function addBaconSetStateValue() {
    Bacon.Observable.prototype.setState = function (stateThis, stateName) {
        return this.onValue(setStateValue(stateThis, stateName))
    }
}

export function safeLog(title) {
    return function (value) {
        log(`${title}:`, value)
        return value
    }
}

export function addBaconSafeLog() {
    Bacon.Observable.prototype.safeLog = function (title) {
        return this.map(safeLog(title))
    }
}

export function setStateValue(stateThis, stateName) {
    return function (value) {
        stateThis.setState({ [stateName] : value })
        return value
    }
}
