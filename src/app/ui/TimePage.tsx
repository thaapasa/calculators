import { Input, styled } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';

import { strToInt } from '../calc/numbers';
import { findNameDayFor, getNameDay, MonthDay } from '../util/namedays';
import { zeroPad } from '../util/strings';
import { isDefined, isString } from '../util/util';
import { AutoComplete } from './component/AutoComplete';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

const styles: { [key: string]: React.CSSProperties } = {
  len2: { width: '1.7em' },
  len3: { width: '2.4em' },
  len4: { width: '3.5em' },
  len7: { width: '4.5em' },
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
  } as Record<string, string>,
};

const hints: Record<string, string> = {
  date: '31.12.2016',
  hour: '10',
  minute: '00',
  second: '00',
  millisecond: '000',
  timeZone: '+02:00',
};

interface NameDayItem {
  text: string;
  name: string;
  value: MonthDay;
}

function toStateValue(mom: moment.Moment, writer: (x: moment.Moment) => unknown): string {
  if (!moment.isMoment(mom)) return '';
  const s = writer(mom);
  if (!isDefined(s) || (typeof s === 'number' && isNaN(s))) return '';
  return typeof s === 'object' || s === null
    ? (s as unknown as string)
    : typeof s === 'number'
      ? `${s}`
      : (s as string);
}

// Build moment from date+time parts
function buildMoment(
  dateStr: string,
  hour: string,
  minute: string,
  second: string,
  millisecond: string,
): moment.Moment {
  const d = readDateText(dateStr);
  return moment({
    day: d && (d as { day: number }).day,
    month: d && (d as { month: number }).month,
    year: d && (d as { year: number }).year,
    hour: strToInt(hour),
    minute: strToInt(minute),
    second: strToInt(second),
    millisecond: strToInt(millisecond),
  });
}

// Compute all display values from a moment
function computeOutputs(m: moment.Moment) {
  return {
    date: writeDateText(m),
    hour: m.isValid() ? pad(m.hour(), 2) : '',
    minute: m.isValid() ? pad(m.minute(), 2) : '',
    second: m.isValid() ? pad(m.second(), 2) : '',
    millisecond: m.isValid() ? pad(m.millisecond(), 3) : '',
    timeZone: m.isValid() ? m.format('Z') : '',
    weekDay: toStateValue(m, v => texts.weekDay[v.isoWeekday()]),
    week: toStateValue(m, toIsoWeek),
    nameDay: toStateValue(m, v => getNameDay(v.month() + 1, v.date())),
    iso8601: m.isValid() ? m.format() : '',
    iso8601utc: m.isValid() ? m.toISOString() : '',
    javaTime: m.isValid() ? String(m.valueOf()) : '',
    unixTime: m.isValid() ? String(m.unix()) : '',
    datePicker: m.isValid() ? m.toDate() : undefined,
  };
}

type TimeValues = ReturnType<typeof computeOutputs>;
type TimeField = keyof TimeValues;

// Which fields are "direct" inputs (user edits these)
type EditableField =
  | 'date'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'iso8601'
  | 'iso8601utc'
  | 'javaTime'
  | 'unixTime';

// Which fields report values to parent
const reportableFields: Record<string, boolean> = {
  iso8601: true,
  iso8601utc: true,
  javaTime: true,
  unixTime: true,
  nameDay: true,
  week: true,
  date: true,
};

// Readers that convert input string to a moment
const fieldReaders: Record<string, (s: string) => moment.Moment> = {
  iso8601: s => moment(s, moment.ISO_8601),
  iso8601utc: s => moment(s, moment.ISO_8601),
  javaTime: readJavaTime,
  unixTime: readUnixTime,
};

// Field writers for publishSelectedValue
const fieldWriters: Record<string, (m: moment.Moment) => string> = {
  iso8601: m => (m.isValid() ? m.format() : ''),
  iso8601utc: m => (m.isValid() ? m.toISOString() : ''),
  javaTime: m => (m.isValid() ? String(m.valueOf()) : ''),
  unixTime: m => (m.isValid() ? String(m.unix()) : ''),
  week: m => toStateValue(m, toIsoWeek),
  nameDay: m => toStateValue(m, v => getNameDay(v.month() + 1, v.date())),
  date: m => writeDateText(m),
};

export function TimePage() {
  const initialMoment = moment();
  const initialOutputs = computeOutputs(initialMoment);

  const [vals, setVals] = useState<TimeValues>(initialOutputs);
  const [reportTarget, setReportTarget] = useState('');

  // Keep a ref to the latest moment for publishing
  const currentMomentRef = useRef(initialMoment);

  const updateFromMoment = useCallback(
    (m: moment.Moment, src: EditableField | 'direct' | 'datePicker') => {
      currentMomentRef.current = m;
      const outputs = computeOutputs(m);
      // For "value-part" edits (date, time fields), skip updating the edited field
      if (['date', 'hour', 'minute', 'second', 'millisecond'].includes(src)) {
        setVals(prev => ({ ...outputs, [src]: prev[src as TimeField] }));
      } else if (
        src === 'iso8601' ||
        src === 'iso8601utc' ||
        src === 'javaTime' ||
        src === 'unixTime'
      ) {
        setVals(prev => ({ ...outputs, [src]: prev[src] }));
      } else {
        setVals(outputs);
      }
    },
    [],
  );

  const inputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const src = event.target.name as EditableField;
      const val = event.target.value;
      // Update the raw input value immediately
      setVals(prev => ({ ...prev, [src]: val }));

      let m: moment.Moment;
      if (src in fieldReaders) {
        // Direct conversion fields (ISO, unix, java)
        m = fieldReaders[src](val);
      } else if (src === 'date') {
        // Date text field - rebuild from parts
        m = buildMoment(
          val,
          String(vals.hour),
          String(vals.minute),
          String(vals.second),
          String(vals.millisecond),
        );
      } else {
        // Time part fields (hour, minute, second, millisecond) - rebuild from parts
        const parts = { ...vals, [src]: val };
        m = buildMoment(
          String(parts.date),
          String(parts.hour),
          String(parts.minute),
          String(parts.second),
          String(parts.millisecond),
        );
      }

      updateFromMoment(m, src);

      // Publish value if the focused field is reportable
      if (reportTarget && fieldWriters[reportTarget]) {
        publishSelectedValue(fieldWriters[reportTarget](m));
      }
    },
    [vals, updateFromMoment, reportTarget],
  );

  const focusChanged = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const src = event.target.name;
    if (reportableFields[src]) {
      setReportTarget(src);
      if (fieldWriters[src]) {
        publishSelectedValue(fieldWriters[src](currentMomentRef.current));
      }
    }
  }, []);

  const selectNameDay = useCallback(
    (day: NameDayItem) => {
      const m = moment()
        .startOf('day')
        .month(day.value.month - 1)
        .date(day.value.day);
      const date = m.format(datePattern);
      // Treat as date input
      const fullMoment = buildMoment(
        date,
        String(vals.hour),
        String(vals.minute),
        String(vals.second),
        String(vals.millisecond),
      );
      updateFromMoment(fullMoment, 'date');
      setVals(prev => ({ ...prev, date }));
    },
    [vals, updateFromMoment],
  );

  const renderType = (type: string) => {
    const fieldStyle = (
      {
        date: styles.len10,
        hour: styles.len2,
        minute: styles.len2,
        second: styles.len2,
        millisecond: styles.len3,
        timeZone: styles.len7,
        iso8601: undefined,
        iso8601utc: undefined,
        javaTime: undefined,
        unixTime: undefined,
      } as Record<string, React.CSSProperties | undefined>
    )[type];

    const maxLength = (
      {
        date: 10,
        hour: 2,
        minute: 2,
        second: 2,
        millisecond: 3,
        timeZone: 6,
      } as Record<string, number>
    )[type];

    const isReadOnly = type === 'timeZone';
    const isFullWidth = ['iso8601', 'iso8601utc', 'javaTime', 'unixTime'].includes(type);

    return (
      <TimeField
        size="small"
        type="text"
        value={vals[type as TimeField] ?? ''}
        style={fieldStyle}
        inputProps={{
          maxLength,
          readOnly: isReadOnly,
        }}
        name={type}
        placeholder={hints[type]}
        fullWidth={isFullWidth}
        onChange={inputChanged}
        onFocus={focusChanged}
      />
    );
  };

  return (
    <HalfSection
      title="Aikaleimat"
      subtitle={texts.types[reportTarget]}
      image="/img/header-datetime.jpg"
    >
      <TimeItem name="Päivä" style={styles.item}>
        {renderType('date')}
        (
        <TimeField
          type="text"
          value={vals.weekDay}
          style={styles.len2}
          name="weekDay"
          placeholder="la"
          inputProps={{ readOnly: true }}
          onFocus={focusChanged}
        />
        )
      </TimeItem>
      <TimeItem name="Kellonaika" style={styles.item}>
        {renderType('hour')}:{renderType('minute')}:{renderType('second')}.
        {renderType('millisecond')}
        {renderType('timeZone')}
      </TimeItem>
      <TimeItem name="Viikko">
        <TimeField
          type="text"
          name="week"
          value={vals.week}
          style={styles.len7}
          inputProps={{ readOnly: true }}
          placeholder="2016/52"
          onFocus={focusChanged}
        />
      </TimeItem>
      <TimeItem name="Nimipäivä">
        <TimeField
          type="text"
          name="nameDay"
          value={vals.nameDay}
          fullWidth={true}
          multiline={true}
          onFocus={focusChanged}
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
            onSelectSuggestion={selectNameDay}
            fullWidth={true}
          />
        </AutoCompleteWrapper>
      </TimeItem>
      <TimeItem name="Java/JS time">{renderType('javaTime')}</TimeItem>
      <TimeItem name="Unixtime">{renderType('unixTime')}</TimeItem>
      <TimeItem name="ISO-8601">{renderType('iso8601')}</TimeItem>
      <TimeItem name="ISO-8601 UTC">{renderType('iso8601utc')}</TimeItem>
    </HalfSection>
  );
}

const TimeItem = styled(Item)`
  margin-top: 8px;
`;

const TimeField = styled(Input)`
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
