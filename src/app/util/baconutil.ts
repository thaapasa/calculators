//import * as Bacon from "baconjs"
import log from "./log"

export function addBaconSetStateValue() {
    /*
    Bacon.Observable.prototype.setState = function (stateThis: any, stateName: string) {
        return this.onValue(setStateValue(stateThis, stateName))
    }
    */
}

export function safeLog(title: string) {
    return function (value: any) {
        log(`${title}:`, value)
        return value
    }
}

export function addBaconSafeLog() {
    /*
    Bacon.Observable.prototype.safeLog = function (title: string) {
        return this.map(safeLog(title))
    }
    */
}

export function setStateValue(stateThis: any, stateName: string) {
    return function (value: any) {
        stateThis.setState({ [stateName] : value })
        return value
    }
}
