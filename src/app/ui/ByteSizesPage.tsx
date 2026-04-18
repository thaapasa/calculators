import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import { useFocusPublisher } from 'app/util/useFocusPublisher';
import React, { useCallback, useMemo } from 'react';

import { useLinkedInputs } from '../util/useLinkedInputs';
import { allFieldsOfType } from '../util/util';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';
import { Flex, FlexRow } from './layout/elements';

interface TypeInfo {
  readonly read: (x: string) => number;
  readonly write: (x: number) => string;
  readonly nameKey: TranslationKey;
  readonly hint: string;
  readonly unit: string;
}

const KIBI = 1024;
const MEBI = KIBI * KIBI;
const GIBI = MEBI * KIBI;
const TEBI = GIBI * KIBI;

const KILO = 1000;
const MEGA = KILO * KILO;
const GIGA = MEGA * KILO;
const TERA = GIGA * KILO;

const converter = (
  nameKey: TranslationKey,
  unit: string,
  ratio: number,
  decimals: number = 3,
): TypeInfo => ({
  nameKey,
  hint: unit,
  unit,
  read: x => Number(x) * ratio,
  write: x => (x / ratio).toFixed(decimals),
});

const types = allFieldsOfType<TypeInfo>()({
  byte: converter('page.bytesizes.byte', 'B', 1, 0),
  kibi: converter('page.bytesizes.kibi', 'KiB', KIBI),
  mebi: converter('page.bytesizes.mebi', 'MiB', MEBI),
  gibi: converter('page.bytesizes.gibi', 'GiB', GIBI),
  tebi: converter('page.bytesizes.tebi', 'TiB', TEBI),
  kilo: converter('page.bytesizes.kilo', 'Kt', KILO),
  mega: converter('page.bytesizes.mega', 'Mt', MEGA),
  giga: converter('page.bytesizes.giga', 'Gt', GIGA),
  tera: converter('page.bytesizes.tera', 'Tt', TERA),
});
export type SizeTypes = keyof typeof types;
const typeKeys = Object.keys(types) as SizeTypes[];

const leftColumn: SizeTypes[] = ['kibi', 'mebi', 'gibi', 'tebi'];
const rightColumn: SizeTypes[] = ['kilo', 'mega', 'giga', 'tera'];

const isValidNumber = (v: number) => typeof v === 'number' && !isNaN(v);

export function ByteSizesPage() {
  const { t } = useTranslation();
  const { selected, selectSrc } = useFocusPublisher<SizeTypes>();

  const fields = useMemo(
    () => Object.fromEntries(typeKeys.map(k => [k, types[k]])) as Record<SizeTypes, TypeInfo>,
    [],
  );

  const { values, handleChange } = useLinkedInputs(fields, isValidNumber);

  const inputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name as SizeTypes;
      handleChange(name, event.target.value);
      const canonical = types[name].read(event.target.value);
      if (isValidNumber(canonical) && selected) {
        publishSelectedValue(types[selected].write(canonical));
      }
    },
    [handleChange, selected],
  );

  const onFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const name = event.target.name as SizeTypes;
      selectSrc(name, values[name]);
    },
    [selectSrc, values],
  );

  return (
    <HalfSection
      title={t('page.bytesizes.title')}
      subtitle={selected ? t(types[selected].nameKey) : ''}
      image="/img/header-bytesize.jpg"
    >
      <Item name={t('page.bytesizes.byte')}>
        <Editor type="byte" value={values.byte} onChange={inputChanged} onFocus={onFocus} />
      </Item>
      <div className="my-0.5 mx-3 flex">
        <Flex className="mr-4 min-w-0">
          {leftColumn.map(k => (
            <Editor key={k} type={k} value={values[k]} onChange={inputChanged} onFocus={onFocus} />
          ))}
        </Flex>
        <Flex className="min-w-0">
          {rightColumn.map(k => (
            <Editor key={k} type={k} value={values[k]} onChange={inputChanged} onFocus={onFocus} />
          ))}
        </Flex>
      </div>
    </HalfSection>
  );
}

const Editor = (p: {
  type: SizeTypes;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const { t } = useTranslation();
  const info = types[p.type];
  return (
    <FlexRow className="my-3 items-center">
      <input
        className="input-inline flex-1 min-w-0"
        name={p.type}
        type="number"
        placeholder={t(info.nameKey)}
        value={p.value}
        onChange={p.onChange}
        onFocus={p.onFocus}
      />
      <div className="w-[25px] text-right pr-2 ml-2">{info.unit}</div>
    </FlexRow>
  );
};
