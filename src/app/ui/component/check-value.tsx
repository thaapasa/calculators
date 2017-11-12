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

interface CheckProps {
    width: string
    check: any
    combine: any
    name: string
    id: any
    'max-length'?: string
    generate: () => any
    onValue: (x: any) => any
}

interface CheckState {
    input: string,
    value: string,
    checkValue: string
}

export default class CheckValue extends React.Component<CheckProps, CheckState> {

    private check: any

    public state: CheckState = {
        input: "",
        value: "",
        checkValue: ""
    };

    private inputStyle = {
        width: ""
    };

    private inputStream: any = null

    constructor(props: CheckProps) {
        super(props)
        if (this.props.width)
            this.inputStyle.width = this.props.width

        this.generate = this.generate.bind(this)
        this.inputChanged = this.inputChanged.bind(this)
    }

    componentDidMount() {
        this.streamToCheck(this.props.check, this.props.combine)
    }

    generate() {
        const generated: string = this.props.generate().toString()
        this.setState({ input: generated })
        this.inputStream.push(generated)
    }

    inputChanged(event: any) {
        const inp = event.target.value
        this.setState({ input: inp })
        this.inputStream.push(inp)
    }

    streamToCheck(calculateCheck: any, combiner = util.combineWith("")) {
        this.inputStream = new Bacon.Bus()
        const checkValue = this.inputStream.map(calculateCheck)
        checkValue.onValue((value: any) => {
            this.setState({ checkValue: (value !== undefined) ? value : "" })
        })
        checkValue
            .combine(this.inputStream, (chk: any, inp: any) => (chk !== undefined) && combiner(inp, chk))
            .filter(util.nonEmpty)
            .onValue((v: any) => {
                this.setState({ value: v || "" })
                this.props.onValue && this.props.onValue(v)
            })
    }

    render() {
        return <Item name={this.props.name} valueStyle={styles.itemValue}>
            <GenerateButton onClick={this.generate} title="Luo uusi" />
            <TextField type="text" id={`${this.props.id}-input`} onChange={this.inputChanged}
                   style={this.inputStyle} value={this.state.input} max-length={this.props['max-length']} />
            <TextField id={`${this.props.id}-check`} ref={(i) => this.check = i}
                   className="letter" read-only='read-only' value={this.state.checkValue} style={styles.check} />
            <input type="hidden" id={`${this.props.id}-value`} value={this.state.value} />
        </Item>
    }
}
