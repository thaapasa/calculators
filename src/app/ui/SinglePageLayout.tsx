import { ByteSizesPage } from './ByteSizesPage';
import { ColorsPage } from './ColorsPage';
import { CryptographyPage } from './CryptographyPage';
import { IdentifiersPage } from './IdentifiersPage';
import { LinksPage } from './LinksPage';
import { NumbersPage } from './NumbersPage';
import { PipelinePage } from './PipelinePage';
import { PixelDensityPage } from './PixelDensityPage';
import { TimePage } from './TimePage';
import { WorkTimePage } from './WorkTimePage';

export function SinglePageLayout() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
        <TimePage />
        <WorkTimePage />
      </div>
      <ColorsPage />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
        <IdentifiersPage />
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
