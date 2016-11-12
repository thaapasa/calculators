import React from "react"
import Section from "./component/section"
import Item from "./component/item"
import * as Bacon from "baconjs"
import * as numbers from "../calc/numbers"
import * as util from "../util/util"

export default class Numbers extends React.Component {

    constructor(props) {
        super(props)
        this.inputChanged = this.inputChanged.bind(this)
        this.state = {
            number: "",
            binary: ""
        }
        this.types = {
            "number-input": { read: numbers.strToInt, state: "number", write: numbers.intToStr },
            "binary-input": { read: numbers.binaryStrToInt, state: "binary", write: numbers.intToBinaryStr }
        }
    }

    componentDidMount() {
        const emptyStream = Bacon.never()
        this.currentInput = new Bacon.Bus()
        const inputConverter = this.currentInput.map((id) => this.types[id].read)
        this.inputStream = new Bacon.Bus()
        const converted = this.inputStream
            .combine(inputConverter, (i, c) => c(i)).map((v) => (typeof(v) == "number" && !isNaN(v)) ? v : undefined)
        Object.keys(this.types).forEach((type) => {
            const typeInfo = this.types[type]
            const sourceIsThis = this.currentInput.map((id) => id == type)
            converted.combine(sourceIsThis, (c, i) => [c, i]).flatMapLatest((v) => v[1] ? emptyStream : converted)
                .map(typeInfo.write)
                .map((v) => util.isString(v) ? v : "")
                .onValue((v) => this.setState({[typeInfo.state]: v}))
        })
    }

    inputChanged(event) {
        const id = event.target.id
        const value = event.target.value
        this.setState({ [this.types[id].state]: value })
        this.currentInput.push(id)
        this.inputStream.push(value)
    }

    render() {
        return <Section title="Numerot">
            <Item name="Numero">
                <input type="text" id="number-input" maxLength="30" value={this.state.number} onChange={this.inputChanged} />
            </Item>
            <Item name="Binääri">
                <input type="text" id="binary-input" maxLength="30" value={this.state.binary} onChange={this.inputChanged} />
            </Item>
        </Section>

    }
}
