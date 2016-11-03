"use strict"

var $ = require("jquery");
var Bacon = require("baconjs");

$.fn.asEventStream = Bacon.$.asEventStream;

function textFieldValue(target) {
    return $(target).asEventStream("keyup").map(function(ev) { return $(ev.target).val(); });
}

module.exports = {
    textFieldValue: textFieldValue
};

