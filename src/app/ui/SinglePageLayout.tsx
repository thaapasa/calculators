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
      <div>
        <TimePage />
        <IdentifiersPage />
      </div>
      <div>
        <ColorsPage />
        <PixelDensityPage />
      </div>
      <div>
        <NumbersPage />
        <ByteSizesPage />
      </div>
      <TextConversionPage />
      <CryptographyPage />
      <LinksPage />
    </>
  );
}
