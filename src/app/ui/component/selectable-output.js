import React from "react"
import * as Bacon from "baconjs"
import {identity} from "../../util/util"
import {toUpperCase} from "../../util/strings"
import Item from "./item"
import Checkbox from "material-ui/Checkbox"
import TextField from "material-ui/TextField"
import FontIcon from "material-ui/FontIcon"
import {red500} from "material-ui/styles/colors"

export default class SelectableOutput extends React.Component {

    constructor(props) {
        super(props)
        this.setValue = this.setValue.bind(this)
        this.checkUpperCase= this.checkUpperCase.bind(this)

        this.state = { value: "" }
    }

    componentDidMount() {
        this.inputStream = new Bacon.Bus()
        this.ucStream = new Bacon.Bus()
        this.streamCalculation(this.inputStream, this.props.calculate, this.ucIfChecked(this.ucStream.toProperty(false)))
    }

    setValue(val) {
        this.inputStream.push(val)
    }

    streamCalculation(inputStream, calculation, calcMapper) {
        let calculated = inputStream.map(calculation)
        if (calcMapper) {
            calculated = calculated.combine(calcMapper, (val, m) => m(val))
        }
        calculated.onValue(v => {
            this.setState( { value: v } )
            if (this.props.onValue) this.props.onValue(v)
        })
    }

    checkUpperCase(event) {
        this.ucStream.push(event.target.checked)
        this.props.onSelect && this.props.onSelect(event)
    }

    ucIfChecked(stream) {
        return stream.map((checked) => checked ? toUpperCase : identity)
    }

    render() {
        const my = this
        return <Item name={<Checkbox name={my.props.type + "-upper-case"} label={
            <FontIcon className="material-icons" color={red500}>text_format</FontIcon>
        } onCheck={this.checkUpperCase}/>}>
            <TextField type="text" floatingLabelText={this.props.label} className="wide" value={this.state.value}
                       fullWidth={true} readOnly name="output" onFocus={this.props.onSelect}/>
        </Item>
    }
}
