"use strict";

import React from "react"
import ReactDOM from "react-dom"
import CalculatorPage from "./app/ui/page"
import {fixConsole} from "./app/util/util"
import {addBaconSafeLog,addBaconSetStateValue} from "./app/util/baconutil"
import injectTapEventPlugin from "react-tap-event-plugin"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"

function init() {
    // Ensure that there is a console
    fixConsole()
    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin()

    addBaconSafeLog()
    addBaconSetStateValue()
    renderCalculators()
}

function renderCalculators() {
    ReactDOM.render(<MuiThemeProvider>
        <CalculatorPage />
    </MuiThemeProvider>, document.getElementById("root"))
}

document.addEventListener("DOMContentLoaded", init)
