import { Card, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
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
      <FlexColumn className="w-[290px]">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <CardTitle>Laskurit</CardTitle>
                <CardDescription>v. {version}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        <button className="w-full text-left px-4 py-2 hover:bg-background" onClick={goTo('/')}>
          Kaikki
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/numerot')}
        >
          Numerot ja merkit
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/aika')}
        >
          Aikaleimat
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/tunnisteet')}
        >
          Tunnisteet
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/värit')}
        >
          Värit
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/tavukoot')}
        >
          Tavukoot
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/linkit')}
        >
          Linkit
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/tekstimuunnokset')}
        >
          Tekstimuunnokset
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/kryptografia')}
        >
          Kryptografia
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-background"
          onClick={goTo('/p/pikselitiheys')}
        >
          Pikselitiheys
        </button>
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
