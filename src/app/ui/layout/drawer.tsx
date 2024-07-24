import { Card, CardHeader, Drawer, MenuItem, styled } from '@mui/material';
import React from 'react';

import { version } from '../../../../package.json';
import { history } from '../history';
import { Flex, FlexColumn } from './elements';
import { Logo } from './logo';

interface NavigationProps {
  open: boolean;
  onToggle: () => void;
}

export default class NavigationDrawer extends React.Component<NavigationProps> {
  private goToFullpage = this.navigate('/');
  private goToNumbers = this.navigate('/p/numerot');
  private goToTime = this.navigate('/p/aika');
  private goToIdentifiers = this.navigate('/p/tunnisteet');
  private goToColors = this.navigate('/p/värit');
  private goToByteSize = this.navigate('/p/tavukoot');
  private goToLinks = this.navigate('/p/linkit');
  private goToTextConversion = this.navigate('/p/tekstimuunnokset');
  private goToCryptography = this.navigate('/p/kryptografia');

  public render() {
    return (
      <Drawer open={this.props.open} anchor="left" onClose={this.props.onToggle}>
        <DrawerCol>
          <Card>
            <CardHeader title="Laskurit" subheader={`v. ${version}`} avatar={<Logo />} />
          </Card>
          <MenuItem onClick={this.goToFullpage}>Kaikki</MenuItem>
          <MenuItem onClick={this.goToNumbers}>Numerot ja merkit</MenuItem>
          <MenuItem onClick={this.goToTime}>Aikaleimat</MenuItem>
          <MenuItem onClick={this.goToIdentifiers}>Tunnisteet</MenuItem>
          <MenuItem onClick={this.goToColors}>Värit</MenuItem>
          <MenuItem onClick={this.goToByteSize}>Tavukoot</MenuItem>
          <MenuItem onClick={this.goToLinks}>Linkit</MenuItem>
          <MenuItem onClick={this.goToTextConversion}>Tekstimuunnokset</MenuItem>
          <MenuItem onClick={this.goToCryptography}>Kryptografia</MenuItem>
          <Flex />
          <LicenseInfo>
            <LicenseRow>
              Calculator icon made by{' '}
              <a href="https://www.freepik.com/" title="Freepik">
                Freepik
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>{' '}
              is licensed by{' '}
              <a
                href="http://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </a>
            </LicenseRow>
            <LicenseRow>
              Section header images have been taken from{' '}
              <a href="https://unsplash.com/" title="Freepik">
                Unsplash
              </a>
            </LicenseRow>
          </LicenseInfo>
        </DrawerCol>
      </Drawer>
    );
  }

  private navigate(path: string) {
    return () => {
      history.push(path);
      this.props.onToggle();
    };
  }
}

const LicenseInfo = styled('div')`
  padding: 16px;
  font-size: 10pt;
  & a {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const DrawerCol = styled(FlexColumn)`
  width: 290px;
`;

const LicenseRow = styled('div')`
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
