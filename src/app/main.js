"use strict";

const $ = require("jquery")
import * as Bacon from "baconjs"
import * as BaconUtil from "./util/baconutil"
import { hex_md5 } from "./calc/md5"
import { sha1 } from "./calc/sha1"
import * as companyId from "./calc/companyid"
import * as bankReference from "./calc/bankreference"
import * as hetu from "./calc/hetu"
import * as util from "./util/util"
import React from 'react'
import ReactDOM from 'react-dom'

import { TextCheck } from "./component/text-check"

// See that we have console
util.fixConsole()

function init() {
    console.log("Initializing calculators")
    const cryptoSelect = getRadioStream("crypto", "md5")

    // const element = <h1>Hello, world</h1>;
    const element = <TextCheck name="Test element" />
    ReactDOM.render(element, document.getElementById("root"))

    initGenerator("hetu", hetu.generate),
    initGenerator("bank-reference", bankReference.generate),
    initGenerator("company-id", companyId.generate)

    const calculatedValues = [
        initCheckValue("hetu", hetu.check),
        initCheckValue("bank-reference", bankReference.check),
        initCheckValue("company-id", companyId.check, combineWith("-")),
        streamCalculation($("#plain-text-input"), hex_md5, ucIfChecked($("#md5-uc")), $("#md5-text"), cryptoSelect.map(valueEquals("md5"))),
        streamCalculation($("#plain-text-input"), sha1, ucIfChecked($("#sha1-uc")), $("#sha1-text"), cryptoSelect.map(valueEquals("sha1")))
    ]

    bindCopyToClipboard($("#copy-to-clipboard"), $("#last-value"))

    // Show latest calculated value
    Bacon.mergeAll(calculatedValues).onValue(showValue)
}

function eventToValue(event) {
    return $(event.target).val()
}

function eventToChecked(event) {
    return $(event.target).prop("checked")
}

function valueEquals(expected) {
    return (value) => value == expected
}

function showValue(value) {
    $("#last-value").val(value)
}

function nonEmpty(value) {
    return value && value.length && value.length > 0
}

function combineWith(separator) {
    return function(s1, s2) {
        return s1 + separator + s2
    }
}

function ucIfChecked(element) {
    return getCheckboxStream(element).map((checked) => checked ? toUpperCase : identity)
}

function toUpperCase(value) { return typeof value === "string" ? value.toUpperCase() : undefined }
function identity(value) { return value }

function takeArrayElement(index) {
    return (ar) => ar[index]
}

function getCheckboxStream(element, initialValue) {
    return element.asEventStream("change").map(eventToChecked).toProperty(initialValue)
}

function getRadioStream(name, initialValue) {
    return $("input[name=" + name + "]").asEventStream("change").map(eventToValue).toProperty(initialValue)
}

function bindCopyToClipboard(button, fieldToCopy) {
    button.asEventStream("click").onValue(() => {
        const value = fieldToCopy.val()
        console.log(`Copying to clipboard: ${value}`)

        try {
            fieldToCopy.select()
            document.execCommand("copy")
        } catch (e) {
            console.log("Could not copy!")
        }
    })
}

function initCheckValue(baseName, calcFunc, combiner) {
    return streamToCheck($("#" + baseName + "-input"), calcFunc, $("#" + baseName + "-check"), combiner)
}

function initGenerator(baseName, generator) {
    streamToGenerate($("#" + baseName + "-generate"), generator, $("#" + baseName + "-input"))
}

function streamToGenerate(button, generator, target) {
    $(button).asEventStream("click").onValue(() => {
        const generated = generator()
        console.log("Generated value:", generated);
        $(target).val(generated).trigger("keyup")
    })
}

function streamToCheck(inputField, calculateCheck, checkField, combiner = combineWith("")) {
    const inputStream = BaconUtil.textFieldValue(inputField)
    const checkValue = inputStream.map(calculateCheck)
    checkValue.onValue((value) => {
        console.log("Calculated check value:", value)
        checkField.val(value)
    })
    return checkValue
        .combine(inputStream, (chk, inp) => (chk !== undefined) && combiner(inp, chk))
        .filter(nonEmpty)
}

function streamCalculation(inputField, calculation, calcMapper, valueField, valueFilter) {
    const inputStream = inputField.asEventStream("keyup").map(eventToValue)
    let calculated = inputStream.map(calculation)
    if (calcMapper) {
        calculated = calculated.combine(calcMapper, (val, m) => m(val))
    }
    calculated.onValue((value) => valueField.val(value))

    return valueFilter ?
        Bacon.combineAsArray(calculated, valueFilter)
            .filter(takeArrayElement(1))
            .map(takeArrayElement(0)) :
        calculated
}

$(document).ready(init)
