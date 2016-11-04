const $ = require("jquery")
import * as Bacon from "baconjs"

$.fn.asEventStream = Bacon.$.asEventStream

export function textFieldValue(target) {
    return $(target).asEventStream("keyup").map((e) => $(e.target).val())
}
