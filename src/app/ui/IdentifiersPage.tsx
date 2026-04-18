import { checkLuhn } from 'app/calc/checks';
import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import { useFocusPublisher } from 'app/util/useFocusPublisher';
import React from 'react';
import * as uuid from 'uuid';

import * as bankReference from '../calc/bankreference';
import * as companyId from '../calc/companyid';
import * as hetu from '../calc/hetu';
import { getRandomString } from '../calc/random';
import * as util from '../util/util';
import { CheckValue } from './component/CheckValue';
import { HalfSection } from './component/Section';
import { UuidCheck } from './component/UuidCheck';
import { publishSelectedValue } from './LastValue';

const generateUUIDv1 = () => uuid.v1().toString();
const generateUUIDv4 = () => uuid.v4().toString();
const generateUUIDv7 = () => uuid.v7().toString();

function generateRandomString() {
  return getRandomString(64);
}

const labelKeys = {
  hetu: 'page.identifiers.hetu',
  bankReference: 'page.identifiers.bankReference',
  companyId: 'page.identifiers.companyId',
  luhn: 'page.identifiers.luhn',
  randomString: 'page.identifiers.randomString',
} as const satisfies Record<string, TranslationKey>;

type Source = keyof typeof labelKeys | 'uuidv1' | 'uuidv4' | 'uuidv7';

const staticLabels: Record<'uuidv1' | 'uuidv4' | 'uuidv7', string> = {
  uuidv1: 'UUID v1',
  uuidv4: 'UUID v4',
  uuidv7: 'UUID v7',
};

export function IdentifiersPage() {
  const { t } = useTranslation();
  const [uuidInput, setUuidInput] = React.useState('');
  const { selected, selectSrc } = useFocusPublisher<Source>();
  const focus = React.useCallback(
    (key: Source) => (value: string) => selectSrc(key, value),
    [selectSrc],
  );
  const publishUuid = React.useCallback(
    (v: string) => {
      publishSelectedValue(v);
      setUuidInput(v);
    },
    [setUuidInput],
  );
  const subtitle = selected
    ? selected in labelKeys
      ? t(labelKeys[selected as keyof typeof labelKeys])
      : staticLabels[selected as keyof typeof staticLabels]
    : '';
  return (
    <HalfSection
      title={t('page.identifiers.title')}
      subtitle={subtitle}
      image="/img/header-identifiers.jpg"
    >
      <CheckValue
        name={t('page.identifiers.hetu')}
        id="hetu"
        check={hetu.check}
        generate={hetu.generate}
        combine={util.combine}
        onValue={publishSelectedValue}
        onFocus={focus('hetu')}
        max-length="10"
        width="6.5em"
      />
      <CheckValue
        name={t('page.identifiers.bankReference')}
        id="bank-reference"
        check={bankReference.check}
        generate={bankReference.generate}
        combine={util.combine}
        onValue={publishSelectedValue}
        onFocus={focus('bankReference')}
        max-length="24"
        width="9em"
      />
      <CheckValue
        name={t('page.identifiers.companyId')}
        id="company-id"
        check={companyId.check}
        generate={companyId.generate}
        combine={util.combineWith('-')}
        onValue={publishSelectedValue}
        onFocus={focus('companyId')}
        max-length="7"
        width="6em"
      />
      <CheckValue
        name={t('page.identifiers.luhn')}
        id="luhn"
        check={checkLuhn}
        onValue={publishSelectedValue}
        onFocus={focus('luhn')}
        width="13em"
      />
      <CheckValue
        name={t('page.identifiers.randomString')}
        id="random-string"
        generate={generateRandomString}
        onValue={publishSelectedValue}
        onFocus={focus('randomString')}
        max-length="64"
      />
      <hr />
      <CheckValue
        name="UUID v1"
        id="uuid-v1"
        generate={generateUUIDv1}
        onValue={publishUuid}
        onFocus={focus('uuidv1')}
        max-length="36"
        labelSize="sm"
      />
      <CheckValue
        name="UUID v4"
        id="uuid-v4"
        generate={generateUUIDv4}
        onValue={publishUuid}
        onFocus={focus('uuidv4')}
        max-length="36"
        labelSize="sm"
      />
      <CheckValue
        name="UUID v7"
        id="uuid-v7"
        generate={generateUUIDv7}
        onValue={publishUuid}
        onFocus={focus('uuidv7')}
        max-length="36"
        labelSize="sm"
      />
      <UuidCheck input={uuidInput} />
    </HalfSection>
  );
}
