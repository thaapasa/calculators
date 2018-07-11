import React from 'react'
import CheckValue from './component/check-value'
import { HalfSection } from './component/section'
import * as companyId from '../calc/companyid'
import * as bankReference from '../calc/bankreference'
import * as hetu from '../calc/hetu'
import * as util from '../util/util'

interface IdentifiersProps {
    readonly onValue: (x: string) => any
}

export default class Identifiers extends React.Component<IdentifiersProps, {}> {

    public render() {
        return <HalfSection title="Tunnisteet">
            <CheckValue name="Henkilötunnus" id="hetu"
                check={hetu.check} generate={hetu.generate} combine={util.combine}
                onValue={this.props.onValue} max-length="10" width="6.5em" />
            <CheckValue name="Viitenumero" id="bank-reference"
                check={bankReference.check} generate={bankReference.generate} combine={util.combine}
                onValue={this.props.onValue} max-length="24" width="9em" />
            <CheckValue name="Y-tunnus" id="companyId"
                check={companyId.check} generate={companyId.generate} combine={util.combineWith('-')}
                onValue={this.props.onValue} max-length="7" width="6em" />
        </HalfSection>

    }
}
