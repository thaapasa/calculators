import { styled } from '@mui/material';
import React from 'react';

import { ByteSizesPage } from './ByteSizesPage';
import { ColorsPage } from './ColorsPage';
import { CryptographyPage } from './CryptographyPage';
import { IdentifiersPage } from './IdentifiersPage';
import { LinksPage } from './LinksPage';
import { NumbersPage } from './NumbersPage';
import { PixelDensityPage } from './PixelDensityPage';
import { TextConversionPage } from './TextConversionPage';
import { TimePage } from './TimePage';

export function SinglePageLayout() {
  return (
    <>
      <Row>
        <TimePage />
        <IdentifiersPage />
      </Row>
      <Row>
        <ColorsPage />
        <PixelDensityPage />
      </Row>
      <Row>
        <NumbersPage />
        <ByteSizesPage />
      </Row>
      <TextConversionPage />
      <CryptographyPage />
      <LinksPage />
    </>
  );
}

const Row = styled('div')``;
