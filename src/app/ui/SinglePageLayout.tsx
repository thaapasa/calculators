import { ByteSizesPage } from './ByteSizesPage';
import { ColorsPage } from './ColorsPage';
import { CryptographyPage } from './CryptographyPage';
import { IdentifiersPage } from './IdentifiersPage';
import { LinksPage } from './LinksPage';
import { NumbersPage } from './NumbersPage';
import { PipelinePage } from './PipelinePage';
import { PixelDensityPage } from './PixelDensityPage';
import { TimePage } from './TimePage';

export function SinglePageLayout() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
        <TimePage />
        <IdentifiersPage />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
        <ColorsPage />
        <PixelDensityPage />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
        <NumbersPage />
        <ByteSizesPage />
      </div>
      <PipelinePage />
      <CryptographyPage />
      <LinksPage />
    </>
  );
}
