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

// Avoid `console` errors in browsers that lack a console.
function fixConsole() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}

module.exports = {
    getRandomInt: getRandomInt,
    zeroPad: zeroPad,
    fixConsole: fixConsole
};

