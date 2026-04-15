import { HSLKey, HSLMaxValue, RGBValue } from 'app/calc/colors';
import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import { Slider } from 'components/ui/slider';

import { ColorBar } from './ColorBar';
import { Item } from './Item';

const labelKeys: Record<HSLKey, TranslationKey> = {
  h: 'page.colors.hsl.h',
  s: 'page.colors.hsl.s',
  l: 'page.colors.hsl.l',
};

export const HSLSlider = ({
  colorBar,
  hsl,
  value,
  onChange,
}: {
  hsl: HSLKey;
  colorBar: RGBValue[];
  value: number;
  onChange: (v: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Item className="mt-4 [&>.grow]:flex-col [&>.grow]:gap-2" name={t(labelKeys[hsl])}>
      <ColorBar colors={colorBar} />
      <Slider value={value} min={0} max={HSLMaxValue} step={1} onValueChange={onChange} />
    </Item>
  );
};
