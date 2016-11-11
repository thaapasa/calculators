"use strict";

import React from "react"
import ReactDOM from "react-dom"
import CalculatorPage from "./ui/page"
import * as util from "./util/util"
import * as BaconUtil from "./util/baconutil"

function init() {
    util.fixConsole()
    BaconUtil.addBaconSafeLog()
    BaconUtil.attachToJQuery()
    renderCalculators()
}

function renderCalculators() {
    ReactDOM.render(<CalculatorPage />, document.getElementById("root"))
}

document.addEventListener("DOMContentLoaded", init)
