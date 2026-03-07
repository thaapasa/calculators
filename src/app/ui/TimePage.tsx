import { cn } from 'lib/utils';
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

const reportableFields: Record<string, boolean> = {
  iso8601: true,
  iso8601utc: true,
  javaTime: true,
  unixTime: true,
  nameDay: true,
  week: true,
  date: true,
};

const fieldReaders: Record<string, (s: string) => moment.Moment> = {
  iso8601: s => moment(s, moment.ISO_8601),
  iso8601utc: s => moment(s, moment.ISO_8601),
  javaTime: readJavaTime,
  unixTime: readUnixTime,
};

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

  const currentMomentRef = useRef(initialMoment);

  const updateFromMoment = useCallback(
    (m: moment.Moment, src: EditableField | 'direct' | 'datePicker') => {
      currentMomentRef.current = m;
      const outputs = computeOutputs(m);
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
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const src = event.target.name as EditableField;
      const val = event.target.value;
      setVals(prev => ({ ...prev, [src]: val }));

      let m: moment.Moment;
      if (src in fieldReaders) {
        m = fieldReaders[src](val);
      } else if (src === 'date') {
        m = buildMoment(
          val,
          String(vals.hour),
          String(vals.minute),
          String(vals.second),
          String(vals.millisecond),
        );
      } else {
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
    const widthClass =
      (
        {
          date: 'w-[6em]',
          hour: 'w-[1.7em]',
          minute: 'w-[1.7em]',
          second: 'w-[1.7em]',
          millisecond: 'w-[2.4em]',
          timeZone: 'w-[4.5em]',
        } as Record<string, string>
      )[type] ?? '';

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
      <input
        type="text"
        className={cn('input-inline ml-1', widthClass, isFullWidth && 'flex-1')}
        value={(vals[type as TimeField] as string) ?? ''}
        maxLength={maxLength}
        readOnly={isReadOnly}
        name={type}
        placeholder={hints[type]}
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
      <Item className="mt-2" name="Päivä">
        {renderType('date')}
        (
        <input
          type="text"
          className="input-inline ml-1 w-[1.7em]"
          value={vals.weekDay}
          name="weekDay"
          placeholder="la"
          readOnly
          onFocus={focusChanged}
        />
        )
      </Item>
      <Item className="mt-2" name="Kellonaika">
        {renderType('hour')}:{renderType('minute')}:{renderType('second')}.
        {renderType('millisecond')}
        {renderType('timeZone')}
      </Item>
      <Item className="mt-2" name="Viikko">
        <input
          type="text"
          className="input-inline ml-1 w-[4.5em]"
          name="week"
          value={vals.week}
          readOnly
          placeholder="2016/52"
          onFocus={focusChanged}
        />
      </Item>
      <Item className="mt-2" name="Nimipäivä">
        <textarea
          className="input-inline ml-1 flex-1 resize-none"
          name="nameDay"
          value={vals.nameDay}
          onFocus={focusChanged as any}
          readOnly
        />
      </Item>
      <Item className="mt-2" name="Etsi nimipäivä">
        <div className="ml-1 relative w-full">
          <AutoComplete
            name="findNameDay"
            placeholder="Etsi nimipäivä"
            getSuggestions={findNameDays}
            renderSuggestion={renderMonthDayItem}
            getSuggestionValue={monthDayToInputValue}
            onSelectSuggestion={selectNameDay}
            fullWidth={true}
          />
        </div>
      </Item>
      <Item className="mt-2" name="Java/JS time">
        {renderType('javaTime')}
      </Item>
      <Item className="mt-2" name="Unixtime">
        {renderType('unixTime')}
      </Item>
      <Item className="mt-2" name="ISO-8601">
        {renderType('iso8601')}
      </Item>
      <Item className="mt-2" name="ISO-8601 UTC">
        {renderType('iso8601utc')}
      </Item>
    </HalfSection>
  );
}

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
