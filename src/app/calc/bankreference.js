import * as util from "../util/util"

/* Bank reference number (viitenumero) */
/* ----------------------------------- */
export function generate() {
    return util.getRandomInt(100, 999999999);
}

var BANK_CHECK_WEIGHTS = [7, 3, 1];
export function check(value) {
    if (!value || value.length < 1) {
        return;
    }
    var sum = 0;
    var c = 0;
    for ( var i = value.length - 1; i >= 0; i--) {
        var cur = parseInt(value.charAt(i), 10);
        if (isNaN(cur)) return;
        sum += cur * BANK_CHECK_WEIGHTS[c++ % 3];
    }
    var diff = 10 - (sum % 10);
    return diff < 10 ? diff : 0;
}
