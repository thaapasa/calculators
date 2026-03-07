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

export function TopBar({ onToggleDrawer, children }: React.PropsWithChildren<ToolbarProps>) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white shadow-md">
      <div className="flex items-center h-14 px-4">
        <div className="inline-flex flex-1 justify-start items-center">
          <Logo className="mr-4" onClick={onToggleDrawer} />
          <h1 className="text-lg font-medium">Laskurit</h1>
        </div>
        <div className="hidden min-[63em]:flex">
          <NavLink icon={Home} route="/" tooltip="Kaikki" />
          <NavLink icon={Clock} route={['/p/aika', '/p/time']} tooltip="Aikaleimat" />
          <NavLink
            icon={Hash}
            route={['/p/numerot', '/p/merkit', '/p/symbols']}
            tooltip="Numerot ja merkit"
          />
          <NavLink icon={User} route={['/p/tunnisteet', '/p/identifiers']} tooltip="Tunnisteet" />
          <NavLink icon={Palette} route={['/p/värit', '/p/colors']} tooltip="Värit" />
          <NavLink
            icon={Code}
            route={['/p/tavukoot', '/p/bytesize', '/p/bytesizes']}
            tooltip="Tavukoot"
          />
          <NavLink icon={LinkIcon} route={['/p/linkit', '/p/links']} tooltip="Linkit" />
          <NavLink
            icon={Type}
            route={['/p/tekstimuunnokset', '/p/textconversions']}
            tooltip="Tekstimuunnokset"
          />
          <NavLink
            icon={Lock}
            route={['/p/kryptografia', '/p/cryptography']}
            tooltip="Kryptografia"
          />
          <NavLink
            icon={Monitor}
            route={['/p/pikselitiheys', '/p/pixeldensity']}
            tooltip="Pikselitiheys"
          />
        </div>
        <div className="inline-flex flex-1 justify-end">{children}</div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  route: string | string[];
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
}

function NavLink({ route, icon: Icon, tooltip }: NavLinkProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(Array.isArray(route) ? route[0] : route);
  };
  const location = useLocation();
  const selected =
    typeof route === 'string'
      ? location.pathname === route
      : route.find(r => location.pathname === r) !== undefined;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={tooltip}
      className={cn('text-white/70 hover:text-white hover:bg-white/10', selected && 'text-white')}
    >
      <Icon />
    </Button>
  );
}
