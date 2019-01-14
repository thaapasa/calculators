import React from 'react'
import LastValue from './last-value'
import DateTime from './datetime'
import TopBar from './layout/topbar'
import { Router, Route, Switch } from 'react-router-dom'
import CalculatorSinglePageLayout from './singlepage'
import Numbers from './numbers'
import Identifiers from './identifiers'
import Colors from './colors'
import TextConversion from './text-conversion'
import Cryptography from './cryptography'
import Links from './links'
import NavigationDrawer from './layout/drawer'
import { history } from './history'

interface PageState {
    drawerOpen: boolean
}

export default class CalculatorPage extends React.Component<{}, PageState> {

    public state: PageState = { drawerOpen: false }
    private lastValue = React.createRef<LastValue>()

    constructor(props: {}) {
        super(props)
        console.log('Initializing calculators')
    }

    private showValue = (value: string) => {
        if (this.lastValue.current) {
            this.lastValue.current.setValue(value)
        }
    }

    public render() {
        return (
            <Router history={history}>
                <div className="everything">
                    <TopBar onToggleDrawer={this.toggleDrawer}>
                        <LastValue ref={this.lastValue} />
                    </TopBar>
                    <NavigationDrawer open={this.state.drawerOpen} onToggle={this.toggleDrawer} />
                    <div className="main-content">
                        <Switch>
                            <Route path="/p/aika" render={this.renderTimePage} />
                            <Route path="/p/time" render={this.renderTimePage} />
                            <Route path="/p/merkit" render={this.renderNumbers} />
                            <Route path="/p/numerot" render={this.renderNumbers} />
                            <Route path="/p/symbols" render={this.renderNumbers} />
                            <Route path="/p/tunnisteet" render={this.renderIdentifiers} />
                            <Route path="/p/identifiers" render={this.renderIdentifiers} />
                            <Route path="/p/värit" render={this.renderColors} />
                            <Route path="/p/colors" render={this.renderColors} />
                            <Route path="/p/linkit" render={this.renderLinks} />
                            <Route path="/p/links" render={this.renderLinks} />
                            <Route path="/p/tekstimuunnokset" render={this.renderTextConversion} />
                            <Route path="/p/textconversions" render={this.renderTextConversion} />
                            <Route path="/p/kryptografia" render={this.renderCryptography} />
                            <Route path="/p/cryptography" render={this.renderCryptography} />
                            <Route render={this.renderFullPage} />
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }

    private toggleDrawer = () => this.setState(s => ({ drawerOpen: !s.drawerOpen }))

    private renderFullPage = () => <CalculatorSinglePageLayout onValue={this.showValue} />
    private renderTimePage = () => <DateTime onValue={this.showValue} />
    private renderNumbers = () => <Numbers onValue={this.showValue} />
    private renderIdentifiers = () => <Identifiers onValue={this.showValue} />
    private renderColors = () => <Colors onValue={this.showValue} />
    private renderLinks = () => <Links />
    private renderTextConversion = () => <TextConversion onValue={this.showValue} />
    private renderCryptography = () => <Cryptography onValue={this.showValue} />
}
