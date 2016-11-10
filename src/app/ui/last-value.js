import React from "react"
import { ClipboardButton } from "./component/tool-button"
import log from "../util/log"

export default class LastValue extends React.Component {

    constructor(props) {
        super(props)
        this.state = { value: "" }
        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    setValue(v) {
        this.setState({ value: v || "" })
    }

    copyToClipboard() {
        const field = this.refs.lastValue
        try {
            field.select()
            document.execCommand("copy")
        } catch (e) {
            log(`Could not copy: ${e}`)
        }
    }

    render() {
        return <section className="panel">
            <header className="bg-subtle">Viimeisin arvo</header>
            <div className="calculator item">
                <div className="name">Arvo</div>
                <ClipboardButton id="copy-to-clipboard" title="Kopioi leikepöydälle" onClick={this.copyToClipboard} />
                <div className="value"><input type="text" id="last-value" ref="lastValue" className="wide" readOnly value={ this.state.value }/></div>
            </div>
        </section>

    }
}
