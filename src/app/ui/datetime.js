import React from "react"
import {HalfSection} from "./component/section"
import Item from "./component/item"
import TextField from "material-ui/TextField"
import moment from "moment"
import * as Bacon from "baconjs"
import {isDefined} from "../util/util"
import {strToInt} from "../calc/numbers"
import {zeroPad} from "../util/strings"
import {getNameDay} from "../util/namedays"

window.moment = moment

const styles = {
    len2: { width: "1.8em" },
    len3: { width: "2.6em" },
    len4: { width: "3.5em" },
    len7: { width: "4.2em" },
    center: { textAlign: "center", width: "100%" }
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

function toIsoWeek(v) {
    return v.isValid() ? `${v.isoWeekYear()}/${v.isoWeek()}` : ""
}

function pad(val, len) {
    if (typeof val == "number" && isNaN(val)) return val
    return zeroPad(val, len)
}

const texts = {
    weekDay: ["", "ma", "ti", "ke", "to", "pe", "la", "su"],
    types: {
        iso8601: "ISO 8601",
        iso8601utc: "ISO 8601 UTC",
        javaTime: "Java/JS time",
        unixTime: "Unixtime",
        nameDay: "Nimipäivä",
        week: "Viikko"
    }
}


const typeInfo = {
    week: { write: val => toStateValue(val, toIsoWeek), reportValue: true, inputStyle: styles.center },
    focused: { },
    selected: { },
    iso8601: { read: v => moment(v, moment.ISO_8601), write: m => m.isValid() ? m.format() : "", src: "iso8601", reportValue: true, fullWidth: true },
    iso8601utc: { read: v => moment(v, moment.ISO_8601), write: m => m.isValid() ? m.toISOString() : "", src: "iso8601utc", reportValue: true, fullWidth: true },
    nameDay: { write: val => toStateValue(val, v => getNameDay(v.month() + 1, v.date())), reportValue: true, inputStyle: styles.center },
    weekDay: { write: val => toStateValue(val, v => texts.weekDay[v.isoWeekday()]) },
    javaTime: { read: readJavaTime, src: "javaTime", reportValue: true, write: m => m.isValid() ? m.valueOf() : "", fullWidth: true },
    unixTime: { read: readUnixTime, src: "unixTime", reportValue: true, write: m => m.isValid() ? m.unix() : "", fullWidth: true },
    day: { read: strToInt, src: "value", write: m => pad(m.date(), 2), style: styles.len2, maxLength: 2, inputStyle: styles.center },
    month: { read: v => strToInt(v) - 1, src: "value", write: m => pad(m.month() + 1, 2), style: styles.len2, maxLength: 2, inputStyle: styles.center },
    year: { read: strToInt, src: "value", write: m => m.year(), style: styles.len4, maxLength: 4, inputStyle: styles.center },
    hour: { read: strToInt, src: "value", write: m => pad(m.hour(), 2), style: styles.len2, maxLength: 2, inputStyle: styles.center },
    minute: { read: strToInt, src: "value", write: m => pad(m.minute(), 2), style: styles.len2, maxLength: 2, inputStyle: styles.center },
    second: { read: strToInt, src: "value", write: m => pad(m.second(), 2), style: styles.len2, maxLength: 2, inputStyle: styles.center },
    millisecond: { read: strToInt, src: "value", write: m => pad(m.millisecond(), 3), style: styles.len3, maxLength: 3, inputStyle: styles.center },
    timeZone: { write: m => m.isValid() ? m.format('Z') : "", style: styles.len7, maxLength: 6, inputStyle: styles.center, readOnly: true },
    direct: { src: "direct" }
}

const hints = {
    day: "31",
    month: "12",
    year: "2016",
    hour: "10",
    minute: "00",
    second: "00",
    millisecond: "000",
    timeZone: "+02:00"
}

const valueTypes = ["day", "month", "year", "hour", "minute", "second", "millisecond"]

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
            reportTarget: ""
        }
        types.forEach(t => this.state[t] = "")
        this.inputChanged = this.inputChanged.bind(this)
        this.focusChanged = this.focusChanged.bind(this)
    }

    componentDidMount() {
        // Create streams and incoming (converted) streams
        this.streams = { focused: new Bacon.Bus() }
        const incoming = { direct: new Bacon.Bus(), focused: this.streams.focused }
        types.forEach(t => {
            if (t != "focused") {
                this.streams[t] = new Bacon.Bus()
                this.streams[t].onValue(v => this.setState({[t]: v}))
                incoming[t] = ((typeInfo[t].read) ? this.streams[t].map(typeInfo[t].read) : this.streams[t])
            }
        })
        incoming.value = Bacon.combineTemplate({
            day: incoming.day,
            month: incoming.month,
            year: incoming.year,
            hour: incoming.hour,
            minute: incoming.minute,
            second: incoming.second,
            millisecond: incoming.millisecond
        }).map(v => moment(v))
        // Create stream for new value
        const newVal = Bacon.mergeAll(incoming.direct, incoming.unixTime, incoming.javaTime,
            incoming.iso8601, incoming.iso8601utc,
            Bacon.combineAsArray(incoming.value, this.streams.selected)
                .flatMapLatest(t => t[1] == "value" ? t[0] : Bacon.never()))
        // Process new value updates
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
        })
        // Which value is reported to parent
        const reportTarget = incoming.focused.filter(t => typeInfo[t].reportValue)
        reportTarget.onValue(v => this.setState({ reportTarget: v }))
        Bacon.combineAsArray(newVal, reportTarget).onValue(t => this.props.onValue(typeInfo[t[1]].write(t[0])))
        // Push default value
        this.pushValue(moment(), "direct")
    }

    inputChanged(event) {
        const src = event.target.name
        const val = event.target.value
        this.pushValue(val, src)
    }

    focusChanged(event) {
        const src = event.target.name
        this.streams.focused.push(src)
    }

    pushValue(val, src) {
        this.streams.selected.push(typeInfo[src].src)
        this.streams[src].push(val)
    }

    renderType(type) {
        const info = typeInfo[type]
        return <TextField type="text" value={this.state[type]} style={info.style}
                          maxLength={info.maxLength} name={type} hintText={hints[type]}
                          inputStyle={info.inputStyle} hintStyle={info.inputStyle} fullWidth={info.fullWidth}
                          onChange={this.inputChanged} onFocus={this.focusChanged} readOnly={info.readOnly} />
    }

    render() {
        return <HalfSection title="Aikaleimat" subtitle={texts.types[this.state.reportTarget]}>
            <Item name="Java/JS time">
                { this.renderType("javaTime") }
            </Item>
            <Item name="Unixtime">
                { this.renderType("unixTime") }
            </Item>
            <Item name="Päivä" style={styles.item}>
                {this.renderType("day")}.{this.renderType("month")}.{this.renderType("year")}
                (<TextField type="text" value={this.state.weekDay} style={styles.len2} name="weekDay"
                            hintText="la" inputStyle={styles.center} hintStyle={styles.center} readOnly
                            onFocus={this.focusChanged} />)
            </Item>
            <Item name="Kellonaika" style={styles.item}>
                {this.renderType("hour")}:{this.renderType("minute")}:{this.renderType("second")}.{this.renderType("millisecond")}
                {this.renderType("timeZone")}
            </Item>
            <Item name="Viikko">
                <TextField type="text" name="week" value={this.state.week} style={styles.len7} readOnly
                           inputStyle={styles.center} hintStyle={styles.center} hintText="2016/52"
                           onFocus={this.focusChanged} />
            </Item>
            <Item name="Nimipäivä">
                <TextField type="text" name="nameDay" value={this.state.nameDay} fullWidth={true} readOnly
                           multiLine={true} onFocus={this.focusChanged} />
            </Item>
            <Item name="ISO-8601">
                { this.renderType("iso8601") }
            </Item>
            <Item name="ISO-8601 UTC">
                { this.renderType("iso8601utc") }
            </Item>
            </HalfSection>

    }
}
