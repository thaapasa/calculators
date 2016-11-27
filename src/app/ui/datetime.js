import React from "react"
import {HalfSection} from "./component/section"
import Item from "./component/item"
import TextField from "material-ui/TextField"
import moment from "moment"
import * as Bacon from "baconjs"
import {isDefined} from "../util/util"
import {strToInt} from "../calc/numbers"

const styles = {
    len2: { width: "2em" },
    len3: { width: "3em" },
    len4: { width: "4em" }
}

function readJavaTime(s) {
    if (typeof s === "string") s = parseInt(s, 10)
    if (typeof s !== "number" || isNaN(s)) return
    return moment(s)
}

function readUnixTime(s) {
    if (typeof s === "string") s = parseInt(s, 10)
    if (typeof s !== "number" || isNaN(s)) return
    return moment.unix(s)
}

const typeInfo = {
    selected: { },
    javaTime: { read: readJavaTime, src: "javaTime", write: m => m.unix() * 1000 },
    unixTime: { read: readUnixTime, src: "unixTime", write: m => m.unix() },
    day: { read: strToInt, src: "value", write: m => m.date() },
    month: { read: v => strToInt(v) - 1, src: "value", write: m => m.month() + 1 },
    year: { read: strToInt, src: "value", write: m => m.year() },
    hour: { read: strToInt, src: "value", write: m => m.hour() },
    minute: { read: strToInt, src: "value", write: m => m.minute() },
    second: { read: strToInt, src: "value", write: m => m.second() },
    milli: { read: strToInt, src: "value", write: m => m.millisecond() },
    direct: { src: "direct" }
}

const valueTypes = ["day", "month", "year", "hour", "minute", "second", "milli"]

const types = Object.keys(typeInfo)

function toStateValue(mom, writer) {
    if (typeof mom !== "object") return ""
    let s = writer(mom)
    if (!isDefined(s) || (typeof s === "number" && isNaN(s))) return ""
    return (typeof s === "number") ? `${s}` : s
}

export default class DateTime extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            week: ""
        }
        types.forEach(t => this.state[t] = "")
        this.inputChanged = this.inputChanged.bind(this)
    }

    componentDidMount() {
        this.streams = {}
        const incoming = { direct: new Bacon.Bus() }
        types.forEach(t => {
            this.streams[t] = new Bacon.Bus()
            this.streams[t].onValue(v => this.setState({ [t]: v }))
            incoming[t] = ((typeInfo[t].read) ? this.streams[t].map(typeInfo[t].read) : this.streams[t])
        })
        incoming.value = Bacon.combineTemplate({
            day: incoming.day,
            month: incoming.month,
            year: incoming.year,
            hour: incoming.hour,
            minute: incoming.minute,
            second: incoming.second,
            millisecond: incoming.milli
        }).map(v => moment(v))
        const newVal = Bacon.mergeAll(incoming.direct, incoming.unixTime, incoming.javaTime,
            Bacon.combineAsArray(incoming.value, this.streams.selected)
                .flatMapLatest(t => t[1] == "value" ? t[0] : Bacon.never()))
        Bacon.combineAsArray(newVal, this.streams.selected).onValue(r => {
            const val = r[0]
            const src = r[1]
            types.forEach(t => {
                if (typeInfo[t].src == src || !typeInfo[t].write) return
                const output = toStateValue(val, typeInfo[t].write)
                this.setState({ [t]: output })
                if (src != "value" && valueTypes.includes(t))
                    this.streams[t].push(output)
            })
            this.setState({ week: toStateValue(val, v => `${v.weekYear()}/${v.week()}`)})
        })
        this.pushValue(moment(), "direct")
    }

    inputChanged(event) {
        const src = event.target.name
        const val = event.target.value
        this.pushValue(val, src)
    }

    pushValue(val, src) {
        this.streams.selected.push(typeInfo[src].src)
        this.streams[src].push(val)
    }

    render() {
        return <HalfSection title="Aikaleimat">
            <Item name="Java/JS time">
                <TextField type="text" value={this.state.javaTime} fullWidth={true} name="javaTime"
                           onChange={this.inputChanged }/>
            </Item>
            <Item name="Unixtime">
                <TextField type="text" value={this.state.unixTime} fullWidth={true} name="unixTime"
                           onChange={this.inputChanged} />
            </Item>
            <Item name="Päivä" style={styles.item}>
                <TextField type="text" value={this.state.day} style={styles.len2} maxLength={2}
                           name="day" hintText="31" onChange={this.inputChanged}/>.
                <TextField type="text" value={this.state.month} style={styles.len2} maxLength={2}
                           name="month" hintText="12" onChange={this.inputChanged}/>.
                <TextField type="text" value={this.state.year} style={styles.len4} maxLength={4}
                           name="year" hintText="2016" onChange={this.inputChanged}/>
            </Item>
            <Item name="Kellonaika" style={styles.item}>
                <TextField type="text" value={this.state.hour} style={styles.len2} maxLength={2}
                           name="hour" hintText="18" onChange={this.inputChanged}/>.
                <TextField type="text" value={this.state.minute} style={styles.len2} maxLength={2}
                           name="minute" hintText="00" onChange={this.inputChanged}/>.
                <TextField type="text" value={this.state.second} style={styles.len2} maxLength={2}
                           name="second" hintText="00" onChange={this.inputChanged}/>.
                <TextField type="text" value={this.state.milli} style={styles.len3} maxLength={3}
                           name="milli" hintText="000" onChange={this.inputChanged}/>
            </Item>
            <Item name="Viikko">
                <TextField type="text" value={this.state.week} readOnly hintText="2016/52" />
            </Item>
        </HalfSection>

    }
}
