import React from 'react';

import { ByteSizesPage } from './ByteSizesPage';
import { ColorsPage } from './ColorsPage';
import { CryptographyPage } from './CryptographyPage';
import { IdentifiersPage } from './IdentifiersPage';
import { LinksPage } from './LinksPage';
import { NumbersPage } from './NumbersPage';
import { TextConversionPage } from './TextConversionPage';
import { TimePage } from './TimePage';

export function SinglePageLayout() {
  return (
    <>
      <div className="section-row">
        <TimePage />
        <IdentifiersPage />
      </div>
      <div className="section-row">
        <ColorsPage />
        <LinksPage />
      </div>
      <div className="section-row">
        <NumbersPage />
        <ByteSizesPage />
      </div>
      <TextConversionPage />
      <CryptographyPage />
    </>
  );
}
