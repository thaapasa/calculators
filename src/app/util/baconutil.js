const $ = require("jquery")
import * as Bacon from "baconjs"

$.fn.asEventStream = Bacon.$.asEventStream

export function textFieldValue(target) {
    return $(target).asEventStream("keyup").map((e) => $(e.target).val())
}

export function eventToValue(event) {
    return $(event.target).val()
}

export function eventToChecked(event) {
    return $(event.target).prop("checked")
}
