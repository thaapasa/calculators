import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import React, { useCallback, useMemo, useState } from 'react';

import * as numbers from '../calc/numbers';
import { zeroPad } from '../util/strings';
import { useLinkedInputs } from '../util/useLinkedInputs';
import * as util from '../util/util';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

const labelKeys = {
  binary: 'page.numbers.binary',
  octal: 'page.numbers.octal',
  decimal: 'page.numbers.decimal',
  hex: 'page.numbers.hex',
  char: 'page.numbers.char',
  unicode: 'page.numbers.unicode',
  html: 'page.numbers.html',
} as const satisfies Record<string, TranslationKey>;

interface TypeInfo {
  readonly read: (x: string) => number;
  readonly write: (x: number) => string;
  readonly inputType: 'number' | 'text';
  readonly maxLength: number;
  readonly readOnly?: boolean;
}

function readZero(_: string): number {
  return 0;
}

const types = util.allFieldsOfType<TypeInfo>()({
  binary: {
    read: numbers.binaryStrToInt,
    write: numbers.intToBinaryStr,
    inputType: 'number',
    maxLength: 50,
  },
  octal: {
    read: numbers.octalStrToInt,
    write: numbers.intToOctalStr,
    inputType: 'number',
    maxLength: 40,
  },
  decimal: {
    read: numbers.strToInt,
    write: numbers.intToStr,
    inputType: 'number',
    maxLength: 40,
  },
  hex: {
    read: numbers.hexStrToInt,
    write: numbers.intToHexStr,
    inputType: 'text',
    maxLength: 30,
  },
  char: {
    read: numbers.charToInt,
    write: numbers.intToChar,
    inputType: 'text',
    maxLength: 1,
  },
  unicode: {
    read: readZero,
    write: intToUnicodeStr,
    inputType: 'text',
    maxLength: 6,
    readOnly: true,
  },
  html: {
    read: readZero,
    write: intToHTMLCode,
    inputType: 'text',
    maxLength: 10,
    readOnly: true,
  },
});

type NumberType = keyof typeof types;
const typeKeys = Object.keys(types) as NumberType[];

function intToUnicodeStr(value: number): string {
  const str = numbers.intToHexStr(value);
  return typeof str === 'string' ? 'U+' + zeroPad(str, 4) : '';
}

function intToHTMLCode(value: number): string {
  const str = numbers.intToStr(value);
  return typeof str === 'string' ? `&#${str};` : '';
}

const isValidNumber = (v: number) => typeof v === 'number' && !isNaN(v);

export function NumbersPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<NumberType>('decimal');

  const fields = useMemo(
    () => Object.fromEntries(typeKeys.map(k => [k, types[k]])) as Record<NumberType, TypeInfo>,
    [],
  );

  const { values, handleChange } = useLinkedInputs(fields, isValidNumber);

  const inputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name as NumberType;
      handleChange(name, event.target.value);
      const canonical = types[name].read(event.target.value);
      if (isValidNumber(canonical)) {
        publishSelectedValue(types[selected].write(canonical));
      }
    },
    [handleChange, selected],
  );

  const selectSrc = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setSelected(event.target.name as NumberType);
  }, []);

  return (
    <HalfSection
      title={t('page.numbers.title')}
      subtitle={t(labelKeys[selected])}
      image="/img/header-numbers.jpg"
    >
      {typeKeys.map(k => (
        <Item className="mt-2" name={t(labelKeys[k])} key={`${k}-item`}>
          <input
            className="input-inline flex-1"
            type={types[k].inputType}
            name={k}
            placeholder={t(labelKeys[k])}
            value={values[k]}
            onChange={inputChanged}
            onFocus={selectSrc}
            maxLength={types[k].maxLength}
            readOnly={types[k].readOnly || false}
            key={k}
          />
        </Item>
      ))}
    </HalfSection>
  );
}
