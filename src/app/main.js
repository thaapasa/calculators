"use strict";

const $ = require("jquery")
import * as util from "./util/util"
import React from 'react'
import ReactDOM from 'react-dom'

import CalculatorPage from "./ui/page"

// See that we have console
util.fixConsole()

function renderCalculators() {
    ReactDOM.render(<CalculatorPage />, document.getElementById("root"))
}

$(document).ready(renderCalculators)
