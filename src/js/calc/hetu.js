"use strict"

var util = require("../util");

/* Hetu (Henkilötunnus, Finnish Social Security Number) */
/* ---------------------------------------------------- */
var HETU_CHECKS = new Array('A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K',
    'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y');
var HETU_SEPARATORS = new Array('A', '-', '+');
function getHetuCheck(hetu) {
    if (hetu.length != 10) {
        return;
    }
    var date = hetu.substr(0, 6);
    var mark = hetu.charAt(6);
    var start = 7;
    if (HETU_SEPARATORS.indexOf(mark) == -1) {
        // Invalid separator
        return;
    }
    // Get HETU order num
    var order = hetu.substr(start, 3);

    var num = parseInt(date + order, 10);
    var check = num % 31;
    if (check < 10) {
        return check;
    } else
        return HETU_CHECKS[check - 10];
}

function generateHetuBody() {
    var day = util.getRandomInt(1, 29);
    var month = util.getRandomInt(1, 13);
    var year = util.getRandomInt(50, 114);
    var check = "-";
    if (year > 99) {
        year -= 100;
        check = "A";
    }
    var counter = util.getRandomInt(1, 999);
    return zeroPad(day, 2) + zeroPad(month, 2) + zeroPad(year, 2) + check + zeroPad(counter, 3);
}

module.exports = function(n) {
    return {
        check: getHetuCheck,
        generate: generateHetuBody
    };
};
