import { Card, CardHeader, Drawer, MenuItem, styled } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { version } from '../../../../package.json';
import { Flex, FlexColumn } from './elements';
import { Logo } from './Logo';

interface NavigationProps {
  onClose: () => void;
}

export function NavigationDrawer({ onClose }: NavigationProps) {
  const navigate = useNavigate();

  const goTo = useCallback(
    (path: string) => () => {
      onClose();
      navigate(path);
    },
    [navigate, onClose],
  );

  return (
    <Drawer open anchor="left" onClose={onClose}>
      <DrawerCol>
        <Card>
          <CardHeader title="Laskurit" subheader={`v. ${version}`} avatar={<Logo />} />
        </Card>
        <MenuItem onClick={goTo('/')}>Kaikki</MenuItem>
        <MenuItem onClick={goTo('/p/numerot')}>Numerot ja merkit</MenuItem>
        <MenuItem onClick={goTo('/p/aika')}>Aikaleimat</MenuItem>
        <MenuItem onClick={goTo('/p/tunnisteet')}>Tunnisteet</MenuItem>
        <MenuItem onClick={goTo('/p/värit')}>Värit</MenuItem>
        <MenuItem onClick={goTo('/p/tavukoot')}>Tavukoot</MenuItem>
        <MenuItem onClick={goTo('/p/linkit')}>Linkit</MenuItem>
        <MenuItem onClick={goTo('/p/tekstimuunnokset')}>Tekstimuunnokset</MenuItem>
        <MenuItem onClick={goTo('/p/kryptografia')}>Kryptografia</MenuItem>
        <MenuItem onClick={goTo('/p/pikselitiheys')}>Pikselitiheys</MenuItem>
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
