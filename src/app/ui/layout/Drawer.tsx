import { useTranslation } from 'app/i18n/LanguageContext';
import { routePaths } from 'app/i18n/routeMap';
import { Button } from 'components/ui/button';
import { Sheet } from 'components/ui/sheet';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { version } from '../../../../package.json';
import { Flex, FlexColumn } from './elements';
import { Logo } from './Logo';

interface NavigationProps {
  onClose: () => void;
}

export function NavigationDrawer({ onClose }: NavigationProps) {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();

  const goTo = useCallback(
    (path: string) => () => {
      onClose();
      navigate(path);
    },
    [navigate, onClose],
  );

  return (
    <Sheet open onClose={onClose} side="left">
      <FlexColumn>
        <div className="flex items-center gap-3 p-6">
          <Logo />
          <div>
            <div className="font-semibold leading-none tracking-tight">{t('app.title')}</div>
            <div className="text-sm text-muted">v. {version}</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start rounded-none" onClick={goTo('/')}>
          {t('nav.all')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.numbers[lang])}
        >
          {t('nav.numbers')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.time[lang])}
        >
          {t('nav.time')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.identifiers[lang])}
        >
          {t('nav.identifiers')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.colors[lang])}
        >
          {t('nav.colors')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.bytesizes[lang])}
        >
          {t('nav.bytesizes')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.links[lang])}
        >
          {t('nav.links')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.pipeline[lang])}
        >
          {t('nav.textConversions')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.cryptography[lang])}
        >
          {t('nav.cryptography')}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo(routePaths.pixeldensity[lang])}
        >
          {t('nav.pixeldensity')}
        </Button>
        <Flex />
        <div className="p-4 text-[10pt] [&_a]:text-foreground/60">
          <div className="mt-2 pb-2 border-b border-foreground/10">
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
          </div>
          <div className="mt-2">
            Section header images have been taken from{' '}
            <a href="https://unsplash.com/" title="Freepik">
              Unsplash
            </a>
          </div>
        </div>
      </FlexColumn>
    </Sheet>
  );
}
