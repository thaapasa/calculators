import * as React from 'react'
import * as ReactDOM from 'react-dom'
import CalculatorPage from './app/ui/page'
import { fixConsole } from './app/util/util'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Ensure that there is a console
fixConsole()

ReactDOM.render(<MuiThemeProvider>
    <CalculatorPage />
</MuiThemeProvider>, document.getElementById('root'))
