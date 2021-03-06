import { checkLuhn } from 'app/calc/checks';
import React from 'react';
import * as uuid from 'uuid';
import * as bankReference from '../calc/bankreference';
import * as companyId from '../calc/companyid';
import * as hetu from '../calc/hetu';
import { getRandomString } from '../calc/random';
import * as util from '../util/util';
import CheckValue from './component/check-value';
import { HalfSection } from './component/section';

interface IdentifiersProps {
  readonly onValue: (x: string) => any;
}

const generateUUIDv1 = () => uuid.v1().toString();
const generateUUIDv4 = () => uuid.v4().toString();

function generateRandomString() {
  return getRandomString(64);
}

export default class Identifiers extends React.Component<IdentifiersProps, {}> {
  public render() {
    return (
      <HalfSection title="Tunnisteet" image="/img/header-identifiers.jpg">
        <CheckValue
          name="Henkilötunnus"
          id="hetu"
          check={hetu.check}
          generate={hetu.generate}
          combine={util.combine}
          onValue={this.props.onValue}
          max-length="10"
          width="6.5em"
        />
        <CheckValue
          name="Viitenumero"
          id="bank-reference"
          check={bankReference.check}
          generate={bankReference.generate}
          combine={util.combine}
          onValue={this.props.onValue}
          max-length="24"
          width="9em"
        />
        <CheckValue
          name="Y-tunnus"
          id="company-id"
          check={companyId.check}
          generate={companyId.generate}
          combine={util.combineWith('-')}
          onValue={this.props.onValue}
          max-length="7"
          width="6em"
        />
        <CheckValue
          name="Luhn modulo 10"
          id="luhn"
          check={checkLuhn}
          onValue={this.props.onValue}
          width="13em"
        />
        <CheckValue
          name="UUID v1"
          id="uuid-v1"
          generate={generateUUIDv1}
          onValue={this.props.onValue}
          max-length="36"
          width="13em"
        />
        <CheckValue
          name="UUID v4"
          id="uuid-v4"
          generate={generateUUIDv4}
          onValue={this.props.onValue}
          max-length="36"
          width="13em"
        />
        <CheckValue
          name="Satunnaisjono"
          id="random-string"
          generate={generateRandomString}
          onValue={this.props.onValue}
          max-length="64"
          width="13em"
        />
      </HalfSection>
    );
  }
}
