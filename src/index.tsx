"use strict";

import * as React from "react"
import * as ReactDOM from "react-dom"
import CalculatorPage from "./app/ui/page"
import {fixConsole} from "./app/util/util"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function init() {
    // Ensure that there is a console
    fixConsole()
    renderCalculators()
}

function renderCalculators() {
    ReactDOM.render(<MuiThemeProvider>
        <CalculatorPage />
    </MuiThemeProvider>, document.getElementById("root"))
}

document.addEventListener("DOMContentLoaded", init)
