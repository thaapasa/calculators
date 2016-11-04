"use strict"

var util = require("../util/util");

/* Company id (Y-tunnus)    */
/* ------------------------ */
var COMPANY_ID_WEIGHTS = [7, 9, 10, 5, 8, 4, 2];
function getCompanyIdCheck(value) {
    if (value.length != 7) {
        return;
    }
    var sum = 0;
    for (var i = 0; i < 7; ++i) {
        var c = parseInt(value.charAt(i), 10);
        if (isNaN(c)) return;
        sum += c * COMPANY_ID_WEIGHTS[i];
    }
    var div = sum % 11;
    return div == 0 ? 0 :
        (div == 1 ? "-" : 11 - div);
}

function generateCompanyIdBody() {
    return util.zeroPad(util.getRandomInt(1, 9999999), 7);
}

module.exports = {
    check: getCompanyIdCheck,
    generate: generateCompanyIdBody
};

