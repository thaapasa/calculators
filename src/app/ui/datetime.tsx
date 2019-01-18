import Bacon from 'baconjs';
import areIntlLocalesSupported from 'intl-locales-supported';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import React from 'react';
import { strToInt } from '../calc/numbers';
import { findNameDayFor, getNameDay } from '../util/namedays';
import { zeroPad } from '../util/strings';
import {
  htmlBoolean,
  identity,
  isDefined,
  isObject,
  isString,
} from '../util/util';
import Item from './component/item';
import { HalfSection } from './component/section';

const styles: { [key: string]: React.CSSProperties } = {
  len2: { width: '1.8em' },
  len3: { width: '2.6em' },
  len4: { width: '3.5em' },
  len7: { width: '4.2em' },
  len10: { width: '6em' },
  center: { textAlign: 'center', width: '100%' },
  item: {},
};

function readJavaTime(s: string | number): moment.Moment {
  if (typeof s === 'string') {
    s = parseInt(s, 10);
  }
  return moment(s);
}

function readUnixTime(s: string | number): moment.Moment {
  if (typeof s === 'string') {
    s = parseInt(s, 10);
  }
  return moment.unix(s);
}

function toIsoWeek(v: moment.Moment): string {
  return v.isValid() ? `${v.isoWeekYear()}/${v.isoWeek()}` : '';
}

function pad(val: string | number, len: number): string {
  if (typeof val === 'number' && isNaN(val)) {
    return val.toString();
  }
  return zeroPad(val.toString(), len);
}

const datePattern = 'D.M.YYYY';

function readDate(v: string): string {
  const c = moment(v);
  return c.isValid() ? c.format(datePattern) : '';
}

function writeDate(v: moment.Moment): Date | undefined {
  return v.isValid() ? v.toDate() : undefined;
}

function readDateText(v: string): object | undefined {
  const c = moment(v, datePattern);
  return c.isValid()
    ? { day: c.date(), month: c.month(), year: c.year() }
    : undefined;
}

function writeDateText(v: moment.Moment): string {
  return v.isValid() ? v.format(datePattern) : '';
}

const texts = {
  weekDay: ['', 'ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'],
  types: {
    iso8601: 'ISO 8601',
    iso8601utc: 'ISO 8601 UTC',
    javaTime: 'Java/JS time',
    unixTime: 'Unixtime',
    nameDay: 'Nimipäivä',
    week: 'Viikko',
  },
};

interface DateTimeType {
  readonly write: (x: any) => any;
  readonly read?: (x: string) => any;
  readonly src?: string;
  readonly reportValue?: boolean;
  readonly fullWidth?: boolean;
  readonly style?: React.CSSProperties;
  readonly inputStyle?: React.CSSProperties;
  readonly maxLength?: number;
  readonly readOnly?: boolean;
}

const typeInfo: { [key: string]: DateTimeType } = {
  week: {
    write: (val: any) => toStateValue(val, toIsoWeek),
    reportValue: true,
    inputStyle: styles.center,
  },
  focused: { write: identity },
  selected: { write: identity },
  iso8601: {
    read: v => moment(v, moment.ISO_8601),
    write: (m: any) => (m.isValid() ? m.format() : ''),
    src: 'iso8601',
    reportValue: true,
    fullWidth: true,
  },
  iso8601utc: {
    read: v => moment(v, moment.ISO_8601),
    write: (m: any) => (m.isValid() ? m.toISOString() : ''),
    src: 'iso8601utc',
    reportValue: true,
    fullWidth: true,
  },
  nameDay: {
    write: (val: any) =>
      toStateValue(val, (v: any) => getNameDay(v.month() + 1, v.date())),
    reportValue: true,
    inputStyle: styles.center,
  },
  weekDay: {
    write: (val: any) =>
      toStateValue(val, (v: any) => texts.weekDay[v.isoWeekday()]),
  },
  javaTime: {
    read: readJavaTime,
    src: 'javaTime',
    reportValue: true,
    write: (m: any) => (m.isValid() ? m.valueOf() : ''),
    fullWidth: true,
  },
  unixTime: {
    read: readUnixTime,
    src: 'unixTime',
    reportValue: true,
    write: (m: any) => (m.isValid() ? m.unix() : ''),
    fullWidth: true,
  },
  datePicker: {
    read: readDate,
    src: 'value',
    write: writeDate,
    style: styles.len7,
    maxLength: 10,
    inputStyle: styles.center,
  },
  date: {
    read: readDateText,
    src: 'value',
    write: writeDateText,
    style: styles.len10,
    reportValue: true,
    maxLength: 10,
    inputStyle: styles.center,
  },
  hour: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.hour(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
    inputStyle: styles.center,
  },
  minute: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.minute(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
    inputStyle: styles.center,
  },
  second: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.second(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
    inputStyle: styles.center,
  },
  millisecond: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.millisecond(), 3) : ''),
    style: styles.len3,
    maxLength: 3,
    inputStyle: styles.center,
  },
  timeZone: {
    write: (m: any) => (m.isValid() ? m.format('Z') : ''),
    style: styles.len7,
    maxLength: 6,
    inputStyle: styles.center,
    readOnly: true,
  },
  direct: { write: identity, src: 'direct' },
};

const hints = {
  date: '31.12.2016',
  hour: '10',
  minute: '00',
  second: '00',
  millisecond: '000',
  timeZone: '+02:00',
};

const valueTypes = [
  'date',
  'dateText',
  'hour',
  'minute',
  'second',
  'millisecond',
];

function getDateTimePolyfill() {
  const IntlPolyfill = require('intl');
  const format = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/fi');
  return format;
}

const DateTimeFormat = areIntlLocalesSupported(['fi'])
  ? global.Intl.DateTimeFormat
  : getDateTimePolyfill();

const types = Object.keys(typeInfo);

function toStateValue(
  mom: moment.Moment,
  writer: (x: moment.Moment) => any
): string {
  if (!moment.isMoment(mom)) {
    return '';
  }
  const s = writer(mom);
  if (!isDefined(s) || (typeof s === 'number' && isNaN(s))) {
    return '';
  }
  return typeof s === 'object' || s === null
    ? s
    : typeof s === 'number'
    ? `${s}`
    : s;
}

interface DateTimeProps {
  onValue: (x: any) => any;
}

interface DateTimeState {
  reportTarget: string;
  foundNameDays: string[];
  locale: string;
  datePicker: Date | undefined;
  date: string;
  weekDay: string;
  week: string;
  nameDay: string;
}

function formatDateForPicker() {
  return 'Valitse';
}

export default class DateTime extends React.Component<
  DateTimeProps,
  DateTimeState
> {
  public state: DateTimeState = {
    reportTarget: '',
    foundNameDays: [],
    locale: 'fi',
    datePicker: undefined,
    date: '',
    weekDay: '',
    week: '',
    nameDay: '',
  };

  private streams: { [key: string]: Bacon.Bus<any, any> } = {
    focused: new Bacon.Bus(),
  };

  constructor(props: DateTimeProps) {
    super(props);
    types.forEach(t => (this.state[t] = ''));
    this.state.datePicker = undefined;
  }

  public componentDidMount() {
    // Create streams and incoming (converted) streams
    const incoming: any = {
      direct: new Bacon.Bus(),
      focused: this.streams.focused,
    };
    types.forEach(t => {
      if (t !== 'focused') {
        this.streams[t] = new Bacon.Bus();
        this.streams[t].onValue((v: any) =>
          this.setState({ [t]: v } as DateTimeState)
        );
        incoming[t] = typeInfo[t].read
          ? this.streams[t].map(typeInfo[t].read)
          : this.streams[t];
      }
    });
    incoming.datePicker.onValue((v: string) => this.streams.date.push(v));
    incoming.value = Bacon.combineTemplate({
      date: incoming.date,
      hour: incoming.hour,
      minute: incoming.minute,
      second: incoming.second,
      millisecond: incoming.millisecond,
    }).map((v: any) =>
      moment({
        day: v.date && v.date.day,
        month: v.date && v.date.month,
        year: v.date && v.date.year,
        hour: v.hour,
        minute: v.minute,
        second: v.second,
        millisecond: v.millisecond,
      })
    );
    // Create stream for new value
    const newVal = Bacon.mergeAll(
      incoming.direct,
      incoming.unixTime,
      incoming.javaTime,
      incoming.iso8601,
      incoming.iso8601utc,
      Bacon.combineAsArray(incoming.value, this.streams.selected).flatMapLatest(
        t => (t[1] === 'value' ? t[0] : Bacon.never())
      )
    );
    // Process new value updates
    Bacon.combineAsArray(newVal, this.streams.selected).onValue(r => {
      const val = r[0];
      const src = r[1];
      types.forEach((t: string) => {
        if (typeInfo[t].src === src || !typeInfo[t].write) {
          return;
        }
        const output = typeInfo[t].write(val);
        this.setState({ [t]: output } as DateTimeState);
        if (src !== 'value' && (valueTypes as any).includes(t)) {
          this.streams[t].push(output);
        }
      });
      this.setState({ datePicker: typeInfo.datePicker.write(val) });
    });
    // Which value is reported to parent
    const reportTarget = incoming.focused.filter(
      (t: any) => typeInfo[t].reportValue
    );
    reportTarget.onValue((v: any) => this.setState({ reportTarget: v }));
    Bacon.combineAsArray(newVal, reportTarget).onValue(t =>
      this.props.onValue(typeInfo[t[1]].write(t[0]))
    );
    // Push default value
    this.pushValue(moment(), 'direct');
  }

  public render() {
    return (
      <HalfSection
        title="Aikaleimat"
        subtitle={texts.types[this.state.reportTarget]}
      >
        <Item name="Päivä" style={styles.item}>
          {this.renderType('date')}
          (
          <TextField
            type="text"
            value={this.state.weekDay}
            style={styles.len2}
            name="weekDay"
            hintText="la"
            inputStyle={styles.center}
            hintStyle={styles.center}
            read-only="read-only"
            onFocus={this.focusChanged}
          />
          )
          <DatePicker
            name="datePicker"
            container="inline"
            value={this.state.datePicker}
            textFieldStyle={typeInfo.datePicker.style}
            autoOk={true}
            formatDate={formatDateForPicker}
            DateTimeFormat={DateTimeFormat}
            locale={this.state.locale}
            hintText={hints.date}
            inputStyle={typeInfo.datePicker.inputStyle}
            hintStyle={typeInfo.datePicker.inputStyle}
            fullWidth={false}
            onChange={(a, v) => this.pushValue(v, 'datePicker')}
          />
        </Item>
        <Item name="Kellonaika" style={styles.item}>
          {this.renderType('hour')}:{this.renderType('minute')}:
          {this.renderType('second')}.{this.renderType('millisecond')}
          {this.renderType('timeZone')}
        </Item>
        <Item name="Viikko">
          <TextField
            type="text"
            name="week"
            value={this.state.week}
            style={styles.len7}
            read-only="read-only"
            inputStyle={styles.center}
            hintStyle={styles.center}
            hintText="2016/52"
            onFocus={this.focusChanged}
          />
        </Item>
        <Item name="Nimipäivä">
          <TextField
            type="text"
            name="nameDay"
            value={this.state.nameDay}
            fullWidth={true}
            read-only="read-only"
            multiLine={true}
            onFocus={this.focusChanged}
          />
        </Item>
        <Item name="Etsi nimipäivä">
          <AutoComplete
            name="findNameDay"
            key="findNameDay"
            hintText="Etsi nimipäivä"
            fullWidth={true}
            filter={AutoComplete.noFilter}
            onNewRequest={this.pushDate}
            dataSource={this.state.foundNameDays}
            onUpdateInput={this.handleFindNameDay}
          />
        </Item>
        <Item name="Java/JS time">{this.renderType('javaTime')}</Item>
        <Item name="Unixtime">{this.renderType('unixTime')}</Item>
        <Item name="ISO-8601">{this.renderType('iso8601')}</Item>
        <Item name="ISO-8601 UTC">{this.renderType('iso8601utc')}</Item>
      </HalfSection>
    );
  }

  private inputChanged = (event: any) => {
    const src = event.target.name;
    const val = event.target.value;
    this.pushValue(val, src);
  };

  private focusChanged = (event: any) => {
    const src = event.target.name;
    this.streams.focused.push(src);
  };

  private pushValue = (val: any, src: any) => {
    this.streams.selected.push(typeInfo[src].src);
    this.streams[src].push(val);
  };

  private renderType(type: any) {
    const info = typeInfo[type];
    return (
      <TextField
        type="text"
        value={this.state[type]}
        style={info.style}
        max-length={info.maxLength}
        name={type}
        hintText={hints[type]}
        inputStyle={info.inputStyle}
        hintStyle={info.inputStyle}
        fullWidth={info.fullWidth}
        onChange={this.inputChanged}
        onFocus={this.focusChanged}
        read-only={htmlBoolean(info.readOnly || false, 'read-only')}
      />
    );
  }

  private pushDate = (date: any) => {
    if (isObject(date) && date.value && date.value.day && date.value.month) {
      this.streams.selected.push('value');
      const d = moment({ day: date.value.day, month: date.value.month - 1 });
      this.streams.date.push(writeDateText(d));
      this.streams.datePicker.push(d.toDate());
    }
  };

  private handleFindNameDay = (val: any) => {
    const res: any[] = [];
    if (isString(val) && val.length >= 2) {
      const matches = findNameDayFor(val);
      Object.keys(matches).forEach(name => {
        const date = matches[name];
        res.push({
          text: `${name}: ${date.day}.${date.month}.`,
          value: date,
        });
      });
    }
    this.setState({ foundNameDays: res });
  };
}
