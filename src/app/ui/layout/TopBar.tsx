import { useTranslation } from 'app/i18n/LanguageContext';
import { routePaths } from 'app/i18n/routeMap';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';
import {
  Clock,
  Code,
  Hash,
  Home,
  Link as LinkIcon,
  Lock,
  Monitor,
  Palette,
  Type,
  User,
} from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Logo } from './Logo';

interface ToolbarProps {
  onToggleDrawer: () => void;
}

type PageId = keyof typeof routePaths;

const navPageExtraAliases: Partial<Record<PageId, string[]>> = {
  numbers: ['/p/merkit'],
  bytesizes: ['/p/bytesize'],
};

export function TopBar({ onToggleDrawer, children }: React.PropsWithChildren<ToolbarProps>) {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white shadow-md">
      <div className="flex items-center h-14 px-4">
        <div className="inline-flex flex-1 justify-start items-center">
          <Logo className="mr-4" onClick={onToggleDrawer} />
          <h1 className="text-lg font-medium">{t('app.title')}</h1>
        </div>
        <div className="hidden min-[63em]:flex">
          <NavLink icon={Home} route="/" tooltip={t('nav.all')} />
          <NavLink icon={Clock} page="time" tooltip={t('nav.time')} />
          <NavLink icon={Hash} page="numbers" tooltip={t('nav.numbers')} />
          <NavLink icon={User} page="identifiers" tooltip={t('nav.identifiers')} />
          <NavLink icon={Palette} page="colors" tooltip={t('nav.colors')} />
          <NavLink icon={Code} page="bytesizes" tooltip={t('nav.bytesizes')} />
          <NavLink icon={LinkIcon} page="links" tooltip={t('nav.links')} />
          <NavLink icon={Type} page="pipeline" tooltip={t('nav.textConversions')} />
          <NavLink icon={Lock} page="cryptography" tooltip={t('nav.cryptography')} />
          <NavLink icon={Monitor} page="pixeldensity" tooltip={t('nav.pixeldensity')} />
        </div>
        <div className="inline-flex flex-1 justify-end">{children}</div>
      </div>
    </header>
  );
}

type NavLinkProps = {
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
} & ({ route: string; page?: never } | { page: PageId; route?: never });

function NavLink({ route, page, icon: Icon, tooltip }: NavLinkProps) {
  const { lang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const target = route ?? routePaths[page!][lang];
  const matchPaths = route
    ? [route]
    : [routePaths[page!].fi, routePaths[page!].en, ...(navPageExtraAliases[page!] ?? [])];
  const selected = matchPaths.includes(location.pathname);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(target)}
      title={tooltip}
      className={cn('text-white/70 hover:text-white hover:bg-white/10', selected && 'text-white')}
    >
      <Icon />
    </Button>
  );
}
