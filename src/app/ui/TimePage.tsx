import { styled, TextField } from '@mui/material';
import * as Bacon from 'baconjs';
import moment from 'moment';
import React from 'react';

import { strToInt } from '../calc/numbers';
import { findNameDayFor, getNameDay, MonthDay } from '../util/namedays';
import { zeroPad } from '../util/strings';
import { identity, isDefined, isString, objectKeys } from '../util/util';
import AutoComplete from './component/autocomplete';
import Item from './component/item';
import { HalfSection } from './component/section';
import { publishSelectedValue } from './LastValue';

const styles: { [key: string]: React.CSSProperties } = {
  len2: { width: '1.7em' },
  len3: { width: '2.4em' },
  len4: { width: '3.5em' },
  len7: { width: '4.2em' },
  len10: { width: '6em' },
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
  return c.isValid() ? { day: c.date(), month: c.month(), year: c.year() } : undefined;
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
  readonly maxLength?: number;
  readonly readOnly?: boolean;
}

const typeInfo = {
  week: {
    write: (val: any) => toStateValue(val, toIsoWeek),
    reportValue: true,
    style: styles.center,
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
    write: (val: any) => toStateValue(val, (v: any) => getNameDay(v.month() + 1, v.date())),
    reportValue: true,
    style: styles.center,
  },
  weekDay: {
    write: (val: any) => toStateValue(val, (v: any) => texts.weekDay[v.isoWeekday()]),
    style: styles.center,
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
  },
  date: {
    read: readDateText,
    src: 'value',
    write: writeDateText,
    style: styles.len10,
    reportValue: true,
    maxLength: 10,
  },
  hour: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.hour(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
  },
  minute: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.minute(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
  },
  second: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.second(), 2) : ''),
    style: styles.len2,
    maxLength: 2,
  },
  millisecond: {
    read: strToInt,
    src: 'value',
    write: (m: any) => (m.isValid() ? pad(m.millisecond(), 3) : ''),
    style: styles.len3,
    maxLength: 3,
  },
  timeZone: {
    write: (m: any) => (m.isValid() ? m.format('Z') : ''),
    style: styles.len7,
    maxLength: 6,
    readOnly: true,
  },
  direct: { write: identity, src: 'direct' },
} satisfies Record<string, DateTimeType>;

const hints = {
  date: '31.12.2016',
  hour: '10',
  minute: '00',
  second: '00',
  millisecond: '000',
  timeZone: '+02:00',
};

const valueTypes = ['date', 'dateText', 'hour', 'minute', 'second', 'millisecond'];

const types = objectKeys(typeInfo);
type TypeField = (typeof types)[number];

function toStateValue(mom: moment.Moment, writer: (x: moment.Moment) => any): string {
  if (!moment.isMoment(mom)) {
    return '';
  }
  const s = writer(mom);
  if (!isDefined(s) || (typeof s === 'number' && isNaN(s))) {
    return '';
  }
  return typeof s === 'object' || s === null ? s : typeof s === 'number' ? `${s}` : s;
}

interface DateTimeProps {}

interface NameDayItem {
  text: string;
  name: string;
  value: MonthDay;
}

interface DateTimeState extends Partial<Record<TypeField, string | Date>> {
  reportTarget: string;
  foundNameDays: NameDayItem[];
  locale: string;
  datePicker: Date | undefined;
  date: string;
  weekDay: string;
  week: string;
  nameDay: string;
}

export class TimePage extends React.Component<DateTimeProps, DateTimeState> {
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

  private streams: { [key: string]: Bacon.Bus<any> } = {
    focused: new Bacon.Bus(),
  };

  constructor(props: DateTimeProps) {
    super(props);
    // eslint-disable-next-line
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
        this.streams[t].onValue((v: any) => this.setState({ [t]: v } as DateTimeState));
        incoming[t] =
          'read' in typeInfo[t] ? this.streams[t].map(typeInfo[t].read) : this.streams[t];
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
      }),
    );
    // Create stream for new value
    const newVal = Bacon.mergeAll(
      incoming.direct,
      incoming.unixTime,
      incoming.javaTime,
      incoming.iso8601,
      incoming.iso8601utc,
      Bacon.combineAsArray(incoming.value, this.streams.selected).flatMapLatest(t =>
        t[1] === 'value' ? t[0] : Bacon.never(),
      ),
    );
    // Process new value updates
    Bacon.combineAsArray(newVal, this.streams.selected).onValue(r => {
      const val = r[0];
      const src = r[1];
      types.forEach((t: TypeField) => {
        if (('src' in typeInfo[t] && typeInfo[t].src === src) || !typeInfo[t].write) {
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
    const reportTarget = incoming.focused.filter((t: any) => typeInfo[t].reportValue);
    reportTarget.onValue((v: any) => this.setState({ reportTarget: v }));
    Bacon.combineAsArray(newVal, reportTarget).onValue(t =>
      publishSelectedValue(typeInfo[t[1]].write(t[0])),
    );
    // Push default value
    this.pushValue(moment(), 'direct');
  }

  public render() {
    return (
      <HalfSection
        title="Aikaleimat"
        subtitle={texts.types[this.state.reportTarget]}
        image="/img/header-datetime.jpg"
      >
        <TimeItem name="Päivä" style={styles.item}>
          {this.renderType('date')}
          (
          <TimeField
            type="text"
            value={this.state.weekDay}
            style={styles.len2}
            name="weekDay"
            placeholder="la"
            inputProps={{ readOnly: true }}
            onFocus={this.focusChanged}
          />
          )
        </TimeItem>
        <TimeItem name="Kellonaika" style={styles.item}>
          {this.renderType('hour')}:{this.renderType('minute')}:{this.renderType('second')}.
          {this.renderType('millisecond')}
          {this.renderType('timeZone')}
        </TimeItem>
        <TimeItem name="Viikko">
          <TimeField
            type="text"
            name="week"
            value={this.state.week}
            style={styles.len7}
            inputProps={{ readOnly: true }}
            placeholder="2016/52"
            onFocus={this.focusChanged}
          />
        </TimeItem>
        <TimeItem name="Nimipäivä">
          <TimeField
            type="text"
            name="nameDay"
            value={this.state.nameDay}
            fullWidth={true}
            multiline={true}
            onFocus={this.focusChanged}
          />
        </TimeItem>
        <TimeItem name="Etsi nimipäivä">
          <AutoCompleteWrapper>
            <AutoComplete
              name="findNameDay"
              placeholder="Etsi nimipäivä"
              getSuggestions={findNameDays}
              renderSuggestion={renderMonthDayItem}
              getSuggestionValue={monthDayToInputValue}
              onSelectSuggestion={this.selectNameDay}
              fullWidth={true}
            />
          </AutoCompleteWrapper>
        </TimeItem>
        <TimeItem name="Java/JS time">{this.renderType('javaTime')}</TimeItem>
        <TimeItem name="Unixtime">{this.renderType('unixTime')}</TimeItem>
        <TimeItem name="ISO-8601">{this.renderType('iso8601')}</TimeItem>
        <TimeItem name="ISO-8601 UTC">{this.renderType('iso8601utc')}</TimeItem>
      </HalfSection>
    );
  }

  private selectNameDay = (day: NameDayItem) => {
    const m = moment()
      .startOf('day')
      .month(day.value.month - 1)
      .date(day.value.day);
    const date = m.format(datePattern);
    this.pushValue(date, 'date');
  };

  private inputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const src = event.target.name;
    const val = event.target.value;
    this.pushValue(val, src);
  };

  private focusChanged = (event: React.FocusEvent<HTMLInputElement>) => {
    const src = event.target.name;
    this.streams.focused.push(src);
  };

  private pushValue = (val: string | moment.Moment, src: any) => {
    this.streams.selected.push(typeInfo[src].src);
    this.streams[src].push(val);
  };

  private renderType(type: TypeField) {
    const info = typeInfo[type] as DateTimeType;
    return (
      <TimeField
        type="text"
        value={this.state[type]}
        style={info.style}
        inputProps={{
          maxLength: info.maxLength,
          readOnly: info.readOnly || false,
        }}
        name={type}
        placeholder={hints[type]}
        fullWidth={info.fullWidth}
        onChange={this.inputChanged}
        onFocus={this.focusChanged}
      />
    );
  }
}

const TimeItem = styled(Item)`
  margin-top: 8px;
`;

const TimeField = styled(TextField)`
  & input,
  & textarea {
    margin-left: 4px;
  }
`;

const findNameDays = (input: string): NameDayItem[] => {
  const res: NameDayItem[] = [];
  if (isString(input) && input.length >= 2) {
    const matches = findNameDayFor(input);
    Object.keys(matches).forEach(name => {
      const date = matches[name];
      res.push({
        text: `${name}: ${date.day}.${date.month}.`,
        name,
        value: date,
      });
    });
  }
  return res;
};

const renderMonthDayItem = (m: NameDayItem) => m.text;
const monthDayToInputValue = (m: NameDayItem) => m.name;

const AutoCompleteWrapper = styled('div')`
  & input {
    margin-left: 4px;
  }
`;
