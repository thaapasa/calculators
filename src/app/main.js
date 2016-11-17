"use strict";

import React from "react"
import ReactDOM from "react-dom"
import CalculatorPage from "./ui/page"
import * as util from "./util/util"
import * as BaconUtil from "./util/baconutil"
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function init() {
    // Ensure that there is a console
    util.fixConsole()
    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin()

    BaconUtil.addBaconSafeLog()
    BaconUtil.attachToJQuery()
    renderCalculators()
}

function renderCalculators() {
    ReactDOM.render(<MuiThemeProvider>
        <CalculatorPage />
    </MuiThemeProvider>, document.getElementById("root"))
}

document.addEventListener("DOMContentLoaded", init)
