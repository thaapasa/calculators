import { Button } from 'components/ui/button';
import { Languages } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from './LanguageContext';
import { swapPathLang } from './routeMap';

export function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    const next = lang === 'fi' ? 'en' : 'fi';
    const newPath = swapPathLang(location.pathname, next);
    setLang(next);
    if (newPath !== location.pathname) {
      navigate(newPath, { replace: true });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={t('lang.toggleTooltip')}
      className="text-white/70 hover:text-white hover:bg-white/10"
    >
      <Languages />
    </Button>
  );
}
