import { checkLuhn } from 'app/calc/checks';
import { useTranslation } from 'app/i18n/LanguageContext';
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

export function IdentifiersPage() {
  const { t } = useTranslation();
  const [uuidInput, setUuidInput] = React.useState('');
  const publishUuid = React.useCallback(
    (v: string) => {
      publishSelectedValue(v);
      setUuidInput(v);
    },
    [setUuidInput],
  );
  return (
    <HalfSection title={t('page.identifiers.title')} image="/img/header-identifiers.jpg">
      <CheckValue
        name={t('page.identifiers.hetu')}
        id="hetu"
        check={hetu.check}
        generate={hetu.generate}
        combine={util.combine}
        onValue={publishSelectedValue}
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
        max-length="7"
        width="6em"
      />
      <CheckValue
        name={t('page.identifiers.luhn')}
        id="luhn"
        check={checkLuhn}
        onValue={publishSelectedValue}
        width="13em"
      />
      <CheckValue
        name={t('page.identifiers.randomString')}
        id="random-string"
        generate={generateRandomString}
        onValue={publishSelectedValue}
        max-length="64"
      />
      <hr />
      <CheckValue
        name="UUID v1"
        id="uuid-v1"
        generate={generateUUIDv1}
        onValue={publishUuid}
        max-length="36"
        labelSize="sm"
      />
      <CheckValue
        name="UUID v4"
        id="uuid-v4"
        generate={generateUUIDv4}
        onValue={publishUuid}
        max-length="36"
        labelSize="sm"
      />
      <CheckValue
        name="UUID v7"
        id="uuid-v7"
        generate={generateUUIDv7}
        onValue={publishUuid}
        max-length="36"
        labelSize="sm"
      />
      <UuidCheck input={uuidInput} />
    </HalfSection>
  );
}
