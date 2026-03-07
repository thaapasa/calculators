import React, { useCallback, useMemo, useState } from 'react';

import { useLinkedInputs } from '../util/useLinkedInputs';
import { allFieldsOfType } from '../util/util';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';
import { Flex, FlexRow } from './layout/elements';

interface TypeInfo {
  readonly read: (x: string) => number;
  readonly write: (x: number) => string;
  readonly name: string;
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

const converter = (name: string, unit: string, ratio: number, decimals: number = 3): TypeInfo => ({
  name,
  hint: unit,
  unit,
  read: x => Number(x) * ratio,
  write: x => (x / ratio).toFixed(decimals),
});

const types = allFieldsOfType<TypeInfo>()({
  byte: converter('Tavua', 'B', 1, 0),
  kibi: converter('Kibitavua', 'KiB', KIBI),
  mebi: converter('Mebitavua', 'MiB', MEBI),
  gibi: converter('Gibitavua', 'GiB', GIBI),
  tebi: converter('Tebitavua', 'TiB', TEBI),
  kilo: converter('Kilotavua', 'Kt', KILO),
  mega: converter('Megatavua', 'Mt', MEGA),
  giga: converter('Gigatavua', 'Gt', GIGA),
  tera: converter('Teratavua', 'Tt', TERA),
});
export type SizeTypes = keyof typeof types;
const typeKeys = Object.keys(types) as SizeTypes[];

const leftColumn: SizeTypes[] = ['kibi', 'mebi', 'gibi', 'tebi'];
const rightColumn: SizeTypes[] = ['kilo', 'mega', 'giga', 'tera'];

const isValidNumber = (v: number) => typeof v === 'number' && !isNaN(v);

export function ByteSizesPage() {
  const [selected, setSelected] = useState<SizeTypes>('byte');

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
      if (isValidNumber(canonical)) {
        publishSelectedValue(types[selected].write(canonical));
      }
    },
    [handleChange, selected],
  );

  const selectSrc = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setSelected(event.target.name as SizeTypes);
  }, []);

  return (
    <HalfSection title="Tavukoot" subtitle={types[selected].name} image="/img/header-bytesize.jpg">
      <Item name="Tavua">
        <Editor type="byte" value={values.byte} onChange={inputChanged} onFocus={selectSrc} />
      </Item>
      <Item>
        <Flex className="first:mr-4">
          {leftColumn.map(t => (
            <Editor
              key={t}
              type={t}
              value={values[t]}
              onChange={inputChanged}
              onFocus={selectSrc}
            />
          ))}
        </Flex>
        <Flex>
          {rightColumn.map(t => (
            <Editor
              key={t}
              type={t}
              value={values[t]}
              onChange={inputChanged}
              onFocus={selectSrc}
            />
          ))}
        </Flex>
      </Item>
    </HalfSection>
  );
}

const Editor = (p: {
  type: SizeTypes;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const info = types[p.type];
  return (
    <FlexRow className="my-3 items-center">
      <input
        className="input-inline flex-1"
        name={p.type}
        type="number"
        placeholder={info.name}
        value={p.value}
        onChange={p.onChange}
        onFocus={p.onFocus}
      />
      <div className="w-[25px] text-right pr-2 ml-2">{info.unit}</div>
    </FlexRow>
  );
};
