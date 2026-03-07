import { Button } from 'components/ui/button';
import { Sheet } from 'components/ui/sheet';
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
    <Sheet open onClose={onClose} side="left">
      <FlexColumn>
        <div className="flex items-center gap-3 p-6">
          <Logo />
          <div>
            <div className="font-semibold leading-none tracking-tight">Laskurit</div>
            <div className="text-sm text-muted">v. {version}</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start rounded-none" onClick={goTo('/')}>
          Kaikki
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/numerot')}
        >
          Numerot ja merkit
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/aika')}
        >
          Aikaleimat
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/tunnisteet')}
        >
          Tunnisteet
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/värit')}
        >
          Värit
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/tavukoot')}
        >
          Tavukoot
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/linkit')}
        >
          Linkit
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/tekstimuunnokset')}
        >
          Tekstimuunnokset
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/kryptografia')}
        >
          Kryptografia
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none"
          onClick={goTo('/p/pikselitiheys')}
        >
          Pikselitiheys
        </Button>
        <Flex />
        <div className="p-4 text-[10pt] [&_a]:text-foreground/60">
          <div className="mt-2 pb-2 border-b border-black/10">
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
