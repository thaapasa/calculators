window.calc = (function() {
    "use strict"

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
        var day = getRandomInt(1, 29);
        var month = getRandomInt(1, 13);
        var year = getRandomInt(50, 114);
        var check = "-";
        if (year > 99) {
            year -= 100;
            check = "A";
        }
        var counter = getRandomInt(1, 999);
        return zeroPad(day, 2) + zeroPad(month, 2) + zeroPad(year, 2) + check + zeroPad(counter, 3);
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

    return {
        hetu: { check: getHetuCheck, generate: generateHetuBody },
        bankReference: { check: getBankReferenceCheck, generate: generateBankReferenceBody },
        companyId: { check: getCompanyIdCheck, generate: generateCompanyIdBody },
        getRandomInt: getRandomInt,
        zeroPad: zeroPad
    };
})();
