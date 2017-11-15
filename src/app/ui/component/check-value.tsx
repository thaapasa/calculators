import * as React from 'react'
import * as Bacon from 'baconjs'
import { GenerateButton } from './tool-button'
import * as util from '../../util/util'
import Item from './item'
import TextField from 'material-ui/TextField'

const styles: { [key: string]: React.CSSProperties } = {
    check: { width: '1em' },
    itemValue: { alignItems: 'flex-start' },
}

interface CheckProps {
    readonly width: string
    readonly check: any
    readonly combine: any
    readonly name: string
    readonly id: any
    readonly 'max-length'?: string
    readonly generate: () => any
    readonly onValue: (x: any) => any
}

interface CheckState {
    input: string,
    value: string,
    checkValue: string
}

export default class CheckValue extends React.Component<CheckProps, CheckState> {

    public state: CheckState = {
        input: '',
        value: '',
        checkValue: '',
    }

    private inputStyle = {
        width: '',
    }

    private inputStream: Bacon.Bus<any, string>

    public constructor(props: CheckProps) {
        super(props)
        if (this.props.width) {
            this.inputStyle.width = this.props.width
        }
    }

    public componentDidMount() {
        this.streamToCheck(this.props.check, this.props.combine)
    }

    private generate = () => {
        const generated: string = this.props.generate().toString()
        this.setState({ input: generated })
        this.inputStream.push(generated)
    }

    private inputChanged = (_: any, val: string) => {
        this.setState({ input: val })
        this.inputStream.push(val)
    }

    private streamToCheck(calculateCheck: (x: string) => string, combiner: (a: string, b: string) => string = util.combineWith('')) {
        this.inputStream = new Bacon.Bus<any, string>()
        const checkValue = this.inputStream.map(calculateCheck)
        checkValue.onValue(value => this.setState({ checkValue: value }))
        checkValue
            .combine(this.inputStream.toProperty(''), (chk, inp) => chk && combiner(inp, chk))
            .filter(util.nonEmpty)
            .onValue(v => {
                this.setState({ value: v || '' })
                if (this.props.onValue) {
                    this.props.onValue(v)
                }
            })
    }

    public render() {
        return <Item name={this.props.name} valueStyle={styles.itemValue}>
            <GenerateButton onClick={this.generate} title="Luo uusi" />
            <TextField type="text" id={`${this.props.id}-input`} onChange={this.inputChanged}
                style={this.inputStyle} value={this.state.input} max-length={this.props['max-length']} />
            <TextField id={`${this.props.id}-check`}
                className="letter" read-only="read-only" value={this.state.checkValue} style={styles.check} />
            <input type="hidden" id={`${this.props.id}-value`} value={this.state.value} />
        </Item>
    }
}
