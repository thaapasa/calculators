import * as companyId from "../calc/companyid"
import * as bankReference from "../calc/bankreference"
import * as hetu from "../calc/hetu"
import * as util from "../util/util"
import CheckValue from "./component/check-value"
import React from 'react'

export default class Identifiers extends React.Component {

    render() {
        return <section className="panel">
            <header className="bg-teal">Tunnisteet</header>
            <CheckValue name="Henkilötunnus" id="hetu"
                        check={hetu.check} generate={hetu.generate} combine={util.combine}
                        onValue={this.props.onValue} maxLength="10" className="narrow" />
            <CheckValue name="Viitenumero" id="bank-reference"
                        check={bankReference.check} generate={bankReference.generate} combine={util.combine}
                        onValue={this.props.onValue} maxLength="24" className="medium" />
            <CheckValue name="Y-tunnus" id="companyId"
                        check={companyId.check} generate={companyId.generate} combine={util.combineWith("-")}
                        onValue={this.props.onValue} maxLength="7" className="narrow" />
        </section>

    }
}
