(function() {
    "use strict";

    var $ = require("jquery");
    var Bacon = require("baconjs");
    var BaconUtil = require("./util/baconutil")
    var calc = require("./calc/calc");
    var util = require("./util/util");

    $.fn.asEventStream = Bacon.$.asEventStream;

    // See that we have console
    util.fixConsole();

    function init() {
        console.log("Initializing calculators");
        var cryptoSelect = getRadioStream("crypto", "md5");
        var generators = [
            initGenerator("hetu", calc.hetu.generate),
            initGenerator("bank-reference", calc.bankReference.generate),
            initGenerator("company-id", calc.companyId.generate)
        ];
        var calculatedValues = [
            initCheckValue("hetu", calc.hetu.check),
            initCheckValue("bank-reference", calc.bankReference.check),
            initCheckValue("company-id", calc.companyId.check, combineWith("-")),
            streamCalculation($("#plain-text-input"), calc.md5, ucIfChecked($("#md5-uc")), $("#md5-text"), cryptoSelect.map(valueEquals("md5"))),
            streamCalculation($("#plain-text-input"), calc.sha1, ucIfChecked($("#sha1-uc")), $("#sha1-text"), cryptoSelect.map(valueEquals("sha1")))
        ];
        bindCopyToClipboard($("#copy-to-clipboard"), $("#last-value"));
        // Show latest calculated value
        Bacon.mergeAll(calculatedValues).onValue(showValue);
    }

    function safeLog(title) {
        return function(value) {
            console.log(title + ": " + value);
            return value;
        }
    }

    function eventToValue(event) {
        return $(event.target).val();
    }

    function eventToChecked(event) {
        return $(event.target).prop("checked");
    }

    function valueEquals(expected) {
        return function(value) {
            return value == expected;
        };
    }

    function showValue(value) {
        $("#last-value").val(value);
    }

    function nonEmpty(value) {
        return value && value.length && value.length > 0;
    }

    function combineWith(separator) {
        return function(s1, s2) {
            return s1 + separator + s2;
        }
    }

    function ucIfChecked(element) {
        return getCheckboxStream(element).map(function(checked) {
            return checked ? toUpperCase : identity;
        });
    }

    function toUpperCase(value) { return typeof value === "string" ? value.toUpperCase() : undefined; }
    function identity(value) { return value; }

    function takeArrayElement(index) {
        return function(ar) {
            return ar[index];
        }
    }

    function getCheckboxStream(element, initialValue) {
        return element.asEventStream("change").map(eventToChecked).toProperty(initialValue);
    }

    function getRadioStream(name, initialValue) {
        return $("input[name=" + name + "]").asEventStream("change").map(eventToValue).toProperty(initialValue);
    }

    function bindCopyToClipboard(button, fieldToCopy) {
        button.asEventStream("click").onValue(function() {
            var value = fieldToCopy.val();
            console.log("Copying to clipboard:", value);

            try {
                fieldToCopy.select();
                document.execCommand("copy");
            } catch (e) {
                console.log("Could not copy!")
            }
        });
    }

    function initCheckValue(baseName, calcFunc, combiner) {
        return streamToCheck($("#" + baseName + "-input"), calcFunc, $("#" + baseName + "-check"), combiner);
    }

    function initGenerator(baseName, generator) {
        streamToGenerate($("#" + baseName + "-generate"), generator, $("#" + baseName + "-input"));
    }

    function streamToGenerate(button, generator, target) {
        $(button).asEventStream("click").onValue(function() {
            var generated = generator();
            console.log("Generated value:", generated);
            $(target).val(generated).trigger("keyup");
        });
    }

    function streamToCheck(inputField, calculateCheck, checkField, combiner) {
        if (!combiner) combiner = combineWith("");
        var inputStream = BaconUtil.textFieldValue(inputField);
        var checkValue = inputStream.map(calculateCheck);
        checkValue.onValue(function(value) {
            console.log("Calculated check value:", value);
            checkField.val(value);
        });
        return checkValue
            .combine(inputStream, function(chk, inp) { return (chk !== undefined) && combiner(inp, chk); })
            .filter(nonEmpty);
    }

    function streamCalculation(inputField, calculation, calcMapper, valueField, valueFilter) {
        var inputStream = inputField.asEventStream("keyup").map(eventToValue);
        var calculated = inputStream.map(calculation);
        if (calcMapper) {
            calculated = calculated.combine(calcMapper, function(val, m) { return m(val); });
        }
        calculated.onValue(function(value) {
            valueField.val(value);
        });
        return valueFilter ?
            Bacon.combineAsArray(calculated, valueFilter)
                .filter(takeArrayElement(1))
                .map(takeArrayElement(0)) :
            calculated;
    }

    $(document).ready(init);

})();
