const $ = require("jquery")
import * as Bacon from "baconjs"
import {log} from "./log"

$.fn.asEventStream = Bacon.$.asEventStream

Bacon.EventStream.prototype.safeLog = function(title) {
    return this.map(safeLog(title))
}

export function safeLog(title) {
    return function (value) {
        log(`${title}: ${value}`)
        return value
    }
}

export function textFieldValue(target) {
    return Bacon.fromEvent(target, "change").map((e) => $(e.target).val())
}

export function eventToValue(event) {
    return $(event.target).val()
}

export function eventToChecked(event) {
    return $(event.target).prop("checked")
}

export function getCheckboxStream(element, initialValue) {
    return $(element).asEventStream("change").map(eventToChecked).toProperty(initialValue)
}

export function getRadioStream(name, initialValue) {
    return $("input[name=" + name + "]").asEventStream("change").map(eventToValue).toProperty(initialValue)
}
