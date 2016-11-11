const $ = require("jquery")
import * as Bacon from "baconjs"
import log from "./log"

export function attachToJQuery() {
    $.fn.asEventStream = Bacon.$.asEventStream
}

export function addBaconSafeLog() {
    Bacon.EventStream.prototype.safeLog = function (title) {
        return this.map(safeLog(title))
    }
}

export function safeLog(title) {
    return function (value) {
        log(`${title}: ${value}`)
        return value
    }
}

export function eventToValue(event) {
    return $(event.target).val()
}

export function eventToChecked(event) {
    return $(event.target).prop("checked")
}

export function getCheckboxStream(element, initialValue) {
    return Bacon.fromEvent(element, "change").map(eventToChecked).toProperty(initialValue)
}

export function getRadioStream(name, initialValue) {
    return $("input[name=" + name + "]").asEventStream("change").map(eventToValue).toProperty(initialValue)
}
