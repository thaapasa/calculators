"use strict"

var hetu = require("./calc/hetu");

var ZEROPAD = "0000000000000000000000000000000000000";
function zeroPad(str, len, padRight) {
    if (!padRight) {
        return (ZEROPAD + str).slice(-len);
    } else {
        return (str + ZEROPAD).substring(0, len);
    }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Bank reference number (viitenumero) */
/* ----------------------------------- */
function generateBankReferenceBody() {
    return getRandomInt(100, 999999999);
}

var BANK_CHECK_WEIGHTS = [7, 3, 1];
function getBankReferenceCheck(value) {
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
    return zeroPad(getRandomInt(1, 9999999), 7);
}

module.exports = function(n) {
    return {
        hetu: hetu,
        bankReference: { check: getBankReferenceCheck, generate: generateBankReferenceBody },
        companyId: { check: getCompanyIdCheck, generate: generateCompanyIdBody },
        getRandomInt: getRandomInt,
        zeroPad: zeroPad
    };
};
