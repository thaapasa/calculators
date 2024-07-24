import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import styled from 'styled-components';

import ByteSizes from './bytesize';
import Colors from './colors';
import Cryptography from './cryptography';
import DateTime from './datetime';
import { history } from './history';
import Identifiers from './identifiers';
import LastValue from './last-value';
import NavigationDrawer from './layout/drawer';
import TopBar from './layout/topbar';
import Links from './links';
import Numbers from './numbers';
import CalculatorSinglePageLayout from './singlepage';
import TextConversion from './text-conversion';

interface PageState {
  drawerOpen: boolean;
}

export default class CalculatorPage extends React.Component<{}, PageState> {
  public state: PageState = { drawerOpen: false };
  private lastValue = React.createRef<LastValue>();

  constructor(props: {}) {
    super(props);
    console.log('Initializing calculators');
  }

  public render() {
    return (
      <Router history={history}>
        <Everything>
          <TopBar onToggleDrawer={this.toggleDrawer}>
            <LastValue ref={this.lastValue} />
          </TopBar>
          <NavigationDrawer open={this.state.drawerOpen} onToggle={this.toggleDrawer} />
          <MainContent>
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
              <Route path="/p/tavukoot" render={this.renderByteSizes} />
              <Route path="/p/bytesize" render={this.renderByteSizes} />
              <Route path="/p/bytesizes" render={this.renderByteSizes} />
              <Route path="/p/linkit" render={this.renderLinks} />
              <Route path="/p/links" render={this.renderLinks} />
              <Route path="/p/tekstimuunnokset" render={this.renderTextConversion} />
              <Route path="/p/textconversions" render={this.renderTextConversion} />
              <Route path="/p/kryptografia" render={this.renderCryptography} />
              <Route path="/p/cryptography" render={this.renderCryptography} />
              <Route render={this.renderFullPage} />
            </Switch>
          </MainContent>
        </Everything>
      </Router>
    );
  }

  private showValue = (value: string) => {
    if (this.lastValue.current) {
      this.lastValue.current.setValue(value);
    }
  };

  private toggleDrawer = () => this.setState(s => ({ drawerOpen: !s.drawerOpen }));

  private renderFullPage = () => <CalculatorSinglePageLayout onValue={this.showValue} />;
  private renderTimePage = () => <DateTime onValue={this.showValue} />;
  private renderNumbers = () => <Numbers onValue={this.showValue} />;
  private renderIdentifiers = () => <Identifiers onValue={this.showValue} />;
  private renderColors = () => <Colors onValue={this.showValue} />;
  private renderByteSizes = () => <ByteSizes onValue={this.showValue} />;
  private renderLinks = () => <Links />;
  private renderTextConversion = () => <TextConversion onValue={this.showValue} />;
  private renderCryptography = () => <Cryptography onValue={this.showValue} />;
}

const MainContent = styled.div`
  z-index: 0;
  position: relative;
  max-width: 60em;
  margin: 56px auto auto;
  padding-top: 1px;
  text-align: center;
`;

const Everything = styled.div`
  position: relative;
`;
