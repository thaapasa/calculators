import * as React from "react"
import * as Bacon from "baconjs"
import { GenerateButton } from "./tool-button"
import * as util from "../../util/util"
import Item from "./item"
import TextField from "material-ui/TextField"

const styles = {
    check: { width: "1em" },
    itemValue: { alignItems: "flex-start" }
}

export default class CheckValue extends React.Component {

    constructor(props) {
        super(props)
        this.inputStyle = {}
        if (this.props.width)
            this.inputStyle.width = this.props.width

        this.generate = this.generate.bind(this)
        this.inputChanged = this.inputChanged.bind(this)
        this.state = {
            input: "",
            value: "",
            checkValue: ""
        }
    }

    componentDidMount() {
        this.streamToCheck(this.props.check, this.props.combine)
    }

    generate() {
        const generated = this.props.generate().toString()
        this.setState({ input: generated })
        this.inputStream.push(generated)
    }

    inputChanged(event) {
        const inp = event.target.value
        this.setState({ input: inp })
        this.inputStream.push(inp)
    }

    streamToCheck(calculateCheck, combiner = util.combineWith("")) {
        this.inputStream = new Bacon.Bus()
        const checkValue = this.inputStream.map(calculateCheck)
        checkValue.onValue((value) => {
            this.setState({ checkValue: (value !== undefined) ? value : "" })
        })
        checkValue
            .combine(this.inputStream, (chk, inp) => (chk !== undefined) && combiner(inp, chk))
            .filter(util.nonEmpty)
            .onValue((v) => {
                this.setState({ value: v || "" })
                this.props.onValue && this.props.onValue(v)
            })
    }

    render() {
        return <Item name={this.props.name} valueStyle={styles.itemValue}>
            <GenerateButton id={`${this.props.id}-generate`} onClick={this.generate} title="Luo uusi" />
            <TextField type="text" id={`${this.props.id}-input`} onChange={this.inputChanged}
                   style={this.inputStyle} maxLength={this.props.maxLength} value={this.state.input} />
            <TextField id={`${this.props.id}-check`} ref={(i) => this.check = i}
                   className="letter" readOnly value={this.state.checkValue} style={styles.check} />
            <input type="hidden" id={`${this.props.id}-value`} value={this.state.value} />
        </Item>
    }
}
